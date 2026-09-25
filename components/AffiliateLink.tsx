"use client";

import { usePathname } from "next/navigation";
import { bookingCJSearch } from "@/lib/booking";
import { makeMyTripCJ, goibiboCJ } from "@/lib/cuelinks";
import { AFFILIATE_LINKS } from "@/lib/affiliateLinks";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AffiliateType =
  | "booking"
  | "makemytrip"
  | "goibibo"
  | "klook"
  | "welcomePickups"
  | "airalo"
  | "kiwi"
  | "drimsim";

type Props = {
  type: AffiliateType;
  query?: string;
  children: React.ReactNode;
};

/**
 * Turn `<AffiliateLink type="booking" query="Sukhumvit Bangkok">Browse …</AffiliateLink>`
 * (the anchor phrases the guide-workflow app auto-wraps) into a real tracked link.
 *
 * `booking` requires a `query` string — it's routed through the CJ tracker.
 * The other types map directly to Travelpayouts URLs.
 * Airalo now has its own program in AFFILIATE_LINKS as of Aug 2026 — no more Yesim fallback.
 */
export default function AffiliateLink({ type, query, children }: Props) {
  const pathname = usePathname();
  const href = resolveHref(type, query);
  if (!href) {
    // Unknown mapping — render as plain text so the guide still reads correctly.
    return <span>{children}</span>;
  }

  // GA4 event tracking (added Sep 2026) — previously affiliate clicks only
  // showed up as generic "click" events with no way to tell which partner or
  // guide drove them. This fires a distinct, filterable "affiliate_click"
  // event so partner/guide performance is actually measurable in GA4.
  // Mark "affiliate_click" as a Key Event in GA4 Admin to track it as a
  // conversion goal.
  const trackClick = () => {
    window.gtag?.("event", "affiliate_click", {
      affiliate_partner: type,
      affiliate_query: query ?? "",
      page_path: pathname ?? "",
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={trackClick}
      className="text-sea-600 underline decoration-sea-300 underline-offset-2 hover:decoration-sea-500 transition-colors"
    >
      {children}
    </a>
  );
}

function resolveHref(type: AffiliateType, query?: string): string | null {
  switch (type) {
    case "booking":
      if (!query) return null;
      return bookingCJSearch(query);
    case "makemytrip":
      // India-audience hotel affiliate via CueLinks (CID 323072).
      // Query = city name, e.g. "Bangkok" / "Chiang Mai" / "Koh Samui".
      if (!query) return null;
      return makeMyTripCJ(query);
    case "goibibo":
      // India's #2 booking site (MMT-owned). Same CueLinks tracker.
      if (!query) return null;
      return goibiboCJ(query);
    case "klook":
      return AFFILIATE_LINKS.klook;
    case "welcomePickups":
      return AFFILIATE_LINKS.welcomePickups;
    case "airalo":
      return AFFILIATE_LINKS.airalo;
    case "kiwi":
      return AFFILIATE_LINKS.kiwi;
    case "drimsim":
      return AFFILIATE_LINKS.drimsim;
    default:
      return null;
  }
}
