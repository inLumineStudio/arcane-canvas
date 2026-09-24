import { PixelEye } from "./PixelEye";

// A wall of pixel eyes filling the screen, all turned to the visitor: they follow the cursor,
// blink at their own pace and share PixelEye's single animation loop.
// Mobile first: phones get every other column (5 × 6 eyes instead of 9 × 6), and since there
// is no cursor the gaze comes from lib/gaze: an idle wander, the phone's tilt (Android at
// once, iOS after the GyroPrompt tap), and every eye glances at a tapped point.
// Positions and sizes are seeded, so server and client render the same wall.

const COLS = 9;
const ROWS = 6;

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const rand = seeded(404);
const EYES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    left: ((col + 0.5 + (rand() - 0.5) * 0.55) / COLS) * 100,
    top: ((row + 0.5 + (rand() - 0.5) * 0.5) / ROWS) * 100,
    size: 30 + Math.round(rand() * 30),
    opacity: 0.45 + rand() * 0.5,
    wideOnly: col % 2 === 1,
  };
});

export function EyeWall() {
  return (
    <div aria-hidden="true" className="eye-wall pointer-events-none absolute inset-0 overflow-hidden">
      {EYES.map((e, i) => (
        <span
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${e.wideOnly ? "hidden md:block" : ""}`}
          style={{ left: `${e.left}%`, top: `${e.top}%`, opacity: e.opacity, lineHeight: 0 }}
        >
          <PixelEye size={e.size} />
        </span>
      ))}
    </div>
  );
}
