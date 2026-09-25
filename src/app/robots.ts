import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// /robots.txt: everything is crawlable (it is a showcase), plus where the sitemap lives.
// Duplicate hosts (the bare domain, arcane-canvas.vercel.app) are handled by the redirect
// and by the canonical URL on every page, not here: blocking them in robots.txt would stop
// Google from seeing those canonicals.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
