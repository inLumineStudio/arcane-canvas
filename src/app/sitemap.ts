import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getTranscriptSeasons, LEXICON } from "@/lib/transcripts";

// /sitemap.xml: every indexable page, with the images that matter for each (image sitemap).
// The transcript pages come from the client's archive, so the list refreshes with them
// (hourly, like the pages). No <lastmod>, <changefreq> or <priority>: Google ignores the
// last two and only trusts lastmod when it is exact, which it could not be for these pages.
// Not listed: /privacy is indexable but not worth promoting; the 404 is noindex.

export const revalidate = 3600;

const abs = (path: string) => `${site.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seasons = await getTranscriptSeasons();
  const transcripts = seasons.flatMap((s) => s.entries.map((e) => e.slug));

  return [
    { url: abs("/"), images: [abs("/og/home.jpg")] },
    {
      url: abs("/orison"),
      images: [abs("/og/orison.jpg"), abs("/media/orison/trailer-poster.webp"), ...[1, 2, 3, 4, 5, 6].map((i) => abs(`/media/orison/shot-${i}.webp`))],
    },
    { url: abs("/silentium"), images: [abs("/og/silentium.jpg"), abs("/media/silentium/cover.webp")] },
    { url: abs("/about"), images: [abs("/og/home.jpg")] },
    ...[...transcripts, LEXICON].map((slug) => ({ url: abs(`/silentium/transcripts/${slug}`) })),
  ];
}
