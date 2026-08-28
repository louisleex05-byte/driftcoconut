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
 */
export function bookingSearchUrl(destination: string): string {
  const encoded = destination.trim().replace(/\s+/g, "+");
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
 * Pre-built deep links for our most-featured Asia destinations.
 * Use these directly in destination guides / seasonal content.
 */
export const BOOKING_DESTINATIONS = {
  bali:          bookingSearchUrl("Bali"),
  bangkok:       bookingSearchUrl("Bangkok"),
  chiangMai:     bookingSearchUrl("Chiang Mai"),
  phuket:        bookingSearchUrl("Phuket"),
  hoChiMinhCity: bookingSearchUrl("Ho Chi Minh City"),
  kyoto:         bookingSearchUrl("Kyoto"),
  tokyo:         bookingSearchUrl("Tokyo"),
  osaka:         bookingSearchUrl("Osaka"),
  singapore:     bookingSearchUrl("Singapore"),
  hongKong:      bookingSearchUrl("Hong Kong"),
  boracay:       bookingSearchUrl("Boracay"),
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
