"use client";

import { useEffect, useRef } from "react";
import { getGaze, prefersReducedMotion } from "@/lib/gaze";

// Small pixel-art eyes scattered around the ORISON pages. They all share one animation
// loop, follow the gaze target (cursor, tilt, idle wander or a tap: see lib/gaze.ts) and
// blink now and then. The loop only runs while at least one eye is on screen.

type Entry = { iris: SVGGElement; lid: SVGRectElement; x: number; y: number; nextBlink: number };
const entries = new Map<Element, Entry>();
const visible = new Set<Element>();
let raf = 0;
let io: IntersectionObserver | null = null;

function observer() {
  io ??= new IntersectionObserver((records) => {
    for (const r of records) {
      if (r.isIntersecting) visible.add(r.target);
      else visible.delete(r.target);
    }
    if (visible.size && !raf) raf = requestAnimationFrame(tick);
  });
  return io;
}

function tick(ts: number) {
  raf = visible.size ? requestAnimationFrame(tick) : 0;
  const gaze = getGaze(ts);
  const reduced = prefersReducedMotion();
  for (const el of visible) {
    const e = entries.get(el);
    if (!e) continue;
    const r = el.getBoundingClientRect();
    const dx = gaze.x - (r.left + r.width / 2);
    const dy = gaze.y - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    const reach = Math.min(d / 240, 1);
    // Ease toward the target; the iris can travel 3 units sideways and 1.5 up/down
    e.x += ((dx / d) * reach * 3 - e.x) * 0.15;
    e.y += ((dy / d) * reach * 1.5 - e.y) * 0.15;
    e.iris.setAttribute("transform", `translate(${Math.round(e.x)} ${Math.round(e.y)})`);

    if (!reduced && ts > e.nextBlink) {
      e.lid.setAttribute("height", "10");
      setTimeout(() => e.lid.setAttribute("height", "0"), 120);
      e.nextBlink = ts + 2500 + Math.random() * 6000;
    }
  }
}

/** Every eye on the page blinks now, in unison (instead of each at its own pace). */
export function blinkAll() {
  for (const e of entries.values()) {
    e.lid.setAttribute("height", "10");
    setTimeout(() => e.lid.setAttribute("height", "0"), 180);
    e.nextBlink = performance.now() + 2500 + Math.random() * 6000;
  }
}

export function PixelEye({ className = "", size = 64 }: { className?: string; size?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const iris = useRef<SVGGElement>(null);
  const lid = useRef<SVGRectElement>(null);

  useEffect(() => {
    const el = root.current!;
    entries.set(el, { iris: iris.current!, lid: lid.current!, x: 0, y: 0, nextBlink: performance.now() + Math.random() * 5000 });
    observer().observe(el);
    return () => {
      io?.unobserve(el);
      entries.delete(el);
      visible.delete(el);
    };
  }, []);

  return (
    <span ref={root} aria-hidden="true" className={`inline-block ${className}`} style={{ width: size }}>
      <svg viewBox="0 0 16 10" shapeRendering="crispEdges" className="block h-auto w-full">
        <defs>
          <clipPath id="pixel-eye-almond">
            <path d="M0 5h1V4h2V3h2V2h6v1h2v1h2v1h1v1h-1v1h-2v1h-2v1H5V8H3V7H1V6H0z" />
          </clipPath>
        </defs>
        <path d="M0 5h1V4h2V3h2V2h6v1h2v1h2v1h1v1h-1v1h-2v1h-2v1H5V8H3V7H1V6H0z" fill="#0b2a44" />
        <g clipPath="url(#pixel-eye-almond)">
          <g ref={iris}>
            <rect x="5" y="2" width="6" height="6" fill="#1d92c8" />
            <rect x="4" y="3" width="8" height="4" fill="#1d92c8" />
            <rect x="6" y="3" width="4" height="4" fill="#35d0ff" />
            <rect x="7" y="4" width="2" height="2" fill="#02060b" />
            <rect x="7" y="4" width="1" height="1" fill="#b0e8ff" />
          </g>
          <rect ref={lid} x="0" y="0" width="16" height="0" fill="#050b1f" />
        </g>
      </svg>
    </span>
  );
}
