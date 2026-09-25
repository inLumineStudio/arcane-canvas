import type { MetadataRoute } from "next";
import { getDictionary } from "@/content";

// /manifest.webmanifest: name, colours and icons for Android and "add to home screen".
// The icons are rendered from scripts/og/icon.html (README, "Icons"); the maskable one keeps
// the logo inside the safe zone Android crops to a circle or squircle.

export default function manifest(): MetadataRoute.Manifest {
  const t = getDictionary();
  return {
    name: t.meta.siteName,
    short_name: t.meta.siteName,
    description: t.meta.homeDescription,
    start_url: "/",
    display: "browser",
    background_color: "#0b0f15",
    theme_color: "#0b0f15",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
