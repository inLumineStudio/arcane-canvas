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

// Ellipse as a path, starting at the far right, going over the top (back half, upside down
// and dimmed, like the far side of an orbit) then under the logo left to right, so the
// front half reads upright.
const RING = `M ${CX + RX} ${CY} A ${RX} ${RY} 0 1 0 ${CX - RX} ${CY} A ${RX} ${RY} 0 1 0 ${CX + RX} ${CY}`;
const SPEED = 0.018; // px of path per ms

export function LogoOrbit({ words, alt }: { words: readonly string[]; alt: string }) {
  const paths = useRef<SVGTextPathElement[]>([]);
  const root = useRef<SVGSVGElement>(null);
  const text = Array(3).fill(words.join("  ✦  ")).join("  ✦  ") + "  ✦  ";

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    let last = 0;
    let offset = 0;
    let visible = false;
    const length = (root.current!.querySelector("#orbit-ring") as SVGPathElement).getTotalLength();

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(ts - last, 50) : 16;
      last = ts;
      offset = (offset - SPEED * dt) % length;
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
  }, []);

  const ring = (half: "back" | "front", i: number) => (
    <g clipPath={`url(#orbit-${half})`} transform={`rotate(${TILT} ${CX} ${CY})`}>
      <path d={RING} fill="none" stroke="#8ebfe7" strokeOpacity={half === "back" ? 0.15 : 0.35} strokeWidth="1" />
      <text
        fill={half === "back" ? "#8ebfe7" : "#e4eef9"}
        fillOpacity={half === "back" ? 0.35 : 0.95}
        fontSize="17"
        letterSpacing="1.5"
        dy="-7"
        className="font-mono"
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
      </defs>
      {ring("back", 0)}
      <image href="/media/brand/logo.svg" x={CX - 170} y={CY - 150} width="340" height="265" className="logo-float" />
      {ring("front", 1)}
    </svg>
  );
}
