# Arcane Canvas - website

Showcase site for Arcane Canvas (Marco D'Antino) and its two works, ORISON (narrative PC game) and SILENTIUM (horror fiction podcast). Next.js 16 (App Router) + Tailwind CSS v4, with plain CSS in `src/app/globals.css` where Tailwind isn't a good fit (CRT monitor, windows, glitches, binary rain). Live at **https://www.thearcanecanvas.com** (Vercel, deployed from `main`).

```
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start      # production server (the in-app preview has it as "next-prod", port 3100)
npm run lint
npx tsc --noEmit
```

## Routes

| Route | Content |
|-------|---------|
| `/` | Hero (the logo with its orbiting words + the statement, one screen), intro, Projects (ORISON and SILENTIUM bands), contact |
| `/about` | A letter from the developer (Arcane Canvas is one person), photo, list of works, press |
| `/orison` | Inside the Audeo CRT monitor: parallax hero with the tracking eye, README, YouTube trailer, screenshots with a full-screen viewer, terminal, easter eggs |
| `/orison/the-watcher` | Secret page behind the monitor buttons (sequence 1 1 4 2 3 1): rings of eyes around the great eye, a short transmission. `noindex`, not in the sitemap |
| `/silentium` | Format, episodes with the Spotify player (loaded on request), transcripts |
| `/silentium/transcripts/[slug]` | One episode transcript, or `lexicon`, read live from the client's archive repo |
| `/privacy` | Privacy notice, linked from the footer |
| any other path | 404: a wall of pixel eyes that follow the visitor |

## Design

Each area speaks its own visual language; the rules are in the header comment of `src/app/globals.css`.

- **Studio (Home, About)**: built from the logo. The crystal "A" and its galaxy ring are the Home hero, with words orbiting on the ring; big monospace statements (after aggrocrab.com). IBM Plex Mono, Caveat for handwriting.
- **ORISON**: the game's own OS. Flat windows with the in-game dithered title bar (`src/lib/dither.ts`), W95FA (the game's font), system buttons. Black around the eye, decoration at the edges (after deltarune.com). The page sits inside a beige **Audeo** CRT monitor that powers on when the page opens.
- **SILENTIUM**: the poster's black, brick and flesh; photographic, film grain, format facts set like closing credits. Forum for the title, Cormorant Garamond Italic for the quiet lines.

Avoid template tropes: uppercase letter-spaced labels over headings, gradient text, glows, numbered cards. Buttons use `.btn` / `.btn-quiet`, which restyle per theme. Mobile first everywhere (see `CLAUDE.md`).

## Easter eggs (ORISON)

- **Terminal codes**: four codes hidden around /orison (cipher letters in the README text, an HTML comment in the source, a console message, a screenshot's alt text). Stored only as SHA-256 hashes in `src/content/easter-eggs.ts`, whose header says where each one is.
- **Hero full stop**: the "." of "Humanity awaits." glitches the screen and opens a panel.
- **Monitor buttons**: pressing 1 1 4 2 3 1 on the monitor chin opens `/orison/the-watcher`. The hint is spelled in 8-bit ASCII by the background binary rain (`orison.binaryHint`, `BinaryRain.tsx`).
- **Power button**: glitches the screen, which stays on.
- Every glitch stays inside the monitor glass (`[data-glitching]` in `globals.css`); none runs under reduced motion.

## Where things live

- **Copy**: `src/content/en.ts`, every user-facing string. Add a locale by copying it and registering it in `src/content/index.ts`.
- **Links / IDs / emails / socials**: `src/config/site.ts` (items marked TBD are open points).
- **SILENTIUM episodes**: from the Spotify Web API when `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` are set (see `.env.example`), otherwise `src/data/silentium-episodes.ts`. That static list needs each new episode's Spotify ID added by hand (IDs are listed on the show's Spotify for Creators page).
- **SILENTIUM transcripts**: not stored here. `src/lib/transcripts.ts` reads the HTML of the client's archive repo (`site.silentium.transcripts`, `arcane-canvas/silentiumpodcast`) and regenerates at most once an hour, so a new `episodeN.html` listed in its `index.html` appears with no deploy. The markup is cut to an allowlist and restyled by `.transcript` in `globals.css`. If GitHub is unreachable, the page links to the archive site instead.
- **Privacy**: no analytics and no cookies of the site's own. YouTube (trailer) and Spotify (player) load only when the visitor asks, from local placeholders, so no cookie banner is needed. The notice (`/privacy`, copy in `en.ts` → `privacy`) must be updated if analytics, forms or new embeds are ever added.
- **Link previews and SEO**:
  - Primary address `https://www.thearcanecanvas.com` (`site.url`), the domain set as primary on Vercel; the bare domain and `arcane-canvas.vercel.app` 308-redirect to it (the latter in `next.config.ts`). Preview deployments send `X-Robots-Tag: noindex`.
  - Every page goes through `pageMetadata()` in `src/lib/metadata.ts` (title, description under ~160 characters, canonical, Open Graph, Twitter card).
  - `src/app/robots.ts`, `src/app/sitemap.ts` (pages + transcripts + image entries), `src/app/manifest.ts`.
  - Structured data (JSON-LD) in `src/lib/structured-data.ts`, rendered by `<JsonLd>`: Organization + Person + WebSite (Home), ProfilePage (About), VideoGame + trailer (ORISON), PodcastSeries + episodes (SILENTIUM), Article (transcripts), breadcrumbs. Check with Google's Rich Results Test after changes.
  - One H1 per page; on Home it is the visible statement, with the studio name for search engines and screen readers.

## Assets

- **Generated**: `npm run assets -- "<path to ArcaneCanvas folder>"` (needs ffmpeg) writes the Steam capsule, the mini CD, the screenshots and the SILENTIUM crops into `public/media`. Don't hand-edit those files.
- **Delivered by the client and committed as is** (the script's header lists them): `orison/wordmark.svg`, `orison/trailer-poster.webp` (the trailer cover, a local copy so nothing is requested from YouTube before play), `silentium/cover-horizontal.webp`, `brand/about-portrait.webp`.
- **Logo**: `public/media/brand/logo.svg` is the source (~900 gradients: too heavy to ship). The site uses rasters of it, `brand/logo-900.webp` (hero) and `brand/logo-96.webp` (header), made with headless Chrome at those widths on a transparent background, then `ffmpeg -i logo.png -c:v libwebp -quality 88 -pix_fmt yuva420p logo-<w>.webp`.
- **Link-preview images**: 1200×630 JPGs in `public/og`. `orison.jpg` is ORISON_cover cropped; `home.jpg` and `silentium.jpg` are drawn from `scripts/og/og.html` (`?v=home` / `?v=silentium`) with headless Chrome, then `ffmpeg -i x.png -q:v 3 public/og/x.jpg`:
  ```
  chrome --headless=new --hide-scrollbars --allow-file-access-from-files --window-size=1200,630 --virtual-time-budget=4000 --screenshot=home.png "file:///<repo>/scripts/og/og.html?v=home"
  ```
  After a change, refresh the preview with the Facebook Sharing Debugger.
- **Icons**: `src/app/favicon.ico` (16/32/48 PNGs in one ICO), `src/app/icon.png` (192px), `src/app/apple-icon.png` and `public/icons/*` (manifest, incl. a maskable one), rendered from `scripts/og/icon.html` (`?s=<size>&r=<radius %>&p=<logo %>`) with the same command plus `--window-size=<size>,<size> --default-background-color=00000000`.
- **Fonts**: self-hosted WOFF2 in `src/app/fonts` (IBM Plex Mono preloaded; on demand W95FA, Forum, Cormorant Garamond Italic, Caveat), OFL licences in `src/app/fonts/licenses`. No requests to Google. W95FA is a trial that replaced VT323: to go back, `npm i @fontsource/vt323`, copy its `latin-400-normal.woff2` into `src/app/fonts` and point the `w95fa` font in `layout.tsx` at it.

## Placeholders to replace

- ORISON press kit link (`site.orison.pressKitUrl`, TBD): until it exists, the Press kit buttons open an email to press@.
- Home contact text ("Say hello.", still with lorem ipsum): final text promised by the client.
- Glitch panel and terminal unlock texts (TBD with Marco; he does not want to write terminal content, so decide whether to keep, trim or remove the terminal).
- The Watcher's eight lines (`orison.watcher.lines`): the agency's proposal, to be approved by Marco.
