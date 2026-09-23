"use client";

// Where the eyes on the page should look, in viewport pixels (brief §4).
//   touch (mobile first) → an idle wander; the device tilt once the gyroscope is on;
//                          a tap makes every eye glance at the finger for a moment
//   mouse                → the cursor
//   reduced motion       → straight ahead (viewport centre)
// One set of listeners is shared by every eye on the page.

type Mode = "idle" | "gyro" | "mouse";

const TAP_GLANCE_MS = 1600;

const state = {
  mode: "idle" as Mode,
  x: 0,
  y: 0,
  tapX: 0,
  tapY: 0,
  tapUntil: 0,
  tiltX: 0, // -1..1
  tiltY: 0,
  baseBeta: null as number | null,
  baseGamma: null as number | null,
  listening: false,
  reduced: false,
};

function listen() {
  if (state.listening || typeof window === "undefined") return;
  state.listening = true;

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  state.reduced = mq.matches;
  mq.addEventListener("change", (e) => (state.reduced = e.matches));

  state.x = window.innerWidth / 2;
  state.y = window.innerHeight / 2;

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      state.mode = "mouse";
      state.x = e.clientX;
      state.y = e.clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType !== "touch") return;
      state.tapX = e.clientX;
      state.tapY = e.clientY;
      state.tapUntil = performance.now() + TAP_GLANCE_MS;
    },
    { passive: true },
  );

  // Android exposes orientation without a prompt, so every eye gets tilt tracking for free.
  // iOS needs a tap first: see <GyroPrompt>.
  if (isTouchDevice() && !gyroNeedsPermission()) void enableGyro();
}

function onOrientation(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;

  // Map to screen axes: in landscape the device's front/back tilt becomes left/right.
  const angle = screen.orientation?.angle ?? 0;
  let x = e.gamma;
  let y = e.beta;
  if (angle === 90) [x, y] = [e.beta, -e.gamma];
  else if (angle === 270 || angle === -90) [x, y] = [-e.beta, e.gamma];

  // Neutral = however the visitor happens to hold the phone. The baseline slowly follows
  // the current pose, so the eyes re-centre if they settle into a new position.
  if (state.baseGamma === null || state.baseBeta === null) {
    state.baseGamma = x;
    state.baseBeta = y;
  }
  state.baseGamma += (x - state.baseGamma) * 0.005;
  state.baseBeta += (y - state.baseBeta) * 0.005;

  state.mode = "gyro";
  state.tiltX = Math.max(-1, Math.min(1, (x - state.baseGamma) / 25));
  state.tiltY = Math.max(-1, Math.min(1, (y - state.baseBeta) / 25));
}

type OrientationCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

/** True when tilt tracking is possible but needs a tap first (iOS). */
export function gyroNeedsPermission(): boolean {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return false;
  return typeof (DeviceOrientationEvent as OrientationCtor).requestPermission === "function";
}

/** Must be called from a user gesture on iOS. */
export async function enableGyro(): Promise<boolean> {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return false;
  const ctor = DeviceOrientationEvent as OrientationCtor;
  try {
    if (ctor.requestPermission && (await ctor.requestPermission()) !== "granted") return false;
  } catch {
    return false;
  }
  window.addEventListener("deviceorientation", onOrientation, { passive: true });
  return true;
}

/** Current gaze target in viewport coordinates. `t` is a timestamp in ms (for the idle wander). */
export function getGaze(t: number): { x: number; y: number } {
  listen();
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (state.reduced) return { x: w / 2, y: h / 2 };
  if (performance.now() < state.tapUntil) return { x: state.tapX, y: state.tapY };

  switch (state.mode) {
    case "mouse":
      return { x: state.x, y: state.y };
    case "gyro":
      return { x: w / 2 + state.tiltX * w * 0.6, y: h / 2 + state.tiltY * h * 0.6 };
    default: {
      // Slow Lissajous drift with the occasional dart, like someone reading the room.
      const s = t / 1000;
      const dart = Math.sin(s * 0.37) > 0.92 ? Math.sin(s * 5) * 0.25 : 0;
      return {
        x: w / 2 + (Math.sin(s * 0.45) * 0.35 + dart) * w,
        y: h / 2 + Math.sin(s * 0.31 + 1.3) * 0.25 * h,
      };
    }
  }
}

export function prefersReducedMotion(): boolean {
  listen();
  return state.reduced;
}
