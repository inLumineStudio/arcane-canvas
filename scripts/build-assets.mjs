// Converts the raw client assets into web-ready media under public/media.
// Usage: npm run assets -- "<path to ArcaneCanvas folder>"
// Requires ffmpeg on PATH.
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

// Brand
copyFileSync(join(SRC, 'ArcaneCanvas_Logo.svg'), join(OUT, 'brand/logo.svg'));

// Orison
const O = join(SRC, 'ORISON');
webp(join(O, 'Library Hero.png'), join(OUT, 'orison/hero.webp'), 'scale=2400:-1');
webp(join(O, 'Main Capsule.png'), join(OUT, 'orison/capsule.webp'));
webp(join(O, 'Library Header v2.png'), join(OUT, 'orison/header.webp'));
webp(join(O, 'Vertical Capsule.png'), join(OUT, 'orison/vertical.webp'));
// The ORISON wordmark is not generated here: orison/wordmark.svg is the client's vector logo
// (ORISON_logo_white.svg), copied as is. It replaced a PNG cut out of the Main Capsule.

// Mini CD disc, cropped from the print mockups sheet.
webp(join(SRC, 'Mockups.jpeg'), join(OUT, 'orison/minicd-disc.webp'), 'crop=176:176:578:614', 85);

const shots = readdirSync(join(O, 'Screenshots')).filter((f) => f.endsWith('.png')).sort();
shots.forEach((f, i) => {
  const input = join(O, 'Screenshots', f);
  // Full 1920px: next/image serves smaller widths for thumbnails, the lightbox gets the full size.
  webp(input, join(OUT, `orison/shot-${i + 1}.webp`), null, 82);
});

// Placeholder "clip": slow pan over the screenshots until the real Steam trailers are delivered.
const per = 4;
// Each still is a single input frame; zoompan expands it to `per` seconds of motion.
const inputs = shots.flatMap((f) => ['-i', join(O, 'Screenshots', f)]);
const chains = shots
  .map((_, i) => `[${i}:v]scale=2560:-1,zoompan=z='1+0.0008*on':d=${per * 25}:s=1280x720:fps=25,format=yuv420p[v${i}]`)
  .join(';');
const concat = shots.map((_, i) => `[v${i}]`).join('') + `concat=n=${shots.length}:v=1:a=0[out]`;
const graph = `${chains};${concat}`;
ff(...inputs, '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', join(OUT, 'orison/clip.mp4'));
ff(...inputs, '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', join(OUT, 'orison/clip.webm'));
webp(join(O, 'Screenshots', shots[0]), join(OUT, 'orison/clip-poster.webp'), 'scale=1280:-1', 70);
// Mobile-first variants (640px), picked by <LoopVideo> below 768px
const clip = join(OUT, 'orison/clip.mp4');
ff('-i', clip, '-vf', 'scale=640:-2', '-an', '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', join(OUT, 'orison/clip-sm.mp4'));
ff('-i', clip, '-vf', 'scale=640:-2', '-an', '-c:v', 'libvpx-vp9', '-crf', '42', '-b:v', '0', '-row-mt', '1', join(OUT, 'orison/clip-sm.webm'));

// SILENTIUM: the poster is vertical, so we ship horizontal crops instead of the full poster as hero.
const S = join(SRC, 'SILENTIUM', 'Silentium_CoverArt.png');
webp(S, join(OUT, 'silentium/cover.webp'), 'scale=900:-1');
webp(S, join(OUT, 'silentium/band-hands.webp'), 'crop=3000:1300:0:1900,scale=2400:-1');
webp(S, join(OUT, 'silentium/band-shadows.webp'), 'crop=3000:1100:0:0,scale=2400:-1');
webp(S, join(OUT, 'silentium/hand.webp'), 'crop=1900:1300:1000:2000,scale=1200:-1');

console.log('Assets written to', OUT);
