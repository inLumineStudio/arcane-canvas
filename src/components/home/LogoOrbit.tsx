"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gaze";

// The Home hero is the logo itself: the crystal "A" with its galaxy ring. The words of what
// the studio makes ride that ring. The ring is drawn twice, clipped into a back half (behind
// the logo, dimmer) and a front half (over it), so the words pass behind and in front.
// The text scrolls with requestAnimationFrame, only while visible, and stays put under
// prefers-reduced-motion.

const W = 640;
const H = 520;
const CX = W / 2;
const CY = H / 2;
const RX = 300;
const RY = 78;
const TILT = -16;
// The drawing only uses the middle band of the canvas: the tilted ring spans about CY ± 112
// (plus its text) and the logo, floating, reaches up to y ≈ 102. Cropping the viewBox to
// that band keeps the look and scale identical but drops the dead space above and below,
// so the logo can share one screen with the statement. The SVG fills its box and fits the
// drawing inside it (default preserveAspectRatio "meet"), so the parent decides the size.
const CROP_Y = 96;
const CROP_H = 328;

// Ellipse as a path, in four quarters: from the top (behind the logo) to the left, under the
// logo left to right (front half, upright), up the right side and back over the top (back
// half, upside down and dimmed, like the far side of an orbit).
// The path starts and ends at the top on purpose: that is where glyphs are born and die as
// the text scrolls, and there they are hidden by the "A" and faded out by SEAM_FADE, so the
// loop has no visible cut. At the far right, the old start, glyphs popped in and out.
const Q = `${RX} ${RY} 0 0 0`;
const RING = `M ${CX} ${CY - RY} A ${Q} ${CX - RX} ${CY} A ${Q} ${CX} ${CY + RY} A ${Q} ${CX + RX} ${CY} A ${Q} ${CX} ${CY - RY}`;
const SEAM_FADE = 110; // half-width of the fade around the seam, in ring units
const SPEED = 0.018; // px of path per ms

export function LogoOrbit({ words, alt }: { words: readonly string[]; alt: string }) {
  const paths = useRef<SVGTextPathElement[]>([]);
  const probe = useRef<SVGTextElement>(null);
  const root = useRef<SVGSVGElement>(null);
  // One period of the loop. The text is this unit repeated, and the offset wraps at the
  // unit's measured length (not the ring's), so the seamless loop has no jump and no gap.
  const unit = words.join(" ✦ ") + " ✦ ";
  const text = unit.repeat(4);

  useEffect(() => {
    // The words fade in (see .orbit-words) once they are measured in their real font,
    // instead of snapping in with the fallback font and reflowing.
    const reveal = () => root.current?.setAttribute("data-ready", "");
    if (prefersReducedMotion()) {
      reveal();
      return;
    }
    let raf = 0;
    let last = 0;
    let offset = 0;
    let visible = false;
    let period = 0;
    const length = (root.current!.querySelector("#orbit-ring") as SVGPathElement).getTotalLength();

    // Measured on a hidden twin with the same font settings: two units minus one, so the
    // trailing space SVG trims off the end cancels out. Redone once the webfont is in,
    // since the fallback font has different advances. The text is then made long enough
    // to cover the ring plus one period, so the tail never runs short while it scrolls.
    const measure = () => {
      const t = probe.current!;
      t.textContent = unit;
      const one = t.getComputedTextLength();
      t.textContent = unit + unit;
      period = t.getComputedTextLength() - one;
      if (period <= 0) return;
      const full = unit.repeat(Math.ceil(length / period) + 2);
      for (const p of paths.current) p.textContent = full;
      offset %= period;
    };
    measure();
    if (document.fonts) {
      document.fonts.ready.then(() => {
        measure();
        reveal();
      });
    } else reveal();

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(ts - last, 50) : 16;
      last = ts;
      if (period <= 0) return;
      offset = (offset - SPEED * dt) % period;
      for (const p of paths.current) p.setAttribute("startOffset", String(offset));
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(root.current!);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [unit]);

  const ring = (half: "back" | "front", i: number) => (
    <g clipPath={`url(#orbit-${half})`} transform={`rotate(${TILT} ${CX} ${CY})`}>
      <path d={RING} fill="none" stroke="#8ebfe7" strokeOpacity={half === "back" ? 0.15 : 0.35} strokeWidth="1" />
      <text
        fill={half === "back" ? "#8ebfe7" : "#e4eef9"}
        fillOpacity={half === "back" ? 0.35 : 0.95}
        fontSize="17"
        letterSpacing="1.5"
        dy="-7"
        className="orbit-words font-mono"
        mask={half === "back" ? "url(#orbit-seam)" : undefined}
      >
        <textPath
          ref={(el) => {
            if (el) paths.current[i] = el;
          }}
          href="#orbit-ring"
        >
          {text}
        </textPath>
      </text>
    </g>
  );

  return (
    <svg ref={root} viewBox={`0 ${CROP_Y} ${W} ${CROP_H}`} role="img" aria-label={alt} className="h-full w-full overflow-visible">
      <defs>
        <path id="orbit-ring" d={RING} />
        {/* Halves of the ring in its own (untilted) space: above the centre line is "behind" */}
        <clipPath id="orbit-back">
          <rect x="-50" y="-200" width={W + 100} height={CY + 200} />
        </clipPath>
        <clipPath id="orbit-front">
          <rect x="-50" y={CY} width={W + 100} height={H} />
        </clipPath>
        {/* Fades the back words to nothing around the seam at the top, behind the "A" */}
        <linearGradient id="orbit-seam-fade" gradientUnits="userSpaceOnUse" x1={CX - SEAM_FADE} x2={CX + SEAM_FADE} y1="0" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.4" stopColor="#000" />
          <stop offset="0.6" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id="orbit-seam" maskUnits="userSpaceOnUse" x="-50" y="-200" width={W + 100} height={H + 400}>
          <rect x="-50" y="-200" width={W + 100} height={H + 400} fill="url(#orbit-seam-fade)" />
        </mask>
      </defs>
      <text ref={probe} visibility="hidden" fontSize="17" letterSpacing="1.5" className="font-mono" aria-hidden />
      {ring("back", 0)}
      <image href="/media/brand/logo.svg" x={CX - 170} y={CY - 150} width="340" height="265" className="logo-float" />
      {ring("front", 1)}
    </svg>
  );
}
