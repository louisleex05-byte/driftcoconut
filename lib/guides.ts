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

function getReadingMinutes(content: string, locale: GuideLocale): number {
  if (locale === "zh") {
    // Chinese prose is not space-delimited. Count CJK characters at an
    // approximate 400 characters per minute, while retaining a small allowance
    // for place names, prices, and other Latin-script text.
    const visibleText = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const hanCharacters = (visibleText.match(/[\u3400-\u9fff]/g) ?? []).length;
    const latinWords = visibleText
      .replace(/[\u3400-\u9fff]/g, " ")
      .match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)?.length ?? 0;
    return Math.max(1, Math.round(hanCharacters / 400 + latinWords / 220));
  }

  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

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
      const readingMinutes = getReadingMinutes(content, locale);
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

  // Sort priority for the guides index:
  //   1. Guides that HAVE a Chinese translation come first (promoted to first row)
  //      so users see the fully-translated content immediately after landing.
  //   2. Within each group, sort by publishDate DESC (newest first) as before.
  // This applies to BOTH /guides and /zh/guides.
  return guides
    .filter((g): g is GuideFull => g !== null)
    .sort((a, b) => {
      const aHasZh = a.hasLocale?.includes("zh") ? 1 : 0;
      const bHasZh = b.hasLocale?.includes("zh") ? 1 : 0;
      if (aHasZh !== bHasZh) return bHasZh - aHasZh;  // translated guides win
      return (b.publishDate ?? "").localeCompare(a.publishDate ?? "");
    })
    .map(({ content: _content, hasLocale: _h, ...summary }) => summary);
}

export async function getGuideSlugs(): Promise<string[]> {
  const guides = await listGuides();
  return guides.map((g) => g.slug);
}
