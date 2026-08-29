"use client";

import { BOOKING_CJ, bookingCJSearch } from "@/lib/booking";
import { useT } from "@/contexts/LanguageProvider";

/**
 * City-aware Booking.com CJ card for the /search results page.
 * Shows in mock mode as the primary "real inventory" CTA — earns commission
 * regardless of whether our own Agoda backend is live.
 */
export default function SearchBookingCard({ cityName }: { cityName: string }) {
  const t = useT();
  const href = bookingCJSearch(cityName);
  const cityShort = cityName.split(",")[0].trim(); // "Tokyo, Japan" → "Tokyo"

  return (
    <aside
      aria-label="Booking.com affiliate offer"
      className="bg-white border border-sea-200 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
          {t("booking_card_eyebrow")}
        </div>
        <h3
          className="font-display text-base sm:text-lg font-semibold leading-tight"
          style={{ color: BOOKING_CJ.brandColor }}
        >
          {t("search_booking_card_title_prefix")}
          {cityShort}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {t("search_booking_card_body")}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="inline-block text-white font-semibold rounded-md px-5 py-2.5 text-sm transition-opacity hover:opacity-90 whitespace-nowrap flex-shrink-0"
        style={{ backgroundColor: BOOKING_CJ.brandColor }}
      >
        {t("booking_card_cta")}
      </a>
    </aside>
  );
}
