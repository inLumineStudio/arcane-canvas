"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// The ORISON page is viewed through a 90s beige CRT monitor, the kind the game's machine
// runs on (made by Audeo, the in-game manufacturer): a fixed plastic bezel around the
// viewport, a recessed lip around rounded, vignetted glass with faint scanlines, and a chin
// with four front-panel buttons, the brand and the power button with its LED. The page
// scrolls "inside the screen", and the monitor powers on (line, picture, static) each time
// the page opens. Sizes come from --crt-* in globals.css ([data-crt]).
//
// Easter eggs on the chin (the binary rain in the background spells the hint in ASCII, see
// BinaryRain):
//   - pressing the buttons 1 1 4 2 3 1 opens the secret page, /orison/the-watcher;
//   - the power button makes the screen glitch, but it stays on.
// The buttons are real buttons, tappable on phones too (the chin is 44px tall there).

const SEQUENCE = "114231";
const SECRET_PATH = "/orison/the-watcher";
const GLITCH_MS = 900;

export function CrtFrame({ label }: { label: string }) {
  const router = useRouter();
  const presses = useRef("");
  const [blink, setBlink] = useState(0);

  function press(n: number) {
    setBlink((b) => b + 1); // the LED answers every press
    presses.current = (presses.current + n).slice(-SEQUENCE.length);
    if (presses.current === SEQUENCE) {
      presses.current = "";
      router.push(SECRET_PATH);
    }
  }

  // The glitch stays inside the glass: it shakes and scrambles the page (header, sections,
  // footer) and runs interference bars clipped to the screen, while the monitor itself
  // stays still. The hero full stop (Glitch.tsx) uses the same effect.
  function power() {
    const shell = document.querySelector<HTMLElement>("[data-crt]");
    if (!shell || shell.hasAttribute("data-glitching")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    navigator.vibrate?.([20, 30, 20]);
    shell.setAttribute("data-glitching", "");
    setTimeout(() => shell.removeAttribute("data-glitching"), GLITCH_MS);
  }

  return (
    <div className="crt-frame">
      {/* Interference bars of the power-button glitch, clipped to the glass (under the bezel) */}
      <div aria-hidden="true" className="crt-glitch" />
      <div aria-hidden="true" className="crt-screen" />
      <div aria-hidden="true" className="crt-boot">
        <div className="crt-boot-noise" />
        <div className="crt-boot-roll" />
        <div className="crt-boot-line" />
      </div>
      <div className="crt-chin">
        <span className="crt-knobs">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} type="button" className="crt-hit" aria-label={`Monitor button ${n}`} onClick={() => press(n)}>
              <span className="crt-knob" />
            </button>
          ))}
        </span>
        <span aria-hidden="true" className="crt-brand">
          {label}
        </span>
        <span className="crt-controls">
          <button type="button" className="crt-hit crt-hit-power" aria-label="Monitor power" onClick={power}>
            <span className="crt-power" />
          </button>
          <span aria-hidden="true" key={blink} className={`crt-led ${blink ? "crt-led-blink" : ""}`} />
        </span>
      </div>
    </div>
  );
}
