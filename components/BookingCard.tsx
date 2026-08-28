"use client";

import { BOOKING_CJ, bookingCJSearch, bookingSearchUrl, cjLink } from "@/lib/booking";
import { useT } from "@/contexts/LanguageProvider";

type Props = {
  /** Destination string (e.g. "Bali", "Chiang Mai") — becomes the ss= param. */
  destination?: string;
  /** Or pass a pre-built Booking.com URL (hotel page, custom search, etc.). */
  bookingUrl?: string;
  /** CJ link ID to use — defaults to evergreen. */
  linkId?: keyof typeof BOOKING_CJ.advertiserIds;
  /** Compact variant — less padding, smaller CTA. Useful in sidebars. */
  compact?: boolean;
  /** Custom heading; falls back to i18n default. */
  headingOverride?: string;
};

/**
 * Booking.com brand-navy CTA card. Drop into any post/section as an
 * end-of-content conversion nudge. Uses our CJ publisher ID via cjLink().
 */
export default function BookingCard({
  destination,
  bookingUrl,
  linkId = "evergreen",
  compact = false,
  headingOverride,
}: Props) {
  const t = useT();

  // Build the tracked href
  const href = bookingUrl
    ? cjLink(bookingUrl, linkId)
    : destination
      ? bookingCJSearch(destination, linkId)
      : cjLink(bookingSearchUrl(""), linkId);

  const padding = compact ? "p-4" : "p-5 sm:p-6";
  const titleSize = compact ? "text-sm sm:text-base" : "text-base sm:text-lg";
  const ctaPadding = compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm";

  return (
    <aside
      aria-label="Booking.com affiliate offer"
      className={`booking-card bg-white border border-sea-100 rounded-xl ${padding} shadow-sm max-w-2xl`}
    >
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">
        {t("booking_card_eyebrow")}
      </div>
      <h3
        className={`font-display font-semibold ${titleSize} mb-1.5`}
        style={{ color: BOOKING_CJ.brandColor }}
      >
        {headingOverride ?? t("booking_card_title")}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
        {t("booking_card_body")}
      </p>
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener"
        className={`inline-block text-white font-semibold rounded-md ${ctaPadding} transition-opacity hover:opacity-90`}
        style={{ backgroundColor: BOOKING_CJ.brandColor }}
      >
        {t("booking_card_cta")}
      </a>
    </aside>
  );
}
