"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gaze";
import { EyeCanvas } from "./EyeCanvas";
import { PixelEye, blinkAll } from "./PixelEye";

// The secret page behind the monitor buttons: what was watching through the machine.
// Cosmic horror by scale and indifference, not jump scares, built from the site's own eyes:
//   - rings of pixel eyes open one by one, from the centre out, and every one follows you;
//   - the rings turn slowly in opposite directions (the eyes stay upright), and the whole
//     field breathes: a geometry that never quite settles;
//   - the big ORISON eye surfaces in the middle;
//   - stand still and it notices: every eye blinks at once and the dark closes in; move and
//     it lets go;
//   - a few lines are typed out, with characters that corrupt for an instant.
// Everything that moves is CSS transform/opacity, except the gaze (PixelEye's shared loop),
// the stillness timer and the typing. Mobile first: phones get every other eye of the outer
// rings, and the gaze there follows tilt and taps (lib/gaze). Reduced motion: the scene is
// shown at rest, eyes open, all lines written, nothing turns or corrupts.

type Ring = { radius: number; count: number; size: number };

// Radii in vmax, so the outer rings reach the corners of any screen
const RINGS: Ring[] = [
  { radius: 17, count: 7, size: 26 },
  { radius: 27, count: 11, size: 32 },
  { radius: 39, count: 15, size: 38 },
  { radius: 53, count: 19, size: 44 },
  { radius: 69, count: 23, size: 50 },
];

const IDLE_MS = 3500;
const BLINK_EVERY_MS = 2600;
const TYPE_MS = 42;
const LINE_PAUSE_MS = 1100;
const TYPE_START_MS = 3800;
const GLYPHS = "█▓▒░ʘ◉⊙∴⌬";

/** The lines as they stand `ms` after the page opened: typing is a function of time, so a
 *  throttled tab (background, power saving) catches up instead of falling behind. */
function typedAt(lines: readonly string[], ms: number) {
  const out: string[] = [];
  let t = ms - TYPE_START_MS;
  for (const line of lines) {
    if (t < 0) break;
    const chars = Math.min(line.length, Math.floor(t / TYPE_MS) + 1);
    out.push(line.slice(0, chars));
    t -= line.length * TYPE_MS + LINE_PAUSE_MS;
  }
  return out;
}

export function Watcher({ lines, exit }: { lines: readonly string[]; exit: string }) {
  const root = useRef<HTMLDivElement>(null);
  // Milliseconds since the page opened (Infinity: everything written, for reduced motion)
  const [elapsed, setElapsed] = useState(0);
  const [tick, setTick] = useState(0);
  const typed = typedAt(lines, elapsed);
  const done = typed.length === lines.length && typed[typed.length - 1] === lines[lines.length - 1];

  // Stand still and it notices you
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    let last = performance.now();
    let lastBlink = 0;
    const wake = () => {
      last = performance.now();
      el.removeAttribute("data-idle");
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    const timer = setInterval(() => {
      const now = performance.now();
      if (now - last < IDLE_MS) return;
      el.setAttribute("data-idle", "");
      if (now - lastBlink > BLINK_EVERY_MS) {
        lastBlink = now;
        blinkAll();
      }
    }, 250);
    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  // One clock drives the typing (elapsed time) and the corrupted characters (tick).
  // Reduced motion: everything written at once, nothing flickers. Set after mount, since the
  // server cannot know the preference.
  useEffect(() => {
    const start = performance.now();
    if (prefersReducedMotion()) {
      const id = setTimeout(() => setElapsed(Infinity), 0);
      return () => clearTimeout(id);
    }
    const id = setInterval(() => {
      setElapsed(performance.now() - start);
      setTick((t) => t + 1);
    }, TYPE_MS);
    return () => clearInterval(id);
  }, []);

  // One character of the newest line flickers into a strange glyph now and then
  const corrupt = (text: string, i: number) => {
    const s = Math.floor(tick / 3); // ~130ms steps
    if (elapsed === Infinity || i !== typed.length - 1 || text.length < 4 || (s * 7 + i) % 5 !== 0) return text;
    const at = (s * 13) % text.length;
    if (text[at] === " ") return text;
    return text.slice(0, at) + GLYPHS[s % GLYPHS.length] + text.slice(at + 1);
  };

  return (
    <div ref={root} className="watcher relative isolate flex min-h-[calc(100dvh-var(--crt-top,0px)-var(--crt-bottom,0px))] flex-col overflow-hidden bg-black">
      {/* The rings of eyes */}
      <div aria-hidden="true" className="watcher-field pointer-events-none absolute inset-0">
        {RINGS.map((ring, k) => (
          <div
            key={k}
            className="watcher-ring"
            style={{ animationDuration: `${140 + k * 40}s`, animationDirection: k % 2 ? "reverse" : "normal" }}
          >
            {Array.from({ length: ring.count }, (_, i) => {
              const angle = (360 / ring.count) * i + k * 17;
              return (
                <span
                  key={i}
                  className={`watcher-slot ${k >= 2 && i % 2 ? "hidden md:block" : ""}`}
                  style={{ transform: `rotate(${angle}deg) translateX(${ring.radius}vmax) rotate(${-angle}deg) translate(-50%, -50%)` }}
                >
                  {/* Counter-turn: the eye stays upright while its ring turns */}
                  <span
                    className="watcher-upright"
                    style={{ animationDuration: `${140 + k * 40}s`, animationDirection: k % 2 ? "normal" : "reverse" }}
                  >
                    <span
                      className="watcher-eye"
                      style={{ animationDelay: `${0.6 + k * 0.9 + i * 0.07}s`, opacity: 0.55 + (4 - k) * 0.1 }}
                    >
                      <PixelEye size={ring.size} />
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* What was watching through the machine */}
      <div
        aria-hidden="true"
        className="watcher-great pointer-events-none absolute left-1/2 top-[36%] aspect-[960/560] w-[min(96vw,58rem)] -translate-x-1/2 -translate-y-1/2"
      >
        <EyeCanvas />
      </div>

      {/* The dark that closes in when you stand still */}
      <div aria-hidden="true" className="watcher-dark pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0" />

      {/* The transmission: typed out for the eye, whole for screen readers. Only the last
          three lines stay, on a dark band under the great eye: older ones are gone, as if
          the signal kept overwriting itself. */}
      <div className="relative mt-auto bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-8 pt-24 md:px-10 md:pb-12">
        <p className="sr-only">{lines.join(" ")}</p>
        <div aria-hidden="true" className="mx-auto min-h-[4.5em] max-w-2xl space-y-1 font-pixel text-xl leading-snug md:text-2xl">
          {typed.map((text, i) =>
            i < typed.length - 3 ? null : (
              <p key={i} className={i === typed.length - 1 ? "text-fg" : "text-muted/60"}>
                {corrupt(text, i)}
                {i === typed.length - 1 && !done && <span className="caret" />}
              </p>
            ),
          )}
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <Link
            href="/orison"
            className={`inline-flex min-h-11 items-center font-pixel text-lg underline decoration-dotted underline-offset-4 transition-colors duration-1000 hover:text-accent ${
              done ? "text-accent" : "text-muted/50"
            }`}
          >
            {exit}
          </Link>
        </div>
      </div>
    </div>
  );
}
