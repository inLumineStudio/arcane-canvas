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
    // TBD: no YouTube channel yet. While null, the trailer card links to the Steam page instead.
    youtubeTrailerUrl: null as string | null,
  },

  silentium: {
    spotifyShowId: "5MFiBrUk5S3AkMjKoOPDKT",
    get spotifyUrl() {
      return `https://open.spotify.com/show/${this.spotifyShowId}`;
    },
  },

  // Footer credit for the agency that built the site
  builtBy: { label: "InLumine", href: "https://www.inlumine.it/" },

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/orison.sys/" },
    { label: "TikTok", href: "https://www.tiktok.com/@orison.sys" },
    { label: "Bluesky", href: "https://bsky.app/profile/arcanecanvas.bsky.social" },
  ],
} as const;

/** Dropbox press kit once Marco shares it; an email to the press address until then. */
export const orisonPressKitHref =
  site.orison.pressKitUrl ?? `mailto:${site.pressEmail}?subject=ORISON%20press%20kit`;
