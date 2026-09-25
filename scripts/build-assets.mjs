// Converts the raw client assets into web-ready media under public/media.
// Usage: npm run assets -- "<path to ArcaneCanvas folder>"
// Requires ffmpeg on PATH.
//
// Not generated here (delivered separately by the client, converted once and committed):
//   orison/wordmark.svg           ORISON_logo_white.svg, copied as is
//   orison/trailer-poster.webp    ORISON_cover.png (1920×1080), WebP q85
//   silentium/cover-horizontal.webp  Silentium_HorizontalCover.png, WebP q82
//   brand/about-portrait.webp     about_pic.jpg, 720px wide, WebP q80
//   brand/logo-*.webp             rasterised from brand/logo.svg with headless Chrome
//                                 (see README, "Logo"): the SVG is too heavy to draw live
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.argv[2] ?? 'C:/Users/Salvatore/Desktop/ArcaneCanvas';
const OUT = 'public/media';
if (!existsSync(SRC)) throw new Error(`Source folder not found: ${SRC}`);

const ff = (...args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
const webp = (input, output, filter, q = 80) =>
  ff('-i', input, ...(filter ? ['-vf', filter] : []), '-c:v', 'libwebp', '-quality', String(q), output);

for (const d of ['orison', 'silentium', 'brand']) mkdirSync(join(OUT, d), { recursive: true });

// Brand (the source of the rasterised logo, and of the link-preview and icon templates)
copyFileSync(join(SRC, 'ArcaneCanvas_Logo.svg'), join(OUT, 'brand/logo.svg'));

// ORISON: the Steam capsule (About's list of works), the mini CD, the screenshots
const O = join(SRC, 'ORISON');
webp(join(O, 'Main Capsule.png'), join(OUT, 'orison/capsule.webp'));

// Mini CD disc, cropped from the print mockups sheet.
webp(join(SRC, 'Mockups.jpeg'), join(OUT, 'orison/minicd-disc.webp'), 'crop=176:176:578:614', 85);

const shots = readdirSync(join(O, 'Screenshots')).filter((f) => f.endsWith('.png')).sort();
shots.forEach((f, i) => {
  // Full 1920px: next/image serves smaller widths for thumbnails, the viewer gets the full size.
  webp(join(O, 'Screenshots', f), join(OUT, `orison/shot-${i + 1}.webp`), null, 82);
});

// SILENTIUM: the poster is vertical, so the page hero uses horizontal crops of it.
const S = join(SRC, 'SILENTIUM', 'Silentium_CoverArt.png');
webp(S, join(OUT, 'silentium/cover.webp'), 'scale=900:-1');
webp(S, join(OUT, 'silentium/band-hands.webp'), 'crop=3000:1300:0:1900,scale=2400:-1');
webp(S, join(OUT, 'silentium/band-shadows.webp'), 'crop=3000:1100:0:0,scale=2400:-1');

console.log('Assets written to', OUT);
