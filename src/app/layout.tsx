import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import "./globals.css";

// Self-hosted WOFF2 (no requests to Google, brief §6). Only the body font is preloaded.
const plex = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex",
  display: "swap",
  preload: true,
});

// ORISON's "on screen" font: W95FA, the font the game itself uses (a trial, requested by the
// client; it replaced VT323, which can be restored from @fontsource/vt323 if the trial is dropped).
const w95fa = localFont({
  src: "./fonts/w95fa-400-normal.woff2",
  variable: "--font-w95",
  display: "swap",
  preload: false,
});

// SILENTIUM: Forum for the title (the typeface of the podcast's cover art) and Cormorant
// Garamond Italic for its quiet lines (tagline, "For fans of", season headings).
const forum = localFont({
  src: "./fonts/forum-latin-400-normal.woff2",
  variable: "--font-forum-src",
  display: "swap",
  preload: false,
});

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin-500-italic.woff2",
  variable: "--font-cormorant-src",
  weight: "500",
  style: "italic",
  display: "swap",
  preload: false,
});

// Studio handwriting (About: signature, photo caption)
const caveat = localFont({
  src: "./fonts/caveat-latin-500-normal.woff2",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

const t = getDictionary();

// Defaults for any page that sets nothing itself. Every route sets its own through
// pageMetadata() (lib/metadata.ts), which also adds the canonical URL; that is left out
// here so a page without one never claims to be the home page.
export const metadata: Metadata = {
  ...pageMetadata({ title: t.meta.homeTitle, description: t.meta.homeDescription, path: "/" }),
  alternates: undefined,
  metadataBase: new URL(site.url),
  // Icons come from the file conventions (app/favicon.ico, icon.png, apple-icon.png)
  applicationName: t.meta.siteName,
  authors: [{ name: site.owner, url: `${site.url}/about` }],
  creator: site.owner,
  publisher: t.meta.siteName,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  // The studio background, so the mobile browser bar blends with the header
  themeColor: "#0b0f15",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plex.variable} ${w95fa.variable} ${forum.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
