// CueLinks affiliate helpers for driftcoconut.
//
// Publisher CID: 323072 (verified 24-Sep-2026)
// CueLinks aggregates 500+ affiliate programs including MakeMyTrip, Goibibo,
// Yatra, EaseMyTrip, Agoda India, and Booking.com India.
//
// Two ways CueLinks tracks a click:
//   1. Auto-convert: the <CueLinksScript /> component on every page rewrites
//      raw merchant URLs (makemytrip.com, goibibo.com) into tracked linksredirect.com
//      URLs at click time. Guides can just link to raw merchant URLs.
//   2. Deep link: cueLinksDeepLink(merchantUrl) builds a pre-tracked URL
//      manually — used by <AffiliateLink type="makemytrip"> etc. for reliable
//      server-side attribution without depending on client-side JS.
//
// Docs: https://www.cuelinks.com/docs/

export const CUELINKS_CID = process.env.NEXT_PUBLIC_CUELINKS_CID || "323072";

/**
 * Wrap any merchant URL in a CueLinks tracker so commissions attribute
 * to driftcoconut (CID 323072).
 *
 * Example:
 *   cueLinksDeepLink("https://www.makemytrip.com/hotels/hotels-in-bangkok.html")
 *   → "https://linksredirect.com/?cid=323072&source=linkkit&url=https%3A%2F%2Fwww.makemytrip.com%2Fhotels%2Fhotels-in-bangkok.html"
 */
export function cueLinksDeepLink(merchantUrl: string): string {
  const encoded = encodeURIComponent(merchantUrl);
  return `https://linksredirect.com/?cid=${CUELINKS_CID}&source=linkkit&url=${encoded}`;
}

// ─── Merchant URL builders (India-focused) ─────────────────────────

/**
 * MakeMyTrip hotel search for a given city.
 * Slug the city: "Bangkok" -> "bangkok", "Koh Samui" -> "koh-samui".
 */
export function makeMyTripHotelUrl(city: string): string {
  const slug = city
    .trim()
    .toLowerCase()
    .replace(/,.*$/, "")           // "Bangkok, Thailand" -> "Bangkok"
    .replace(/[^a-z0-9]+/g, "-")   // spaces + specials -> hyphens
    .replace(/^-+|-+$/g, "");
  return `https://www.makemytrip.com/hotels/hotels-in-${slug}.html`;
}

/**
 * Goibibo hotel search for a given city. Goibibo uses uppercase display names.
 */
export function goibiboHotelUrl(city: string): string {
  const clean = city.trim().replace(/,.*$/, "");
  const encoded = encodeURIComponent(clean);
  return `https://www.goibibo.com/hotels/hotels-in-${encoded.toLowerCase()}-ct/`;
}

// ─── Shortcut: one-call tracked deep links ─────────────────────────

export function makeMyTripCJ(city: string): string {
  return cueLinksDeepLink(makeMyTripHotelUrl(city));
}

export function goibiboCJ(city: string): string {
  return cueLinksDeepLink(goibiboHotelUrl(city));
}
