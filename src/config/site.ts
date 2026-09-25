// External links and IDs. Values marked TBD are open points in the brief (§8).
export const site = {
  // The primary address, as served by Vercel (the bare domain 308-redirects here). Canonical
  // URLs, the sitemap, link previews and structured data all derive from it: it must match
  // the domain set as primary on Vercel, or Google sees canonicals pointing at a redirect.
  url: "https://www.thearcanecanvas.com",
  // The person behind Arcane Canvas (not a legal entity yet): author and publisher in the
  // structured data, copyright holder in the footer
  owner: "Marco D'Antino",
  contactEmail: "hello@thearcanecanvas.com",
  pressEmail: "press@thearcanecanvas.com",

  orison: {
    steamUrl: "https://store.steampowered.com/app/5202200/ORISON/",
    // TBD: Dropbox folder from Marco (trailer, screenshots, cover…). While null, the
    // Press kit button opens an email to pressEmail instead.
    pressKitUrl: null as string | null,
    // YouTube ID of the trailer (youtube.com/watch?v=<ID>), played inside the trailer windows
    // on Home and /orison. Its cover is a local copy: public/media/orison/trailer-poster.webp.
    youtubeTrailerId: "6veKf0zDn1g",
    // For the trailer's VideoObject (structured data): values read from its YouTube page
    trailer: { uploadDate: "2026-09-24T03:24:43-07:00", duration: "PT1M21S" },
    languages: ["en", "it"],
  },

  silentium: {
    spotifyShowId: "5MFiBrUk5S3AkMjKoOPDKT",
    get spotifyUrl() {
      return `https://open.spotify.com/show/${this.spotifyShowId}`;
    },
    episodeUrl: (id: string) => `https://open.spotify.com/episode/${id}`,
    appleUrl: "https://podcasts.apple.com/us/podcast/silentium/id1855797896",
    rssUrl: "https://anchor.fm/s/10c0ad324/podcast/rss",
    // The client's transcript archive (a static GitHub Pages site). The transcript pages
    // read its HTML straight from the repo, so a push there shows up here on the next
    // revalidation, with no copy to keep in sync.
    transcripts: {
      repo: "arcane-canvas/silentiumpodcast",
      // HEAD follows whatever the repo's default branch is
      ref: "HEAD",
      siteUrl: "https://arcane-canvas.github.io/silentiumpodcast/",
    },
  },

  // Privacy policies of the services the /privacy page names, and the Italian authority
  legal: {
    vercel: "https://vercel.com/legal/privacy-policy",
    google: "https://policies.google.com/privacy",
    spotify: "https://www.spotify.com/legal/privacy-policy/",
    aruba: "https://www.aruba.it/informativa-privacy.aspx",
    garante: "https://www.garanteprivacy.it/",
  },

  // Footer credit for the agency that built the site
  builtBy: { label: "inLumine", href: "https://www.inlumine.it/" },

  // Split by owner, so the ORISON accounts (@orison.sys) don't read as the studio's.
  // The YouTube channel is the studio's (it hosts the ORISON trailer and SILENTIUM).
  socials: {
    orison: [
      { label: "Instagram", href: "https://www.instagram.com/orison.sys/" },
      { label: "TikTok", href: "https://www.tiktok.com/@orison.sys" },
    ],
    studio: [
      { label: "Bluesky", href: "https://bsky.app/profile/arcanecanvas.bsky.social" },
      { label: "YouTube", href: "https://www.youtube.com/@ArcaneCanvasYT" },
    ],
  },
} as const;

/** Dropbox press kit once Marco shares it; an email to the press address until then. */
export const orisonPressKitHref =
  site.orison.pressKitUrl ?? `mailto:${site.pressEmail}?subject=ORISON%20press%20kit`;
