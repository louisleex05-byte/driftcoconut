import type { MetadataRoute } from "next";

// Next.js 15 serves this at /robots.txt automatically.
// Allows all reputable crawlers, blocks the /api/ paths (server-side JSON only),
// and points them to the sitemap.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://driftcoconut.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",         // server routes, not user-facing
          "/_next/",       // Next.js internals (usually blocked by default too)
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
