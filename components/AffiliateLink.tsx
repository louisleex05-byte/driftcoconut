import { bookingCJSearch } from "@/lib/booking";
import { AFFILIATE_LINKS } from "@/lib/affiliateLinks";

type AffiliateType =
  | "booking"
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
  const href = resolveHref(type, query);
  if (!href) {
    // Unknown mapping — render as plain text so the guide still reads correctly.
    return <span>{children}</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
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
