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
| `/about`     | Studio statement, principles, team, timeline, press |
| `/orison`    | CRT-framed page: parallax hero with the tracking eye, clips, screenshots, terminal, easter eggs |
| `/silentium` | Format, episode list with Spotify Embed player |

## Design

Each area speaks its own visual language; the rules are in the header comment of `src/app/globals.css`.

- **Studio (Home, About)**: built from the logo. The crystal "A" and its galaxy ring are the Home hero, with the studio's work orbiting on the ring; big monospace statements (after aggrocrab.com).
- **ORISON**: the game's own 90s OS and the client's print mockups: README windows, HELP output, bevelled system buttons, VT323. Black around the eye, decoration only at the edges (after deltarune.com). The whole page sits inside a CRT monitor.
- **SILENTIUM**: the poster's black, brick and flesh; photographic, film grain, format facts set like closing credits.

Avoid template tropes: uppercase letter-spaced labels over headings, gradient text, glows, numbered cards. Buttons use `.btn` / `.btn-quiet`, which restyle per theme.

## Where things live

- **Copy**: `src/content/en.ts` - every user-facing string. Add a locale by copying it and registering it in `src/content/index.ts`.
- **Links / IDs / email**: `src/config/site.ts` (items marked TBD are open points).
- **Easter eggs**: `src/content/easter-eggs.ts` - codes are stored as SHA-256 hashes; the file header lists where each code is hidden.
- **SILENTIUM episodes**: fetched from the Spotify Web API when `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` are set (see `.env.example`), otherwise `src/data/silentium-episodes.ts`.
- **Media**: `public/media`, generated from the client's raw assets with `npm run assets -- "<path to ArcaneCanvas folder>"` (needs ffmpeg).
- **Fonts**: self-hosted WOFF2 in `src/app/fonts` (IBM Plex Mono preloaded, VT323 and Caveat on demand). No requests to Google.

## Placeholders to replace

- `public/media/orison/clip.*` is a montage of screenshots: replace with the Steam trailer clips, re-encoded (WebM + MP4).
- YouTube trailer URL (the ORISON product band links to Steam until it exists).
- ORISON press kit link (`site.orison.pressKitUrl`): Dropbox folder from Marco. Until then the Press kit buttons open an email to press@.
- Team profiles, About/Home lorem ipsum.
- Glitch panel and terminal unlock content (TBD with Marco).
