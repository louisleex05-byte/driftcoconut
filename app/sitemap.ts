import type { MetadataRoute } from "next";
import { listGuides } from "@/lib/guides";

// Dynamic sitemap generation. Next.js 15 serves this at /sitemap.xml automatically.
// New guides dropped into content/guides/*.mdx appear here on the next build.
//
// Frequency + priority tuned for a small hotel-discovery site:
//  - homepage: daily / 1.0 (search + booking landing)
//  - guides index: weekly / 0.9 (evergreen, updated as guides are added)
//  - individual guides: monthly / 0.8 (long-form content, changes slowly)
//  - about + legal: yearly / 0.3 (static)

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://driftcoconut.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Dynamic guide pages - pulls slugs + lastUpdated from MDX frontmatter
  const guides = await listGuides();
  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: g.lastUpdated ? new Date(g.lastUpdated) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...guideEntries];
}
