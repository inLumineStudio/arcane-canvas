import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import { getDictionary } from "@/content";
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

const vt323 = localFont({
  src: "./fonts/vt323-latin-400-normal.woff2",
  variable: "--font-vt323",
  display: "swap",
  preload: false,
});

const caveat = localFont({
  src: "./fonts/caveat-latin-500-normal.woff2",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

const t = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: t.meta.homeTitle,
  description: t.meta.homeDescription,
  icons: { icon: "/media/brand/logo.svg" },
  openGraph: { siteName: t.meta.siteName, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plex.variable} ${vt323.variable} ${caveat.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
