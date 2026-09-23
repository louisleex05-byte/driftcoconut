import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// Where published guide MDX files live. Add a new guide by dropping bangkok.mdx-style
// files into this folder; the /guides index picks them up automatically.
//
// Locale variants: append a locale suffix before .mdx, e.g. `bangkok.zh.mdx` for
// Simplified Chinese. English is the default and uses `bangkok.mdx` (no suffix).
// If a locale variant is missing, we transparently fall back to the English file
// so partial translations don't break the site.
const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

export type GuideLocale = "en" | "zh"; // Thai guides not yet drafted; add "th" when ready

export type GuideFrontmatter = {
  slug: string;
  title: string;
  description: string;
  author: string;
  destination: string;
  publishDate: string;
  lastUpdated: string;
  hero?: string;
  heroAlt?: string;
};

export type GuideSummary = GuideFrontmatter & { readingMinutes: number; locale?: GuideLocale };

export type GuideFull = GuideSummary & { content: string; hasLocale: GuideLocale[] };

// Try locale-specific file first, then fall back to English.
async function readGuideFile(slug: string, locale: GuideLocale = "en"): Promise<GuideFull | null> {
  const filenames = locale === "en" ? [`${slug}.mdx`] : [`${slug}.${locale}.mdx`, `${slug}.mdx`];

  // Detect which locale variants exist on disk (for hreflang generation)
  const hasLocale: GuideLocale[] = ["en"];
  try {
    await fs.access(path.join(GUIDES_DIR, `${slug}.zh.mdx`));
    hasLocale.push("zh");
  } catch {}

  for (const name of filenames) {
    try {
      const raw = await fs.readFile(path.join(GUIDES_DIR, name), "utf8");
      const { data, content } = matter(raw);
      const fm = data as GuideFrontmatter;
      const words = content.split(/\s+/).filter(Boolean).length;
      const readingMinutes = Math.max(1, Math.round(words / 220));
      return { ...fm, content, readingMinutes, locale, hasLocale };
    } catch {
      // fall through to next candidate
    }
  }
  return null;
}

export async function getGuide(slug: string, locale: GuideLocale = "en"): Promise<GuideFull | null> {
  return readGuideFile(slug, locale);
}

export async function listGuides(locale: GuideLocale = "en"): Promise<GuideSummary[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(GUIDES_DIR);
  } catch {
    return [];
  }
  // Base slugs = English files (no `.zh.` etc.). Locale variants are looked up per slug.
  const slugs = entries
    .filter((f) => f.endsWith(".mdx") && !f.match(/\.(zh|th)\.mdx$/))
    .map((f) => f.replace(/\.mdx$/, ""));
  const guides = await Promise.all(slugs.map((s) => readGuideFile(s, locale)));
  return guides
    .filter((g): g is GuideFull => g !== null)
    .map(({ content: _content, hasLocale: _h, ...summary }) => summary)
    .sort((a, b) => (b.publishDate ?? "").localeCompare(a.publishDate ?? ""));
}

export async function getGuideSlugs(): Promise<string[]> {
  const guides = await listGuides();
  return guides.map((g) => g.slug);
}
