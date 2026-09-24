import type { Metadata } from "next";
import { getDictionary } from "@/content";

// One place that turns a page's title, description and preview image into the full set of
// tags link previews read (Open Graph for WhatsApp, Facebook, LinkedIn, Telegram…; the
// Twitter/X card). A page's `openGraph` replaces the layout's instead of merging with it,
// so every page goes through here to keep the site name, locale and type on each one.
// Preview images are 1200×630 JPGs in public/og (JPG, not WebP: some apps still skip WebP).

const t = getDictionary();

export const OG = {
  home: { url: "/og/home.jpg", alt: t.meta.ogAlt.home },
  orison: { url: "/og/orison.jpg", alt: t.meta.ogAlt.orison },
  silentium: { url: "/og/silentium.jpg", alt: t.meta.ogAlt.silentium },
} as const;

type Props = {
  title: string;
  description: string;
  /** Path of the page, for the canonical URL and og:url, e.g. "/orison" */
  path: string;
  image?: { url: string; alt: string };
};

export function pageMetadata({ title, description, path, image = OG.home }: Props): Metadata {
  const images = [{ url: image.url, width: 1200, height: 630, alt: image.alt }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: t.meta.siteName,
      locale: "en_US",
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
