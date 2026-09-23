"use client";

import { useState, useSyncExternalStore } from "react";
import { enableGyro, gyroNeedsPermission } from "@/lib/gaze";

// On phones the eyes wander on their own (and turn on tilt tracking by themselves on Android).
// iOS only allows the gyroscope after a tap, so there we offer a small tap target.

const noop = () => () => {};
const needsTap = () => gyroNeedsPermission() && window.matchMedia("(pointer: coarse)").matches;

export function GyroPrompt({ label }: { label: string }) {
  const ask = useSyncExternalStore(noop, needsTap, () => false);
  const [done, setDone] = useState(false);

  if (!ask || done) return null;
  return (
    <button
      type="button"
      onClick={async () => {
        await enableGyro();
        setDone(true);
      }}
      className="min-h-11 px-3 font-pixel text-lg text-muted underline decoration-dotted underline-offset-4 hover:text-accent"
    >
      {label}
    </button>
  );
}
