"use client";

import { useEffect, useRef } from "react";
import { getGaze, prefersReducedMotion } from "@/lib/gaze";

// The ORISON eye, ported from the client's eye.html prototype (second version):
// binary-digit iris rings inside an almond, a "dissolve" halo of single pixels around the
// pupil, and a pupil that follows the gaze target.
// Changes from the prototype: sized to its container instead of the window, transparent
// background (so no vignette, the page is already black around it), paused when off-screen,
// static under prefers-reduced-motion, and the devtools-blocking code is gone (the easter
// eggs need the console and the source).

const CFG = {
  eyeY: 0.695,
  lerpIris: 0.082,
  lerpPupil: 0.11,
  rotSpeed: 0.00015,
  flickerSpeed: 2.8,
  flickerAmt: 0.065,
  brightness: 2.85,
  targetFPS: 30,
  // Rebuild the digit rings every N frames: at 30fps that is ~7 rebuilds a second, and the
  // drift between them is imperceptible.
  ringSkip: 4,
  maxDpr: 1.5,
  // Offscreen buffers are capped at this many device pixels per design unit and upscaled
  // on the GPU, so a 4K screen does not pay for a 3000px fillText / pixel buffer.
  maxBufferScale: 2,
  gradThresh: 1.5,

  // Dissolve halo: not a radial gradient but a field of 1px dots whose *density* follows the
  // old gradient's falloff, packed against the pupil, thinning fast, then a whisper of dust.
  // It turns at rotSpeed, like the digit rings, so the grain drifts with them.
  haloRadius: 160, // field extent, in ring units
  haloCore: 86, // = pupil radius; density peaks here and falls outward
  haloDensity: 0.55, // lit-pixel fraction at the corona
  haloFalloff: 6.5, // corona falloff; higher = tighter against the pupil
  haloTail: 0.006, // density of the far dust
  haloTailFall: 3.0, // dust falloff; lower = dust reaches further
  haloEdgeFade: 0.7, // smoothstep the outer 30% to zero so the field has no visible edge
  haloAlphaMin: 0.28, // per-dot alpha jitter, keeps the field from banding
  haloAlphaMax: 0.78,
  haloSkip: 4, // advance the field every N frames, like ringSkip
};

const HALO_RGB = [10, 160, 215] as const;

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
    // Mobile first: phones get a lighter loop (24fps, rings and halo rebuilt every 5th frame).
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const FRAME_MS = 1000 / (desktop ? CFG.targetFPS : 24);
    const RING_SKIP = desktop ? CFG.ringSkip : 5;
    const HALO_SKIP = desktop ? CFG.haloSkip : 5;

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

    let W = 0, H = 0, CX = 0, CY = 0, dpr = 1, scale = 1;
    let smIX = 0, smIY = 0, smPX = 0, smPY = 0;
    let rot = 0;
    let ringCanvas: HTMLCanvasElement | null = null;
    let ringFrame = 0;
    // Offset from ringFrame so the two rebuilds never land on the same frame
    let haloFrame = 2;
    let last = 0;
    let raf = 0;
    let visible = false;
    let dark: CanvasGradient | null = null;
    let darkX = -9999, darkY = -9999;

    // Halo field. Dots are kept as unit vectors, so turning the field is a 2x2 matrix
    // multiply per dot instead of a cos/sin pair.
    let haloUX = new Float32Array(0), haloUY = new Float32Array(0), haloRadii = new Float32Array(0);
    let haloAlpha = new Uint8Array(0), haloPrev = new Int32Array(0);
    let haloCanvas: HTMLCanvasElement | null = null;
    let haloCtx: CanvasRenderingContext2D | null = null;
    let haloImg: ImageData | null = null;
    let haloSize = 0, haloRotApplied = 0;

    /** Device pixels per design unit in the offscreen buffers, capped (see maxBufferScale) */
    const bufferScale = () => Math.min(scale * dpr, CFG.maxBufferScale);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      CX = W / 2;
      CY = H / 2;
      // Fit the 960px-wide design into the container, whichever side is tighter
      scale = Math.min(W / 960, H / 560);
      ringCanvas = null;
      dark = null;
      buildHalo();
    }

    // Dot positions come from inverse-transform sampling of the radial density curve
    //   p(r) = density·(core/r)^falloff + tail·(core/r)^tailFall
    // rather than testing every pixel. -ln(1-p) corrects for two dots landing on the same
    // pixel, so the measured coverage matches p near the corona. Runs once per resize.
    function buildHalo() {
      const bs = bufferScale();
      const core = CFG.haloCore * bs;
      const mid = Math.ceil(CFG.haloRadius * bs);
      haloSize = mid * 2;
      // A container measured at 0px (hidden, not laid out yet) has nothing to draw into:
      // skip the halo until the next resize instead of asking for a 0×0 pixel buffer
      if (haloSize < 1) {
        haloCanvas = null;
        haloImg = null;
        haloPrev = new Int32Array(0);
        return;
      }

      const cum = new Float64Array(mid + 1);
      let total = 0;
      for (let r = 0; r < mid; r++) {
        const q = core / Math.max(r, core);
        let p = CFG.haloDensity * q ** CFG.haloFalloff + CFG.haloTail * q ** CFG.haloTailFall;
        const t = r / mid;
        if (t > CFG.haloEdgeFade) {
          const k = (t - CFG.haloEdgeFade) / (1 - CFG.haloEdgeFade);
          p *= 1 - k * k * (3 - 2 * k);
        }
        p = Math.min(Math.max(p, 0), 0.92);
        total += -Math.log(1 - p) * Math.PI * 2 * (r + 0.5);
        cum[r + 1] = total;
      }

      const n = Math.round(total);
      haloUX = new Float32Array(n);
      haloUY = new Float32Array(n);
      haloRadii = new Float32Array(n);
      haloAlpha = new Uint8Array(n);
      haloPrev = new Int32Array(n).fill(-1);
      const aLo = CFG.haloAlphaMin * 255;
      const aSpan = (CFG.haloAlphaMax - CFG.haloAlphaMin) * 255;
      for (let k = 0; k < n; k++) {
        const u = Math.random() * total;
        let lo = 0, hi = mid;
        while (lo < hi) {
          const m = (lo + hi) >> 1;
          if (cum[m + 1] < u) lo = m + 1;
          else hi = m;
        }
        const th = Math.random() * Math.PI * 2;
        haloRadii[k] = lo + Math.random();
        haloUX[k] = Math.cos(th);
        haloUY[k] = Math.sin(th);
        haloAlpha[k] = (aLo + Math.random() * aSpan) | 0;
      }

      haloCanvas = document.createElement("canvas");
      haloCanvas.width = haloCanvas.height = haloSize;
      haloCtx = haloCanvas.getContext("2d")!;
      haloImg = haloCtx.createImageData(haloSize, haloSize);
      // RGB is written once; each step only touches the alpha of pixels a dot left or reached
      const d = haloImg.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = HALO_RGB[0];
        d[i + 1] = HALO_RGB[1];
        d[i + 2] = HALO_RGB[2];
      }
      haloRotApplied = rot;
      stepHalo(0, 1);
    }

    // Turns every dot by dRot and rewrites the alpha channel. At rotSpeed a dot crosses a
    // pixel roughly twice a second, so the field reads as a slow drift, not a swap.
    function stepHalo(dRot: number, flicker: number) {
      if (!haloImg || !haloCtx) return;
      const d = haloImg.data;
      const mid = haloSize / 2;
      const cs = Math.cos(dRot), sn = Math.sin(dRot);
      for (let k = 0; k < haloPrev.length; k++) if (haloPrev[k] >= 0) d[haloPrev[k]] = 0;
      for (let k = 0; k < haloPrev.length; k++) {
        const nx = haloUX[k] * cs - haloUY[k] * sn;
        const ny = haloUX[k] * sn + haloUY[k] * cs;
        haloUX[k] = nx;
        haloUY[k] = ny;
        const x = (mid + nx * haloRadii[k]) | 0;
        const y = (mid + ny * haloRadii[k]) | 0;
        if (x < 0 || y < 0 || x >= haloSize || y >= haloSize) {
          haloPrev[k] = -1;
          continue;
        }
        const i = (y * haloSize + x) * 4 + 3;
        d[i] = haloAlpha[k] * flicker;
        haloPrev[k] = i;
      }
      haloCtx.putImageData(haloImg, 0, 0);
    }

    function buildRings(flicker: number, dt: number) {
      const bs = bufferScale();
      const size = Math.ceil(380 * bs * 2 + 20);
      if (!ringCanvas || ringCanvas.width !== size) {
        ringCanvas = document.createElement("canvas");
        ringCanvas.width = ringCanvas.height = size;
      }
      const rc = ringCanvas.getContext("2d")!;
      const mid = size / 2;
      rc.clearRect(0, 0, size, size);
      for (const rg of rings) {
        rc.font = `${rg.fs * bs}px monospace`;
        rc.fillStyle = rg.color;
        for (const ch of rg.chars) {
          if (Math.random() < ch.flipRate * dt) ch.val = ch.val === "0" ? "1" : "0";
          const a = ch.baseAngle + rot;
          rc.globalAlpha = Math.min(1, ch.bright * flicker * CFG.brightness);
          rc.fillText(ch.val, mid + Math.cos(a) * rg.r * bs, mid + Math.sin(a) * rg.r * CFG.eyeY * bs);
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
        buildRings(flicker, dt);
      }
      // Advances by the rotation accrued since the last step, so the field keeps pace with
      // the rings whatever the skip or the frame rate
      if (++haloFrame >= HALO_SKIP) {
        haloFrame = 0;
        stepHalo(rot - haloRotApplied, flicker);
        haloRotApplied = rot;
      }

      // The dark centre only needs a new gradient once the iris has drifted a little
      const darkR = 117 * scale;
      if (!dark || Math.hypot(icx - darkX, icy - darkY) > CFG.gradThresh) {
        dark = ctx.createRadialGradient(icx, icy, 0, icx, icy, darkR);
        dark.addColorStop(0, "rgba(2,6,11,1)");
        dark.addColorStop(0.72, "rgba(2,6,11,1)");
        dark.addColorStop(1, "rgba(2,6,11,0)");
        darkX = icx;
        darkY = icy;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      almond(CX, CY, scale);
      ctx.clip();

      if (ringCanvas) {
        const half = (ringCanvas.width / 2) * (scale / bufferScale());
        ctx.drawImage(ringCanvas, icx - half, icy - half, half * 2, half * 2);
      }

      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.arc(icx, icy, darkR, 0, Math.PI * 2);
      ctx.fill();

      // Halo: smoothing off so the dots stay hard pixels when the buffer is upscaled
      if (haloCanvas) {
        const haloR = CFG.haloRadius * scale;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(haloCanvas, pcx - haloR, pcy - haloR, haloR * 2, haloR * 2);
        ctx.imageSmoothingEnabled = true;
      }

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