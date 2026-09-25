// The ORISON window title bar, as in the game: dark purple under the title, then a 4×4 Bayer
// ordered dither, tilted 45°, that fades into the light grey of the right-hand side. The
// band starts right after the title, so a longer title gets a shorter band. Ported from the
// client's reference (orison-dither-titlebar.html).
//
// Markup on the bar: [data-dither-anchor] (the dither starts after it) and
// [data-dither-limit] (fully grey before it). Colours come from --os-dark / --os-light, the
// dither pixel size from --os-px. The result is a small canvas turned into a data URL and
// used as the bar's background, repainted when the bar or the title change size.

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function paint(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const css = getComputedStyle(el);
  const px = parseFloat(css.getPropertyValue("--os-px")) || 2;
  const dark = hexToRgb(css.getPropertyValue("--os-dark") || "#181233");
  const light = hexToRgb(css.getPropertyValue("--os-light") || "#d2d2d2");
  const gap = 8; // px between the end of the title and the first dots
  const ratio = 0.72; // share of the title→buttons space the transition uses (as in-game)

  const anchor = el.querySelector("[data-dither-anchor]");
  const limit = el.querySelector("[data-dither-limit]");
  const startPx = anchor ? anchor.getBoundingClientRect().right - rect.left + gap : rect.width * 0.28;
  const limitPx = limit ? limit.getBoundingClientRect().left - rect.left : rect.width;
  const endPx = startPx + Math.max(px * 8, (limitPx - startPx) * ratio);

  const w = Math.ceil(rect.width / px);
  const h = Math.ceil(rect.height / px);
  const s = startPx / px;
  const e = endPx / px;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Upper rows start later: a 45° leading edge that never touches the title
      const u = x - (h - 1 - y);
      const t = Math.min(1, Math.max(0, (u - s) / (e - s)));
      const isLight = t > (BAYER[y % 4][x % 4] + 0.5) / 16;
      const f = isLight ? 0.82 + 0.18 * (y / Math.max(1, h - 1)) : 1; // grey darker at the top
      const c = isLight ? light : dark;
      const i = (y * w + x) * 4;
      img.data[i] = c[0] * f;
      img.data[i + 1] = c[1] * f;
      img.data[i + 2] = c[2] * f;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  el.style.backgroundImage = `url(${canvas.toDataURL()})`;
  el.style.backgroundSize = `${w * px}px ${h * px}px`;
  el.style.backgroundRepeat = "no-repeat";
  el.style.backgroundPosition = "left top";
}

/** Paints the bar and keeps it painted as it resizes; returns the cleanup. */
export function ditherBar(bar: HTMLElement) {
  paint(bar);
  const ro = new ResizeObserver(() => paint(bar));
  ro.observe(bar);
  const anchor = bar.querySelector("[data-dither-anchor]");
  if (anchor) ro.observe(anchor);
  // The title gets wider once the pixel font has loaded
  document.fonts?.ready.then(() => paint(bar));
  return () => ro.disconnect();
}
