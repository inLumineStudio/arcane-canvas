"use client";

import { useRef } from "react";
import { getDictionary } from "@/content";
import { useInView } from "@/lib/useInView";

// Columns of drifting binary digits, like the ORISON key art. Pure CSS animation, paused
// while off-screen; on phones every other column is hidden (see .binary-rain in globals.css).
//
// The digits are not random: they spell the monitor easter egg's hint (orison.binaryHint)
// in 8-bit ASCII. Each column holds 4 bytes, each byte followed by a blank row, and the
// message carries on column after column, left to right, then starts over. Anyone who
// copies the digits and decodes them reads the hint. Position, speed and opacity are still
// seeded, so server and client markup always match.

const BYTES_PER_COLUMN = 4;

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const HINT_BYTES = [...getDictionary().orison.binaryHint].map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"));

/** Column i of the rain: bytes 4i … 4i+3 of the hint (wrapping around), one bit per row */
function columnText(i: number, offset: number) {
  return Array.from({ length: BYTES_PER_COLUMN }, (_, b) => {
    const byte = HINT_BYTES[(offset + i * BYTES_PER_COLUMN + b) % HINT_BYTES.length];
    return [...byte, " "].join("\n");
  }).join("\n");
}

export function BinaryRain({ columns = 28, seed = 7, className = "" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "0px");

  const rand = seeded(seed);
  // Each rain starts the message at a different byte, so no two look alike
  const offset = seed % HINT_BYTES.length;
  const cols = Array.from({ length: columns }, (_, i) => ({
    left: (i / columns) * 100 + rand() * (100 / columns) * 0.6,
    duration: 18 + rand() * 30,
    delay: -rand() * 40,
    opacity: 0.08 + rand() * 0.3,
    text: columnText(i, offset),
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
