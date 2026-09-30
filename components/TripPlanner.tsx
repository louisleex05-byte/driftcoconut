"use client";

// Journey-based replacement for the flat TravelEssentials grid.
//
// Organises the same affiliate partners by what a traveler needs at each stage:
//   1. Before you go   2. When you land   3. While you're there   4. If things go wrong
//
// - Destination-aware: pass `destination` ("Bangkok") and tiles specialise
//   ("Bangkok airport transfer", "Hotels in Bangkok"). Without it, generic copy.
// - Urgency toggle re-orders stage 1 by lead time (insurance / eSIM first if flying soon).
// - Every outbound click fires the existing GA4 `affiliate_click` event, plus
//   `trip_stage` so per-stage performance shows up in GA and the local dashboard.
// - Same partners / links as before (AFFILIATE_LINKS, Booking CJ). No new relationships.

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AFFILIATE_LINKS, type AffiliateKey } from "@/lib/affiliateLinks";
import { bookingCJSearch, cjLink } from "@/lib/booking";
import { useT } from "@/contexts/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";

type StageId = "before" | "land" | "there" | "wrong";
type Urgency = "week" | "month" | "later";

type Tile = {
  id: string;
  stage: StageId;
  /** Generic title/sub (used when no destination is known). */
  titleKey: TranslationKey;
  subKey: TranslationKey;
  /** Destination-specific title containing "{dest}". */
  destTitleKey?: TranslationKey;
  emoji: string;
  color: string;
  bg: string;
  /** Partner key for tracking + link. "booking" = CJ deep link built from destination. */
  partner: AffiliateKey | "booking" | "bookingAttractions";
  /** Optional secondary partner shown as a small "Also: …" link. */
  alt?: { partner: AffiliateKey; label: string };
};

const TILES: Record<string, Tile> = {
  hotels: {
    id: "hotels", stage: "before",
    titleKey: "plan_hotels_title", subKey: "plan_hotels_sub", destTitleKey: "plan_hotels_dest_title",
    emoji: "🏨", color: "text-sea-700", bg: "bg-sea-50", partner: "booking",
  },
  flights: {
    id: "flights", stage: "before",
    titleKey: "card_aviasales_title", subKey: "card_aviasales_sub",
    emoji: "✈️", color: "text-rose-700", bg: "bg-rose-50", partner: "aviasales",
    alt: { partner: "kiwi", label: "Kiwi.com" },
  },
  insurance: {
    id: "insurance", stage: "before",
    titleKey: "card_ekta_title", subKey: "card_ekta_sub",
    emoji: "🛡️", color: "text-teal-700", bg: "bg-teal-50", partner: "ekta",
  },
  esim: {
    id: "esim", stage: "before",
    titleKey: "card_yesim_title", subKey: "card_yesim_sub",
    emoji: "📶", color: "text-emerald-700", bg: "bg-emerald-50", partner: "yesim",
    alt: { partner: "airalo", label: "Airalo" },
  },
  transfer: {
    id: "transfer", stage: "land",
    titleKey: "card_welcomepickups_title", subKey: "card_welcomepickups_sub", destTitleKey: "plan_transfer_dest_title",
    emoji: "🚕", color: "text-sea-700", bg: "bg-sea-50", partner: "welcomePickups",
    alt: { partner: "kiwitaxi", label: "Kiwitaxi" },
  },
  sim: {
    id: "sim", stage: "land",
    titleKey: "card_drimsim_title", subKey: "card_drimsim_sub",
    emoji: "📱", color: "text-sky-700", bg: "bg-sky-50", partner: "drimsim",
  },
  cars: {
    id: "cars", stage: "land",
    titleKey: "plan_cars_title", subKey: "plan_cars_sub",
    emoji: "🚗", color: "text-indigo-700", bg: "bg-indigo-50", partner: "localrent",
  },
  tours: {
    id: "tours", stage: "there",
    titleKey: "card_klook_title", subKey: "card_klook_sub", destTitleKey: "plan_tours_dest_title",
    emoji: "🎟️", color: "text-amber-700", bg: "bg-amber-50", partner: "klook",
    alt: { partner: "getyourguide", label: "GetYourGuide" },
  },
  tickets: {
    id: "tickets", stage: "there",
    titleKey: "card_tiqets_title", subKey: "card_tiqets_sub",
    emoji: "🎫", color: "text-fuchsia-700", bg: "bg-fuchsia-50", partner: "tiqets",
  },
  attractions: {
    id: "attractions", stage: "there",
    titleKey: "plan_attractions_title", subKey: "plan_attractions_sub",
    emoji: "🗺️", color: "text-sea-700", bg: "bg-sea-50", partner: "bookingAttractions",
  },
  delay: {
    id: "delay", stage: "wrong",
    titleKey: "card_airhelp_title", subKey: "card_airhelp_sub",
    emoji: "💸", color: "text-orange-700", bg: "bg-orange-50", partner: "airhelp",
    alt: { partner: "claimcompass", label: "ClaimCompass" },
  },
  claim: {
    id: "claim", stage: "wrong",
    titleKey: "plan_claim_title", subKey: "plan_claim_sub",
    emoji: "🩺", color: "text-teal-700", bg: "bg-teal-50", partner: "ekta",
  },
  compensation: {
    id: "compensation", stage: "wrong",
    titleKey: "plan_compensation_title", subKey: "plan_compensation_sub",
    emoji: "📋", color: "text-rose-700", bg: "bg-rose-50", partner: "compensair",
  },
};

// Stage 1 is ordered by lead time: the closer the flight, the sooner
// short-lead items (insurance, eSIM) matter versus long-lead items (flights, hotels).
const BEFORE_ORDER: Record<Urgency, string[]> = {
  week:  ["insurance", "esim", "hotels", "flights"],
  month: ["flights", "hotels", "insurance", "esim"],
  later: ["hotels", "flights", "insurance", "esim"],
};

const STAGES: {
  id: StageId;
  titleKey: TranslationKey;
  subKey: TranslationKey;
  tiles: string[];
}[] = [
  { id: "before", titleKey: "plan_s1_title", subKey: "plan_s1_sub", tiles: [] /* filled from BEFORE_ORDER */ },
  { id: "land",   titleKey: "plan_s2_title", subKey: "plan_s2_sub", tiles: ["transfer", "sim", "cars"] },
  { id: "there",  titleKey: "plan_s3_title", subKey: "plan_s3_sub", tiles: ["tours", "tickets", "attractions"] },
  { id: "wrong",  titleKey: "plan_s4_title", subKey: "plan_s4_sub", tiles: ["delay", "claim", "compensation"] },
];

const URGENCY_OPTIONS: { id: Urgency; labelKey: TranslationKey }[] = [
  { id: "week",  labelKey: "plan_urgency_week" },
  { id: "month", labelKey: "plan_urgency_month" },
  { id: "later", labelKey: "plan_urgency_later" },
];

function fill(text: string, dest?: string): string {
  return dest ? text.replace("{dest}", dest) : text;
}

function hrefFor(partner: Tile["partner"], dest?: string): string {
  // No destination (homepage/about/hotel pages): still go to Booking.com through the
  // CJ tracker (its homepage), so the click is always attributed to us.
  if (partner === "booking") return dest ? bookingCJSearch(dest) : cjLink("https://www.booking.com/");
  // Booking.com Attractions (approved CJ link ID) — tickets and tours from the Booking you already use.
  if (partner === "bookingAttractions") return cjLink("https://www.booking.com/attractions/", "attractions");
  // Empty string = link not pasted yet in lib/affiliateLinks.ts → tile is hidden.
  return AFFILIATE_LINKS[partner];
}

export default function TripPlanner({
  destination,
  className = "",
}: {
  /** City/destination in English, e.g. "Bangkok" or "Koh Samui". Optional. */
  destination?: string;
  className?: string;
}) {
  const t = useT();
  const pathname = usePathname() ?? "";
  const [urgency, setUrgency] = useState<Urgency>("month");

  const track = (partner: string, stage: StageId, tileId: string) => {
    window.gtag?.("event", "affiliate_click", {
      affiliate_partner: partner,
      affiliate_query: destination ?? "",
      page_path: pathname,
      trip_stage: stage,
      trip_tile: tileId,
      placement: "trip_planner",
    });
  };

  const stages = STAGES.map((s) => ({
    ...s,
    tiles: s.id === "before" ? BEFORE_ORDER[urgency] : s.tiles,
  }));

  return (
    <section aria-label={t("plan_eyebrow")} className={`relative ${className}`}>
      <div className="text-center mb-4">
        <div className="text-[10px] uppercase tracking-widest text-sea-600 font-semibold">
          {t("plan_eyebrow")}
        </div>
        <h2 className="font-display text-xl md:text-2xl font-semibold text-sea-800 mt-0.5">
          {destination ? fill(t("plan_heading_dest"), destination) : t("plan_heading")}
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">{t("plan_sub")}</p>

        {/* Urgency toggle — re-orders stage 1 */}
        <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-600">{t("plan_urgency_label")}</span>
          <div role="group" aria-label={t("plan_urgency_label")} className="inline-flex rounded-full border border-sea-200 bg-white/80 p-0.5">
            {URGENCY_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={urgency === o.id}
                onClick={() => setUrgency(o.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  urgency === o.id ? "bg-sea-600 text-white" : "text-sea-700 hover:bg-sea-50"
                }`}
              >
                {t(o.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-start">
        {stages.map((stage, si) => (
          <div key={stage.id} className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 rounded-full bg-sea-600 text-white text-xs font-semibold flex items-center justify-center mt-0.5"
              >
                {si + 1}
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold text-sea-800 leading-tight">{t(stage.titleKey)}</h3>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{t(stage.subKey)}</p>
              </div>
            </div>

            {stage.tiles
              // Hide any tile whose affiliate link hasn't been pasted yet (empty string).
              .filter((id) => hrefFor(TILES[id].partner, destination) !== "")
              .map((id, ti) => {
              const tile = TILES[id];
              const href = hrefFor(tile.partner, destination);
              const altHref = tile.alt ? AFFILIATE_LINKS[tile.alt.partner] : "";
              const title = destination && tile.destTitleKey ? fill(t(tile.destTitleKey), destination) : t(tile.titleKey);
              const doFirst = stage.id === "before" && ti === 0;
              const body = (
                <>
                  {doFirst && (
                    <div className="absolute top-1 right-1 text-[8px] uppercase tracking-wider text-rose-700 font-semibold bg-rose-50 px-1.5 py-[1px] rounded-full">
                      {t("plan_do_first")}
                    </div>
                  )}
                  <div className={`w-8 h-8 rounded-full ${tile.bg} flex items-center justify-center text-base mb-1.5 flex-shrink-0`}>
                    {tile.emoji}
                  </div>
                  <h4 className={`font-display text-[13px] leading-tight font-semibold ${tile.color} group-hover:text-sea-700 transition-colors`}>
                    {title}
                  </h4>
                  <p className="text-[11px] leading-snug text-slate-600 mt-0.5">{t(tile.subKey)}</p>
                  <div className="mt-1.5 text-[11px] font-medium text-sea-700 inline-flex items-center gap-1">
                    {t("essentials_book_now")}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </>
              );
              const cardClass =
                "group bg-white/80 backdrop-blur border border-sea-100 rounded-lg p-2.5 hover:border-sea-300 hover:shadow-sm transition-all flex flex-col relative";

              return (
                <div key={id} className="flex flex-col gap-1">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener sponsored"
                    onClick={() => track(tile.partner, stage.id, id)}
                    className={cardClass}
                  >
                    {body}
                  </a>
                  {tile.alt && altHref !== "" && (
                    <a
                      href={altHref}
                      target="_blank"
                      rel="noopener sponsored"
                      onClick={() => track(tile.alt!.partner, stage.id, id)}
                      className="text-[10px] text-slate-500 hover:text-sea-700 px-1"
                    >
                      {t("plan_also")}: <span className="underline underline-offset-2">{tile.alt.label}</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-[9px] text-slate-400 mt-4 text-center italic">{t("essentials_disclosure")}</p>
    </section>
  );
}
