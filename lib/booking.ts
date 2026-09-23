// Booking.com CJ affiliate helpers for driftcoconut.
//
// Program:   Booking.com North America (advertiser 7864295)
// Publisher: 101849416 (driftcoconut on CJ)
// Approved:  14-May-2026
// Commission: 4% lead on completed stays; no cookie — in-session only
//
// See uploads/1787924653221_booking-affiliate-notes.md for full context.

export const BOOKING_CJ = {
  publisherId: "101849416",
  advertiserIds: {
    evergreen: "17293132",       // Workhorse deep-link ID — 7-day EPC $114
    getawayDeals2026: "17288985", // Seasonal 11-May → 1-Oct-2026 — 7-day EPC $198
    attractions: "17288984",      // Attractions homepage — good Asia inventory
  },
  brandColor: "#003580",          // Booking.com brand navy — use on CTAs
} as const;

/**
 * Wrap any Booking.com URL in a CJ click-tracker so commissions attribute
 * to the driftcoconut publisher ID.
 *
 * Example:
 *   cjLink("https://www.booking.com/searchresults.html?ss=Bali")
 *   → "https://www.tkqlhce.com/click-101849416-17293132?url=https%3A%2F%2F..."
 *
 * @param bookingUrl - any URL on booking.com (search, hotel page, deep link)
 * @param linkId - which CJ link to use (default: evergreen)
 */
export function cjLink(
  bookingUrl: string,
  linkId: keyof typeof BOOKING_CJ.advertiserIds = "evergreen"
): string {
  const advertiserId = BOOKING_CJ.advertiserIds[linkId];
  return `https://www.tkqlhce.com/click-${BOOKING_CJ.publisherId}-${advertiserId}?url=${encodeURIComponent(bookingUrl)}`;
}

/**
 * Build a Booking.com search URL for a destination.
 * Booking auto-detects the user's browser locale — a Thai user gets Thai UI + THB.
 *
 * Uses encodeURIComponent so commas, apostrophes, and non-ASCII characters
 * (Thai script, accented names) are safely escaped. Booking.com's search
 * accepts multi-word destinations as `ss=Koh+Samui%2C+Thailand`.
 */
export function bookingSearchUrl(destination: string): string {
  const cleaned = destination.trim().replace(/\s+/g, " ");
  const encoded = encodeURIComponent(cleaned).replace(/%20/g, "+");
  return `https://www.booking.com/searchresults.html?ss=${encoded}`;
}

/**
 * Shortcut: build a fully-tracked Booking.com link for a destination in one call.
 */
export function bookingCJSearch(
  destination: string,
  linkId: keyof typeof BOOKING_CJ.advertiserIds = "evergreen"
): string {
  return cjLink(bookingSearchUrl(destination), linkId);
}

/**
 * Pre-built deep links for our most-featured destinations.
 * Use these directly in destination guides / seasonal content.
 * Thailand block matches every published guide slug.
 */
export const BOOKING_DESTINATIONS = {
  // Thailand - primary focus
  bangkok:       bookingSearchUrl("Bangkok, Thailand"),
  chiangMai:     bookingSearchUrl("Chiang Mai, Thailand"),
  phuket:        bookingSearchUrl("Phuket, Thailand"),
  krabi:         bookingSearchUrl("Krabi, Thailand"),
  samui:         bookingSearchUrl("Koh Samui, Thailand"),
  pattaya:       bookingSearchUrl("Pattaya, Thailand"),
  chiangRai:     bookingSearchUrl("Chiang Rai, Thailand"),
  ayutthaya:     bookingSearchUrl("Ayutthaya, Thailand"),
  pai:           bookingSearchUrl("Pai, Thailand"),
  maeHongSon:    bookingSearchUrl("Mae Hong Son, Thailand"),
  huaHin:        bookingSearchUrl("Hua Hin, Thailand"),
  kanchanaburi:  bookingSearchUrl("Kanchanaburi, Thailand"),
  kohLanta:      bookingSearchUrl("Koh Lanta, Thailand"),
  kohChang:      bookingSearchUrl("Koh Chang, Thailand"),
  // Rest of Asia
  bali:          bookingSearchUrl("Bali, Indonesia"),
  hoChiMinhCity: bookingSearchUrl("Ho Chi Minh City, Vietnam"),
  kyoto:         bookingSearchUrl("Kyoto, Japan"),
  tokyo:         bookingSearchUrl("Tokyo, Japan"),
  osaka:         bookingSearchUrl("Osaka, Japan"),
  singapore:     bookingSearchUrl("Singapore"),
  hongKong:      bookingSearchUrl("Hong Kong"),
  boracay:       bookingSearchUrl("Boracay, Philippines"),
  maldives:      bookingSearchUrl("Maldives"),
} as const;

/**
 * URL of the 1×1 CJ impression pixel.
 * Load once per page (site-wide, in the footer) to keep EPC reconciliation working.
 */
export function bookingImpressionPixelUrl(
  linkId: keyof typeof BOOKING_CJ.advertiserIds = "evergreen"
): string {
  const advertiserId = BOOKING_CJ.advertiserIds[linkId];
  return `https://www.lduhtrp.net/image-${BOOKING_CJ.publisherId}-${advertiserId}`;
}
