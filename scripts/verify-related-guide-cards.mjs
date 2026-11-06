/** Fail a guide release when its rendered related-destination cards disappear. */
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const siteArg = process.argv.find((arg) => arg.startsWith("--site="));
const site = siteArg ? new URL(siteArg.slice(7)) : null;
if (site && (site.protocol !== "https:" || site.pathname !== "/" || site.search || site.hash)) {
  throw new Error("--site must be an HTTPS site root");
}

function imagePath(src) {
  const url = new URL(src.replaceAll("&amp;", "&"), site ?? "https://driftcoconut.com");
  const path = url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
  return path && /^\/guides\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(path) ? path : null;
}

export function inspectGuideHtml(html, slug, locale) {
  const errors = [];
  const sections = [...html.matchAll(/<section\b[^>]*\bid="related-destination-cards"[^>]*>[\s\S]*?<\/section>/gi)];
  if (sections.length !== 1) return { errors: [`expected one related card section, found ${sections.length}`], images: [] };

  const section = sections[0];
  const heading = [...html.slice(0, section.index).matchAll(/<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/gi)].at(-1)?.[1]
    ?.replace(/<[^>]+>/g, "").trim();
  const expectedHeading = locale === "en"
    ? heading === "Related destinations"
    : /^(相关目的地|周边目的地|延伸目的地|延伸阅读)$/.test(heading ?? "");
  if (!expectedHeading) errors.push(`cards are not immediately after the related-destinations section (last heading: ${heading ?? "none"})`);
  const planner = html.indexOf('aria-label="Trip planner"', section.index + section[0].length);
  if (planner < 0) errors.push("trip planner is missing or appears before related cards");

  const anchors = [...section[0].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  if (anchors.length < 3) errors.push(`expected at least 3 photo cards, found ${anchors.length}`);
  const prefix = `${locale === "zh" ? "/zh" : ""}/guides/`;
  const hrefs = new Set();
  const images = [];
  for (const [, attrs, body] of anchors) {
    const href = attrs.match(/\bhref="([^"]+)"/i)?.[1];
    if (!href?.startsWith(prefix) || href === `${prefix}${slug}` || hrefs.has(href)) {
      errors.push(`invalid or duplicate related link: ${href ?? "missing"}`);
    }
    hrefs.add(href);
    const src = body.match(/<img\b[^>]*\bsrc="([^"]+)"/i)?.[1];
    const path = src && imagePath(src);
    if (!path) errors.push(`related card ${href ?? "unknown"} has no local hero image`);
    else images.push(path);
  }
  return { errors, images };
}

async function mapLimited(items, limit, fn) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) await fn(items[next++]);
  });
  await Promise.all(workers);
}

async function check() {
  const filenames = await readdir(join(root, "content", "guides"));
  const slugs = filenames.filter((name) => name.endsWith(".mdx") && !name.endsWith(".zh.mdx"))
    .map((name) => name.slice(0, -4)).sort();
  const failures = [];
  const imagePaths = new Set();
  await mapLimited(slugs.flatMap((slug) => [
    { slug, locale: "en" }, { slug, locale: "zh" },
  ]), 6, async ({ slug, locale }) => {
    const route = `${locale === "zh" ? "/zh" : ""}/guides/${slug}`;
    try {
      let html;
      if (site) {
        const response = await fetch(new URL(route, site), { signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        html = await response.text();
      } else {
        html = await readFile(join(root, ".next", "server", "app", ...route.slice(1).split("/").slice(0, -1), `${slug}.html`), "utf8");
      }
      const result = inspectGuideHtml(html, slug, locale);
      for (const error of result.errors) failures.push(`${route}: ${error}`);
      for (const path of result.images) imagePaths.add(path);
    } catch (error) {
      failures.push(`${route}: ${error.message}`);
    }
  });

  await mapLimited([...imagePaths], 6, async (path) => {
    if (!site) {
      if (!existsSync(join(root, "public", path.slice(1)))) failures.push(`${path}: hero image file missing`);
      return;
    }
    try {
      const response = await fetch(new URL(path, site), { method: "HEAD", signal: AbortSignal.timeout(20000) });
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
        failures.push(`${path}: image response HTTP ${response.status} (${response.headers.get("content-type") ?? "no content type"})`);
      }
    } catch (error) {
      failures.push(`${path}: ${error.message}`);
    }
  });

  if (failures.length) {
    failures.sort().forEach((failure) => console.error(`FAIL: ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${slugs.length * 2} rendered guides have related photo cards beside destination links; ${imagePaths.size} distinct hero images exist${site ? " on the live site" : " in the build"}.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  check().catch((error) => { console.error(`FAIL: ${error.message}`); process.exitCode = 1; });
}
