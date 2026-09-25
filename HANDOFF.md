# Handoff - Arcane Canvas website

_Last updated: 2026-09-24_

## Where things stand

Website v1 is built and on `main` (`inLumineStudio/arcane-canvas`). All four routes are complete in structure and design, with copy and media partly placeholder until the client delivers the final material.

| Route        | Status |
|--------------|--------|
| `/`          | Done. Logo + orbit hero, statement, ORISON / SILENTIUM product bands, contact. |
| `/about`     | Done in layout; part of the copy is lorem ipsum (final texts coming from the client). |
| `/orison`    | Done. CRT frame, parallax hero with tracking eye (gyroscope on mobile), YouTube trailer, screenshot gallery with zoom + full-screen viewer, terminal, glitch panel, easter eggs. Unlock content is placeholder. |
| `/silentium` | Done. Format facts, episode list, Spotify embed player, transcripts. Episodes come from the Spotify API when env vars are set, otherwise the static list. Transcripts come live from the client's archive repo. |

## Recent changes

Committed:
- ORISON screenshots: zoom on hover, full-screen viewer (`3bd5897`).
- Nav: ORISON and SILENTIUM grouped under a "Projects" dropdown on desktop, listed in the mobile sheet (`53e4548`).
- ORISON raised surfaces use the game's window indigo `#181233` (`6271778`).
- Sticky store CTA hides over the footer (`c737f74`).

Session of 2026-09-24:
- **Nav order** is now About · Contact · Projects, on desktop and in the mobile sheet. The Projects dropdown is right-aligned, since it is now the last item (`src/components/NavLinks.tsx`).
- **Home hero = logo + statement in one screen.** The big statement ("One person. Games, podcasts & other dark things.") moved into the hero, and the intro paragraph follows it.
  - Phones and portrait tablets: stacked, logo above. Landscape screens from 768px (landscape tablet, desktop, landscape phone): side by side, statement left, logo right.
  - The intro paragraph under the hero is a block of max 60ch, text centred from 768px (flush left on phones), with the "About the studio" link on its own line.
- **Contact section** ("Say hello.") centred from 768px too, for consistency with the intro; flush left on phones.
- **Footer credit** "Built by inLumine" → https://www.inlumine.it/ under the socials, right-aligned on desktop (`site.builtBy` in `src/config/site.ts`, label in `en.ts`).
  - The statement is sized by width and height, the logo gets the space left. All sizing lives in `globals.css` (`.home-hero*`), with the maths explained there.
  - The orbit SVG's viewBox is cropped to the band actually drawn (`0 96 640 328`), and the SVG fills whatever box its parent gives it.
  - Checked at 375×667, 390×844, 768×1024, 844×390, 1024×768, 1280×800, 1366×657, 1600×751, 1920×960 and 2560×1300: 5 statement lines, no horizontal scroll, everything above the fold.
  - If the statement copy gets a longer line, or the ring or logo in `LogoOrbit.tsx` change, recheck the factors in `globals.css` (4.6 = 5 lines × 0.92, 0.062 ≈ the longest line of 12 characters, 1.95 = the orbit aspect).
- `CLAUDE.md` (working rules) and this file.

Client TODO list (second round, 2026-09-24):
- **Orbit loop fixed.** The ring text was not periodic (3 copies of the words on a ring of a different length), so every lap it jumped and left a gap. Now the text is N copies of one unit and the offset wraps at the unit's measured length. The path also starts at the top, behind the "A", where the words fade out and back in (mask), so there is no visible seam; the words fade in on load once the webfont is measured.
- **Hero statement ~18% smaller** (portrait `min(10.6vw, 6.15svh, 7.4rem)`, landscape factor 0.051 / 6.5rem); the logo takes the freed space (landscape: up to 56% of the row). Rechecked 375×667, 390×844, 844×390, 1366×657.
- **Projects section on Home.** A studio "Projects" heading (h2), studio-black gaps between the bands and band backdrops that fade in/out at top and bottom (`.band-fade`), so the two worlds no longer butt into each other.
- **New ORISON eye** from the client's second `eye.html`: the teal halo is now a "dissolve" field of 1px dots that turns with the rings; offscreen buffers capped for 4K; phones run 24fps with rings/halo rebuilt every 5th frame.
- **YouTube trailer plays in place** (`site.orison.youtubeTrailerId`, `TrailerPlayer`): the trailer windows on Home and /orison show the muted loop until play is pressed, then swap in the youtube-nocookie player, already playing. Nothing loads from YouTube before that press.
- **Client notes "ANNOTAZIONI" (2026-09-25):** Home statement "Games and stories from the realm of Dreams" (4 lines; hero maths in globals.css updated), ring words, new intro, SILENTIUM band in Forum with the horizontal cover and no cadence, YouTube under Studio. About: new SILENTIUM paragraph, AI paragraph removed, real photo + caption. ORISON: README without the closing line (last sentence on its own line, UNWATCHED cipher re-hidden), `ORISON:\` paths, native-resolution trailer cover, W95FA font (trial), windows restyled after the in-game UI. SILENTIUM: Forum title, Cormorant Garamond Italic lines, new format title/text, no Cadence, "Read the transcript" next to the selected episode. Easter eggs: monitor buttons 1 1 4 2 3 1 → 404 ("This page isn't there. But you are. Go back."), hint spelled in ASCII by the binary rain, power button glitches the screen. Preview images regenerated. **Still open:** Marcus Chen's age ("33-year-old" → 34) is in the client's archive repo (`index.html`, episode 1 summary), not in this site: fix it there. The terminal has no real content (the client does not want to write any): its unlock texts are still placeholders.
- **SEO (2026-09-25):** primary address is now `https://www.thearcanecanvas.com` everywhere (canonicals, sitemap, previews), matching Vercel. robots.txt, sitemap.xml (with the transcripts and image entries), web manifest, full icon set (favicon.ico, icon, apple-icon, maskable), JSON-LD on every page (studio, owner, website, game + trailer, podcast + episodes, transcripts, breadcrumbs), Home H1 is the visible statement, `arcane-canvas.vercel.app` redirects to www, previews are noindex. **To do outside the code** (see "SEO: to do outside the code" below).
- **Client's P1 list:** one ORISON text everywhere (the Home version, plus "There are no right answers in there. Only what you do." on /orison; the UNWATCHED cipher letters are re-hidden in it). "Available in English and Italian" under the /orison hero status. SILENTIUM: Apple Podcasts and RSS next to Spotify (episodes intro and final CTA). Footer socials split into "ORISON: Instagram · TikTok · YouTube" and "Studio: Bluesky" (YouTube: @ArcaneCanvasYT). The mini CD stays in About's list of works as "Handed out in person, at events". No team section: it was never built, only mentioned in the docs.
- **Email deliverability:** SPF is set (Aruba), DMARC exists but only in `p=none`, DKIM was not found. DKIM has to be switched on from the Aruba mail panel (client or agency with access); then DMARC can move to `p=quarantine`.
- **Privacy / Garante (client's P0 list):** the SILENTIUM Spotify player now loads only on request (placeholder of the same size, note on Spotify's cookies, link to /privacy, plain "open on Spotify" link), like the YouTube trailer. Nothing third-party loads on its own, so no cookie banner is needed. New `/privacy` page, linked in the footer: hosting logs (Vercel), no analytics or cookies (the terminal's localStorage is mentioned), YouTube and Spotify on request, email (Aruba), rights and the Garante. **It is a draft: have it reviewed**, and update it if analytics, forms or new embeds are ever added. Footer © is now "Marco D'Antino / Arcane Canvas".
- **ORISON monitor (Marco's request):** the CRT frame is now a 90s beige monitor like the reference (putty plastic, recessed lip around the glass, glare, chin with round buttons, power button and LED). The chin brand is **Audeo**, the in-game maker of the PC (`orison.monitorLabel`). On opening, the monitor powers on: line, picture opening from the centre, static and a rolling band, ~1.3s, CSS only, skipped under reduced motion.
- **Developer name confirmed: Marco D'Antino.** Used for the About signature, the SILENTIUM "Voice" fact and the transcript credit.
- **SILENTIUM transcripts** (client option 2, "read from GitHub"): list on `/silentium#transcripts`, one page per case at `/silentium/transcripts/<slug>` plus the Lexicon, prev/next case, sticky Spotify CTA. No admin page needed: the client keeps publishing to the archive repo as today. Option 3 (link to the archive) is kept as the fallback if GitHub is down.

## Waiting on the client (Marco)

| Item | Where it goes |
|------|---------------|
| ORISON press kit Dropbox URL | `site.orison.pressKitUrl` in `src/config/site.ts` (until then, Press kit buttons open an email to press@) |
| Glitch panel and terminal unlock content | `src/content/en.ts` (ORISON section) and `src/content/easter-eggs.ts` |
| Portrait photo | `src/content/en.ts` (About) |
| Final EN copy (Home / About lorem ipsum) | `src/content/en.ts` |

## SEO: to do outside the code

1. **Google Search Console**: add a *Domain* property for `thearcanecanvas.com`, verify it with the TXT record Google gives (Aruba → DNS management, new TXT on `@`; leave the SPF TXT alone), then submit `https://www.thearcanecanvas.com/sitemap.xml`. Do the same in Bing Webmaster Tools (it can import from Search Console).
2. **Transcript archive (client's repo `arcane-canvas/silentiumpodcast`)**: the same transcripts are public on GitHub Pages, so Google sees duplicates and may pick the wrong one. In each `episodeN.html` and `lexicon.html`, inside `<head>`, add a canonical to the page on this site, e.g. for `episode1.html`:
   `<link rel="canonical" href="https://www.thearcanecanvas.com/silentium/transcripts/episode1">`
   and in `index.html` replace the existing canonical with `https://www.thearcanecanvas.com/silentium`. This site only reads `<main>` from those files, so the change does not affect it.
3. After the next deploy, run the home, /orison and /silentium URLs through the Rich Results Test and the Facebook Sharing Debugger.

## Suggested next steps

1. Review the 2026-09-24 changes on a real phone and tablet.
2. Deploy (Vercel is the natural fit; none is set up yet). Set `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` there for live episodes.
3. Swap in the client's material as it arrives (table above), then clear the matching `TBD`s and README placeholders.
4. Before launch: Lighthouse on mobile (the ORISON eye canvas and screenshots are the heaviest assets), OG images / metadata per route, favicon check, real-device test on iOS Safari (gyroscope permission prompt, `svh` behaviour with the toolbar).
5. Optional: a second locale (copy `src/content/en.ts`, register it in `src/content/index.ts`).

## Gotchas

- `next dev` rewrites `AGENTS.md`. That is expected, so commit it as-is.
- Easter egg codes are stored hashed; the file header in `src/content/easter-eggs.ts` says where each one is hidden.
- `public/media` is generated by `npm run assets` from the client's raw folder (needs ffmpeg). Do not hand-edit the generated files.
- Pushing needs the `github.com-inlumine` SSH alias; there is no `gh` CLI.
