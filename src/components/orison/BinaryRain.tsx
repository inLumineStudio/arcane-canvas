"use client";

import { useRef } from "react";
import { useInView } from "@/lib/useInView";

// Columns of drifting binary digits, like the ORISON key art. Pure CSS animation, paused
// while off-screen; on phones every other column is hidden (see .binary-rain in globals.css).
// The digits come from a seeded generator so server and client markup always match.

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function BinaryRain({ columns = 28, rows = 36, seed = 7, className = "" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "0px");

  const rand = seeded(seed);
  const cols = Array.from({ length: columns }, (_, i) => ({
    left: (i / columns) * 100 + rand() * (100 / columns) * 0.6,
    duration: 18 + rand() * 30,
    delay: -rand() * 40,
    opacity: 0.08 + rand() * 0.3,
    text: Array.from({ length: rows }, () => (rand() < 0.5 ? "0" : "1")).join("\n"),
  }));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-paused={inView ? undefined : ""}
      className={`binary-rain pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {cols.map((c, i) => (
        <span
          key={i}
          style={{
            left: `${c.left}%`,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.text}
        </span>
      ))}
    </div>
  );
}
