// External links and IDs. Values marked TBD are open points in the brief (§8).
export const site = {
  url: "https://thearcanecanvas.com",
  contactEmail: "hello@thearcanecanvas.com",
  pressEmail: "press@thearcanecanvas.com",

  orison: {
    steamUrl: "https://store.steampowered.com/app/5202200/ORISON/",
    // TBD: Dropbox folder from Marco (trailer, screenshots, cover…). While null, the
    // Press kit button opens an email to pressEmail instead.
    pressKitUrl: null as string | null,
    // The trailer card falls back to the Steam page if this is ever set back to null.
    youtubeTrailerUrl: "https://www.youtube.com/watch?v=6veKf0zDn1g" as string | null,
  },

  silentium: {
    spotifyShowId: "5MFiBrUk5S3AkMjKoOPDKT",
    get spotifyUrl() {
      return `https://open.spotify.com/show/${this.spotifyShowId}`;
    },
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

  // Footer credit for the agency that built the site
  builtBy: { label: "inLumine", href: "https://www.inlumine.it/" },

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/orison.sys/" },
    { label: "TikTok", href: "https://www.tiktok.com/@orison.sys" },
    { label: "Bluesky", href: "https://bsky.app/profile/arcanecanvas.bsky.social" },
  ],
} as const;

/** Dropbox press kit once Marco shares it; an email to the press address until then. */
export const orisonPressKitHref =
  site.orison.pressKitUrl ?? `mailto:${site.pressEmail}?subject=ORISON%20press%20kit`;
