import type { MetadataRoute } from "next";
import { listGuides } from "@/lib/guides";
import fs from "node:fs/promises";
import path from "node:path";

// Dynamic sitemap generation. Next.js 15 serves this at /sitemap.xml automatically.
// New guides dropped into content/guides/*.mdx appear here on the next build.
//
// Frequency + priority tuned for a small hotel-discovery site:
//  - homepage: daily / 1.0 (search + booking landing)
//  - guides index: weekly / 0.9 (evergreen, updated as guides are added)
//  - individual guides: monthly / 0.8 (long-form content, changes slowly)
//  - about + legal: yearly / 0.3 (static)
//
// Multilingual: Chinese (/zh/...) URLs are emitted with hreflang alternates
// so Google/Baidu/Bing know the pages are linked language variants.
// A guide only appears in /zh/... if a bangkok.zh.mdx variant file exists.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://driftcoconut.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes (English + Chinese equivalents)
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${SITE_URL}/`,
          "zh-CN": `${SITE_URL}/zh`,
        },
      },
    },
    {
      url: `${SITE_URL}/zh`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${SITE_URL}/guides`,
          "zh-CN": `${SITE_URL}/zh/guides`,
        },
      },
    },
    {
      url: `${SITE_URL}/zh/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
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

  // Dynamic guide pages - English default + Chinese variant if bangkok.zh.mdx exists
  const guides = await listGuides();
  const guidesDir = path.join(process.cwd(), "content", "guides");

  const guideEntries: MetadataRoute.Sitemap = [];
  for (const g of guides) {
    // Check if a Chinese variant exists so we only advertise real content
    let hasZh = false;
    try {
      await fs.access(path.join(guidesDir, `${g.slug}.zh.mdx`));
      hasZh = true;
    } catch {}

    guideEntries.push({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: g.lastUpdated ? new Date(g.lastUpdated) : now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: hasZh
        ? {
            languages: {
              en: `${SITE_URL}/guides/${g.slug}`,
              "zh-CN": `${SITE_URL}/zh/guides/${g.slug}`,
            },
          }
        : undefined,
    });

    if (hasZh) {
      guideEntries.push({
        url: `${SITE_URL}/zh/guides/${g.slug}`,
        lastModified: g.lastUpdated ? new Date(g.lastUpdated) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [...staticEntries, ...guideEntries];
}
