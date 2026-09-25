# Handoff - Arcane Canvas website

_Last updated: 2026-09-25_

## Where things stand

The site is live at **https://www.thearcanecanvas.com** (Vercel, auto-deployed from `main` of `inLumineStudio/arcane-canvas`; domain on Aruba, DNS: A `@` → Vercel, CNAME `www` → Vercel, `www` is the primary address). Every route is complete in structure and design; a few texts are still placeholders (list below).

| Route | Status |
|-------|--------|
| `/` | Done. Logo + orbit hero with the statement "Games and stories from the realm of Dreams", intro, Projects (ORISON band with the YouTube trailer, SILENTIUM band with the horizontal cover), contact. |
| `/about` | Done. Letter, photo ("this is where I create stories"), list of works (the mini CD is "handed out in person"), press. |
| `/orison` | Done. Audeo CRT monitor with power-on, parallax hero with the tracking eye (tilt on phones), README, trailer, screenshots with viewer, terminal, easter eggs. W95FA font (a trial). |
| `/orison/the-watcher` | Done. Secret page behind the monitor buttons. Its five lines are Marco's. |
| `/silentium` | Done. Format facts, episodes from the RSS feed (hourly, new ones appear on their own) with the Spotify player on request, Apple Podcasts / RSS, transcripts with "Read the transcript" next to the selected episode. |
| `/silentium/transcripts/*` | Done. Read live from the client's archive repo (hourly). |
| `/privacy` | Done as a draft: have it reviewed. |
| 404 | Done. Wall of eyes, "This page isn't there. But you are. Go back." |

## What was built (summary)

- **Home hero**: the statement and the logo always share one screen (stacked on phones and portrait tablets, side by side on landscape screens). All sizing lives in `.home-hero*` in `globals.css`, with the maths explained: it assumes a 4-line statement whose longest line is ~12 characters (factors 3.68 and 0.046). The orbit words loop seamlessly and appear/disappear behind the "A".
- **ORISON monitor**: 90s beige CRT branded Audeo (the in-game maker). Powers on at every visit; the chin has four buttons, the power button and an LED. Windows follow the in-game UI (flat frame, dithered title bar, grey min/close buttons).
- **Easter eggs**: terminal codes (hashed), hero full stop → glitch + panel, monitor buttons 1 1 4 2 3 1 → The Watcher (hint in ASCII in the binary rain), power button → glitch. All glitches stay inside the monitor glass.
- **Privacy / Garante**: no analytics, no cookies of our own, YouTube and Spotify only on request (local placeholders), `/privacy` linked in the footer, footer © "Marco D'Antino / Arcane Canvas".
- **SEO**: www canonical everywhere, robots.txt, sitemap.xml (with transcripts and images), manifest, icon set, JSON-LD on every page, link-preview images per section, `arcane-canvas.vercel.app` redirects to www, previews are noindex.
- **Performance (checked in production mode on a phone viewport)**: ~160–180 KB of compressed JS per page, LCP ~100 ms locally, no third-party request before an explicit click. The logo is served as a 62 KB WebP instead of the 395 KB SVG; unused videos, images, fonts and npm packages were removed in the 2026-09-25 clean-up.

## Waiting on the client (Marco)

| Item | Where it goes |
|------|---------------|
| Glitch panel and terminal unlock texts | `glitch` in `en.ts`, `src/content/easter-eggs.ts`. He does not want to write terminal content: decide whether to keep, trim or remove the terminal |
| Demo release day: "Demo out now" | `orisonStatus` at the top of `en.ts` (empty until then, so no date is shown anywhere) |
| Verdict on W95FA (trial font) after seeing it on a real phone | `layout.tsx`, see README "Fonts" to go back to VT323 |
| Episode 1 summary: "33-year-old" → "34-year-old" in the archive | Already corrected on the site (`SUMMARY_ERRATA` in `src/lib/transcripts.ts`); Marco should still fix `index.html` in arcane-canvas/silentiumpodcast so the archive site is right too |
| Legal review of the privacy notice | `privacy` in `en.ts` |

## To do outside the code

1. **Google Search Console**: add a *Domain* property for `thearcanecanvas.com`, verify it with the TXT record Google gives (Aruba → DNS management, new TXT on `@`; leave the SPF TXT alone), then submit `https://www.thearcanecanvas.com/sitemap.xml`. Same in Bing Webmaster Tools (it can import from Search Console).
2. **Transcript archive canonicals** (client's repo): the transcripts are also public on GitHub Pages, so Google sees duplicates. In each `episodeN.html` and `lexicon.html`, inside `<head>`, add e.g. `<link rel="canonical" href="https://www.thearcanecanvas.com/silentium/transcripts/episode1">`, and in `index.html` point the canonical to `https://www.thearcanecanvas.com/silentium`. This site only reads `<main>` from those files.
3. **Email deliverability**: SPF is set (Aruba), DMARC exists in `p=none`, DKIM was not found. Switch DKIM on from the Aruba mail panel, then after a couple of weeks move DMARC to `p=quarantine`.
4. **Vercel env (optional)**: new episodes and transcripts already appear by themselves within an hour (RSS feed + archive repo). The only manual step left is a new episode's Spotify ID in `src/data/silentium-episodes.ts`, for its own player (without it, it plays through the whole-show player). Setting `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` removes that step too.
5. **Repo visibility**: the client asked for the repo to be private. Before switching, check the Vercel plan (Hobby may not deploy private repos owned by a GitHub organisation).
6. After each deploy that touches metadata: Rich Results Test and Facebook Sharing Debugger on Home, /orison, /silentium.

## Suggested next steps

1. Test on real devices: iOS Safari (tilt permission prompt, `svh` with the toolbar, the Watcher's performance), an Android mid-range phone, a tablet.
2. Lighthouse on mobile against the live site.
3. Open points from the client's earlier list that were not confirmed: flat navigation (ORISON · SILENTIUM · About · Contact, no "Projects" dropdown), a call to action in the first screen of Home ("Now: ORISON → Wishlist on Steam"; the requested "studio gold" is not in the palette), where "Listen now" should lead.

## Gotchas

- `next dev` rewrites `AGENTS.md`. That is expected: commit it as-is.
- On this Windows machine the dev server (Turbopack) sometimes misses file changes and keeps serving old CSS/JS. If a change does not show up, stop the server, delete `.next` and start it again.
- Easter egg codes are stored hashed; `src/content/easter-eggs.ts` says where each one is hidden. The README cipher (UNWATCHED) lives in `orison.intro.text`: keep those nine letters if the text changes.
- `public/media` is partly generated (`npm run assets`) and partly delivered by the client: see README "Assets" before replacing files.
- Pushing needs the `github.com-inlumine` SSH alias; there is no `gh` CLI.
