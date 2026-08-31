import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// Where published guide MDX files live. Add a new guide by dropping bangkok.mdx-style
// files into this folder; the /guides index picks them up automatically.
const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

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

export type GuideSummary = GuideFrontmatter & { readingMinutes: number };

export type GuideFull = GuideSummary & { content: string };

async function readGuideFile(slug: string): Promise<GuideFull | null> {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as GuideFrontmatter;
    const words = content.split(/\s+/).filter(Boolean).length;
    return { ...fm, content, readingMinutes: Math.max(1, Math.round(words / 220)) };
  } catch {
    return null;
  }
}

export async function getGuide(slug: string): Promise<GuideFull | null> {
  return readGuideFile(slug);
}

export async function listGuides(): Promise<GuideSummary[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(GUIDES_DIR);
  } catch {
    return [];
  }
  const slugs = entries
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  const guides = await Promise.all(slugs.map((s) => readGuideFile(s)));
  return guides
    .filter((g): g is GuideFull => g !== null)
    .map(({ content: _content, ...summary }) => summary)
    .sort((a, b) => (b.publishDate ?? "").localeCompare(a.publishDate ?? ""));
}

export async function getGuideSlugs(): Promise<string[]> {
  const guides = await listGuides();
  return guides.map((g) => g.slug);
}
