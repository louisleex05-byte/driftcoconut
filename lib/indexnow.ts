// IndexNow integration for driftcoconut.
//
// IndexNow is a protocol backed by Microsoft (Bing) and Yandex: instead of
// waiting for a scheduled sitemap crawl, the site pushes a ping the instant
// a page is published or updated, and the search engine fetches it right
// away. One submission covers both Bing and Yandex.
//
// Setup (already done):
//   1. Key file hosted at the site root: public/<KEY>.txt containing just
//      the key. IndexNow fetches this to confirm domain ownership before
//      accepting any submission.
//   2. Host = "driftcoconut.com" (matches the canonical, non-www URLs used
//      throughout app/sitemap.ts and NEXT_PUBLIC_SITE_URL).
//
// Docs: https://www.indexnow.org/documentation

export const INDEXNOW_KEY = "8c49cefe230e24a34dc92e8999c37d54";
export const INDEXNOW_HOST = "driftcoconut.com";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

// Any of these three endpoints work - IndexNow shares submissions across
// participating engines (Bing, Yandex). Using Bing's directly.
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Submit one or more absolute URLs (must be on INDEXNOW_HOST) to IndexNow.
 * Fire-and-forget is fine for the publish pipeline - a failed ping here
 * should never block a guide from publishing. IndexNow also has no strict
 * per-call size limit worth worrying about at this site's scale (max docs
 * is 10,000 URLs per submission).
 */
export async function submitToIndexNow(urls: string[]): Promise<{ ok: boolean; status?: number; error?: string }> {
  if (urls.length === 0) return { ok: true };
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: urls,
      }),
    });
    // IndexNow returns 200 or 202 on success; 200 means "already known", 202 means "received".
    return { ok: res.status === 200 || res.status === 202, status: res.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Build the EN (+ ZH, if it exists) URL pair for a single guide slug -
 * what the publish pipeline pings after a new guide goes live.
 */
export function guideUrls(slug: string, hasZh: boolean): string[] {
  const urls = [`https://${INDEXNOW_HOST}/guides/${slug}`];
  if (hasZh) urls.push(`https://${INDEXNOW_HOST}/zh/guides/${slug}`);
  return urls;
}
