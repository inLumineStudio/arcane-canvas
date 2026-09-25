# Arcane Canvas - website v1

Showcase site for Arcane Canvas, ORISON and SILENTIUM. Next.js (App Router) + Tailwind CSS v4, with plain CSS in `src/app/globals.css` where Tailwind isn't a good fit (CRT frame, glitch, binary rain).

```
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Routes

| Route        | Content |
|--------------|---------|
| `/`          | Hero/About, product bands (ORISON, SILENTIUM), contact |
| `/about`     | A letter from the developer (Arcane Canvas is one person), list of works, press |
| `/orison`    | CRT-framed page: parallax hero with the tracking eye, YouTube trailer, screenshots, terminal, easter eggs |
| `/silentium` | Format, episode list with Spotify Embed player, transcript list |
| `/privacy`   | Privacy notice (copy in `en.ts` → `privacy`), linked from the footer |
| `/silentium/transcripts/[slug]` | One episode transcript (or `lexicon`), read from the client's archive repo |

## Design

Each area speaks its own visual language; the rules are in the header comment of `src/app/globals.css`.

- **Studio (Home, About)**: built from the logo. The crystal "A" and its galaxy ring are the Home hero, with the studio's work orbiting on the ring; big monospace statements (after aggrocrab.com).
- **ORISON**: the game's own OS: flat windows with the in-game dithered title bar (`src/lib/dither.ts`), W95FA (the game's font), bevelled system buttons. Black around the eye, decoration only at the edges (after deltarune.com). The whole page sits inside a beige Audeo CRT monitor, whose chin buttons hide an easter egg (sequence 1 1 4 2 3 1 → the secret page `/orison/the-watcher`, noindex; the hint is the ASCII spelled by the binary rain; the power button glitches the screen).
- **SILENTIUM**: the poster's black, brick and flesh; photographic, film grain, format facts set like closing credits.

Avoid template tropes: uppercase letter-spaced labels over headings, gradient text, glows, numbered cards. Buttons use `.btn` / `.btn-quiet`, which restyle per theme.

## Where things live

- **Copy**: `src/content/en.ts` - every user-facing string. Add a locale by copying it and registering it in `src/content/index.ts`.
- **Links / IDs / email**: `src/config/site.ts` (items marked TBD are open points).
- **Easter eggs**: `src/content/easter-eggs.ts` - codes are stored as SHA-256 hashes; the file header lists where each code is hidden.
- **SILENTIUM episodes**: fetched from the Spotify Web API when `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` are set (see `.env.example`), otherwise `src/data/silentium-episodes.ts`.
- **SILENTIUM transcripts**: not stored here. `src/lib/transcripts.ts` reads the HTML of the client's archive repo (`site.silentium.transcripts`, `arcane-canvas/silentiumpodcast`) from GitHub and regenerates at most once an hour, so a new `episodeN.html` listed in its `index.html` appears on the site with no deploy. The markup is cut to an allowlist and restyled by `.transcript` in `globals.css`. If GitHub is unreachable, the SILENTIUM page links to the archive site instead.
- **Link previews** (title, description, image for WhatsApp, social, search): every page goes through `pageMetadata()` in `src/lib/metadata.ts`; the texts are `meta.*` in `en.ts` (descriptions under ~160 characters). Images are 1200×630 JPGs in `public/og`: `orison.jpg` is the Steam capsule cropped (`ffmpeg -i public/media/orison/capsule.webp -vf "scale=1200:-1,crop=1200:630" -q:v 3 public/og/orison.jpg`); `home.jpg` and `silentium.jpg` are drawn from `scripts/og/og.html` with headless Chrome, then converted with `ffmpeg -i x.png -q:v 3 public/og/x.jpg`:
  ```
  chrome --headless=new --hide-scrollbars --allow-file-access-from-files --window-size=1200,630 --virtual-time-budget=4000 --screenshot=home.png "file:///<repo>/scripts/og/og.html?v=home"
  ```
  After a change, check the preview with a debugger such as the Facebook Sharing Debugger (it also refreshes the cache).
- **SEO**:
  - Primary address `https://www.thearcanecanvas.com` (`site.url`), the domain set as primary on Vercel; the bare domain and `arcane-canvas.vercel.app` 308-redirect to it (the latter in `next.config.ts`). Preview deployments send `X-Robots-Tag: noindex`.
  - `src/app/robots.ts` → `/robots.txt`, `src/app/sitemap.ts` → `/sitemap.xml` (every page, the transcripts from the archive, image entries), `src/app/manifest.ts` → `/manifest.webmanifest`.
  - Structured data (JSON-LD) in `src/lib/structured-data.ts`, rendered by `<JsonLd>`: Organization + Person + WebSite (Home), ProfilePage (About), VideoGame with its trailer (ORISON), PodcastSeries with every episode (SILENTIUM), Article (transcripts), breadcrumbs. Check with Google's Rich Results Test after changes.
  - One H1 per page; on Home it is the visible statement, with the studio name for search engines and screen readers.
- **Icons**: `src/app/favicon.ico` (16/32/48 PNGs in one ICO), `src/app/icon.png`, `src/app/apple-icon.png` and `public/icons/*` (manifest, incl. a maskable one) are rendered from `scripts/og/icon.html` with headless Chrome (`?s=<size>&r=<radius %>&p=<logo %>`, same command as the link previews, `--window-size=<size>,<size> --default-background-color=00000000`).
- **404**: `src/app/not-found.tsx`, a wall of pixel eyes following the visitor (`EyeWall`).
- **Trailer cover**: `public/media/orison/trailer-poster.webp` is a local copy of the YouTube thumbnail (`i.ytimg.com/vi/<id>/maxresdefault.jpg`, converted to WebP), so nothing is requested from YouTube before play. Replace it if the trailer changes. `clip.*` (a screenshot montage) is only shown if `site.orison.youtubeTrailerId` is set back to null.
- **Media**: `public/media`, generated from the client's raw assets with `npm run assets -- "<path to ArcaneCanvas folder>"` (needs ffmpeg).
- **Fonts**: self-hosted WOFF2 in `src/app/fonts` (IBM Plex Mono preloaded; on demand: W95FA for ORISON, Forum and Cormorant Garamond Italic for SILENTIUM, Caveat for About's handwriting). Licences (OFL) in `src/app/fonts/licenses`. No requests to Google. W95FA is a trial that replaced VT323: to go back, point the `w95fa` font in `layout.tsx` at `vt323-latin-400-normal.woff2`.

## Placeholders to replace

- ORISON press kit link (`site.orison.pressKitUrl`): Dropbox folder from Marco. Until then the Press kit buttons open an email to press@.
- About/Home lorem ipsum (final texts promised by the client).
- Glitch panel and terminal unlock content (TBD with Marco).
