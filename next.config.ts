import type { NextConfig } from "next";

// SEO housekeeping for the hosts that serve the same site as www.thearcanecanvas.com:
// - arcane-canvas.vercel.app (the production alias Vercel always keeps) redirects to the
//   primary domain for good, so links and signals there are consolidated. Keep the
//   destination in sync with site.url in src/config/site.ts.
// - Preview deployments (VERCEL_ENV=preview) answer with X-Robots-Tag: noindex, so test
//   builds never end up in search results.

const PRIMARY = "https://www.thearcanecanvas.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "arcane-canvas.vercel.app" }],
        destination: `${PRIMARY}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    if (process.env.VERCEL_ENV !== "preview") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }];
  },
};

export default nextConfig;
