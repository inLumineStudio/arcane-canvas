"use client";

import { useEffect, useRef } from "react";
import { getGaze, prefersReducedMotion } from "@/lib/gaze";

// The ORISON eye, ported from the client's eye.html prototype:
// binary-digit iris rings inside an almond, with a pupil that follows the gaze target.
// Changes from the prototype: sized to its container instead of the window, transparent
// background, paused when off-screen, static under prefers-reduced-motion, and the
// devtools-blocking code is gone (the easter eggs need the console and the source).

const CFG = {
  eyeY: 0.695,
  lerpIris: 0.082,
  lerpPupil: 0.11,
  rotSpeed: 0.00015,
  flickerSpeed: 2.8,
  flickerAmt: 0.065,
  brightness: 2.85,
  targetFPS: 30,
  ringSkip: 2,
  maxDpr: 1.5,
};

// [radius, digits, font size, colour]
const RDATA: [number, number, number, string][] = [
  [118, 74, 6.5, "#0d3a52"],
  [138, 82, 6.9, "#104e6e"],
  [159, 88, 7.4, "#14648c"],
  [181, 94, 7.9, "#187aaa"],
  [204, 100, 8.4, "#1d92c8"],
  [228, 106, 8.9, "#22aae0"],
  [253, 112, 9.4, "#28bef5"],
  [279, 118, 9.9, "#35d0ff"],
  [305, 124, 10.3, "#4adcff"],
  [331, 130, 10.7, "#60e8ff"],
  [348, 130, 11.1, "#7ef4ff"],
];

type Ring = {
  r: number;
  fs: number;
  color: string;
  chars: { baseAngle: number; val: string; flipRate: number; bright: number }[];
};

export function EyeCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    // Mobile first: phones get a lighter loop (24fps, digit rings redrawn every 3rd frame).
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const FRAME_MS = 1000 / (desktop ? CFG.targetFPS : 24);
    const RING_SKIP = desktop ? CFG.ringSkip : 3;

    const rings: Ring[] = RDATA.map(([r, n, fs, color]) => ({
      r,
      fs,
      color,
      chars: Array.from({ length: n }, (_, i) => ({
        baseAngle: (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.22,
        val: Math.random() < 0.5 ? "0" : "1",
        flipRate: Math.random() * 0.0028 + 0.0003,
        bright: 0.75 + Math.random() * 0.25,
      })),
    }));

    const dots = Array.from({ length: 130 }, () => {
      const a = Math.random() * Math.PI * 2;
      const r = 352 + Math.random() * 72;
      return {
        ox: Math.cos(a) * r,
        oy: Math.sin(a) * r * CFG.eyeY,
        sz: Math.random() * 1.3 + 0.2,
        al: Math.random() * 0.13 + 0.03,
      };
    });

    let W = 0, H = 0, CX = 0, CY = 0, dpr = 1;
    let smIX = 0, smIY = 0, smPX = 0, smPY = 0;
    let rot = 0;
    let ringCanvas: HTMLCanvasElement | null = null;
    let ringFrame = 0;
    let last = 0;
    let raf = 0;
    let visible = false;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      CX = W / 2;
      CY = H / 2;
      ringCanvas = null;
    }

    function buildRings(scale: number, flicker: number, dt: number) {
      const size = Math.ceil((380 * scale * 2 + 20) * dpr);
      if (!ringCanvas || ringCanvas.width !== size) {
        ringCanvas = document.createElement("canvas");
        ringCanvas.width = ringCanvas.height = size;
      }
      const rc = ringCanvas.getContext("2d")!;
      const mid = size / 2;
      rc.clearRect(0, 0, size, size);
      for (const rg of rings) {
        rc.font = `${rg.fs * scale * dpr}px monospace`;
        rc.fillStyle = rg.color;
        for (const ch of rg.chars) {
          if (Math.random() < ch.flipRate * dt) ch.val = ch.val === "0" ? "1" : "0";
          const a = ch.baseAngle + rot;
          rc.globalAlpha = Math.min(1, ch.bright * flicker * CFG.brightness);
          rc.fillText(
            ch.val,
            mid + Math.cos(a) * rg.r * scale * dpr,
            mid + Math.sin(a) * rg.r * CFG.eyeY * scale * dpr,
          );
        }
      }
      rc.globalAlpha = 1;
    }

    function almond(cx: number, cy: number, s: number) {
      const rx = 355 * s, ryT = 192 * s, ryB = 140 * s;
      ctx.beginPath();
      ctx.moveTo(cx - rx, cy);
      ctx.bezierCurveTo(cx - rx * 0.36, cy - ryT, cx + rx * 0.36, cy - ryT, cx + rx, cy);
      ctx.bezierCurveTo(cx + rx * 0.36, cy + ryB, cx - rx * 0.36, cy + ryB, cx - rx, cy);
      ctx.closePath();
    }

    function draw(ts: number, dt: number) {
      // Gaze target relative to the eye centre, in canvas pixels
      const rect = canvas.getBoundingClientRect();
      const gaze = getGaze(ts);
      const tx = gaze.x - rect.left - CX;
      const ty = gaze.y - rect.top - CY;

      const li = Math.min(CFG.lerpIris * dt, 1);
      const lp = Math.min(CFG.lerpPupil * dt, 1);
      smIX += (tx - smIX) * li;
      smIY += (ty - smIY) * li;
      smPX += (tx - smPX) * lp;
      smPY += (ty - smPY) * lp;
      rot += CFG.rotSpeed * dt;

      // Fit the 960px-wide design into the container, whichever side is tighter
      const scale = Math.min(W / 960, H / 560);
      const range = Math.max(W, 1) * 0.5;

      const dx = Math.max(-1, Math.min(1, smIX / range));
      const dy = Math.max(-1, Math.min(1, smIY / range));
      const edd = Math.min(dx * dx + dy * dy, 1);
      const icx = CX + dx * edd * 28 * scale;
      const icy = CY + dy * edd * 18 * scale;

      const pdx = Math.max(-1, Math.min(1, smPX / range));
      const pdy = Math.max(-1, Math.min(1, smPY / range));
      const pt = Math.min(Math.hypot(pdx, pdy) * 1.1, 1);
      const pcx = icx + pdx * pt * 64 * scale;
      const pcy = icy + pdy * pt * 40 * scale;

      const flicker = 1 + Math.sin(ts * 0.001 * CFG.flickerSpeed) * CFG.flickerAmt;
      if (++ringFrame >= RING_SKIP || !ringCanvas) {
        ringFrame = 0;
        buildRings(scale, flicker, dt);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      almond(CX, CY, scale);
      ctx.clip();

      ctx.fillStyle = "#071a25";
      for (const d of dots) {
        ctx.globalAlpha = d.al;
        ctx.beginPath();
        ctx.arc(icx + d.ox * scale, icy + d.oy * scale, d.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (ringCanvas) {
        const half = ringCanvas.width / dpr / 2;
        ctx.drawImage(ringCanvas, icx - half, icy - half, half * 2, half * 2);
      }

      const darkR = 117 * scale;
      const dark = ctx.createRadialGradient(icx, icy, 0, icx, icy, darkR);
      dark.addColorStop(0, "rgba(2,6,11,1)");
      dark.addColorStop(0.72, "rgba(2,6,11,1)");
      dark.addColorStop(1, "rgba(2,6,11,0)");
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.arc(icx, icy, darkR, 0, Math.PI * 2);
      ctx.fill();

      const haloR = 150 * scale;
      const halo = ctx.createRadialGradient(pcx, pcy, 60 * scale, pcx, pcy, haloR);
      halo.addColorStop(0, "rgba(10,160,215,0.18)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(pcx, pcy, haloR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(pcx, pcy, 86 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.42;
      ctx.fillStyle = "#b0e8ff";
      ctx.beginPath();
      ctx.arc(pcx - 14 * scale, pcy - 18 * scale, 5.8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function frame(ts: number) {
      raf = requestAnimationFrame(frame);
      if (ts - last < FRAME_MS) return;
      const dt = last ? Math.min((ts - last) / 16.667, 4) : 1;
      last = ts;
      draw(ts, dt);
    }

    function start() {
      if (raf || !visible) return;
      if (prefersReducedMotion()) {
        draw(0, 1); // one still frame, looking straight ahead
        return;
      }
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (!raf && visible) draw(0, 1);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
