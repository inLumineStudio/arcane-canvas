@AGENTS.md

# Arcane Canvas website - working rules

Showcase site for the studio Arcane Canvas and its two products, ORISON (narrative PC game) and SILENTIUM (horror fiction podcast). Built by inLumine Studio for the client; client-side contact is Marco. See `README.md` for routes, where content lives and the placeholder list, and `HANDOFF.md` for current status.

## Stack

- Next.js 16 (App Router, `src/app`), React 19, TypeScript, Tailwind CSS v4 (`@theme inline` in `src/app/globals.css`, no `tailwind.config`).
- Plain CSS in `globals.css` where Tailwind is a poor fit (CRT frame, glitch, scanlines, grain, binary rain).
- No UI library, no animation library. Motion is hand-written (rAF + IntersectionObserver) and always respects `prefersReducedMotion()` from `src/lib/gaze.ts`.
- Fonts self-hosted in `src/app/fonts` (IBM Plex Mono, VT323, Caveat). Never add Google Fonts or other third-party requests.

## Commands

```
npm run dev      # http://localhost:3000 (the in-app preview uses .claude/launch.json → "next-dev")
npm run build
npm run lint
npx tsc --noEmit
npm run assets -- "<path to ArcaneCanvas raw folder>"   # regenerate public/media, needs ffmpeg
```

There are no tests. Before committing: `npx tsc --noEmit` and `npm run lint` must be clean, and UI changes must be checked in the browser.

## Mobile first (non-negotiable)

- Base classes are for phones; enhance with `md:` / `min-width` queries. Never write `max-width` media queries.
- Verify every visual change at a phone size first (375×667 and 390×844), then landscape phone (844×390), then desktop (1366×657 is the "short laptop" case).
- Every desktop-only interaction (hover, cursor tracking, dropdowns, strong parallax) needs a stated mobile alternative (tap, gyroscope, a sheet, idle animation, half-speed parallax).
- Touch targets at least 44px (`min-h-11`). No horizontal page scroll. Fixed UI (header, sticky CTA, CRT frame) must not cover content.
- Prefer `svh`/`dvh` over `vh` for anything sized to the screen.

## Design rules

- Each area has its own visual language, set by `<PageShell theme="studio" | "orison" | "silentium">` (writes `data-theme`). Components read the CSS tokens (`bg`, `bg-raised`, `fg`, `muted`, `line`, `accent`, `accent-fg`); never hardcode a theme colour in a shared component.
- Studio (Home, About): the logo's ink and silver, big monospace statements. ORISON: the game's 90s OS, VT323, lots of black, the page lives inside a CRT bezel (`PageShell crt=...`). SILENTIUM: black, brick, flesh, film grain.
- Avoid template tropes: uppercase letter-spaced eyebrow labels, gradient text, glows, numbered cards. Buttons are `.btn` / `.btn-quiet`, restyled per theme.
- The Home hero (logo with orbit + the big statement) must always fit one screen: stacked on phones and portrait tablets, side by side on landscape screens from 768px. The sizing maths is in `.home-hero*` in `globals.css`.

## Code conventions

- Server components by default; `"use client"` only for interaction or animation. Do not import non-component values from a `"use client"` module into a server component.
- All user-facing copy lives in `src/content/en.ts` (read via `getDictionary()`); links, IDs and emails in `src/config/site.ts`. Do not inline copy or URLs in components.
- Open client decisions are marked `TBD` in code and listed in the README "Placeholders" section. Keep both in sync.
- Easter egg codes are stored only as SHA-256 hashes (`src/content/easter-eggs.ts`); never commit a code in clear text.
- Comments explain *why* (design intent, mobile alternative, browser quirk), in English, in the style of the existing file headers.

## Git

- Branch `main`, remote `origin` = `git@github.com-inlumine:inLumineStudio/arcane-canvas.git` (SSH alias; plain `github.com` is rejected). No `gh` CLI.
- Commit only when asked. Short imperative subjects, optionally scoped (`ORISON: …`, `Nav: …`).
- `next dev` regenerates `AGENTS.md`; commit it as-is if it shows up in the diff.
