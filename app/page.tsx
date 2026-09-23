"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import PartnerStrip from "@/components/PartnerStrip";
import SearchForm from "@/components/SearchForm";
import TravelEssentials from "@/components/TravelEssentials";
import GuideTipsBadge from "@/components/GuideTipsBadge";
import { Hibiscus, Starfish, PalmLeaf, Boat, StrawHat, Coral, Conch, Shell } from "@/components/Decorations";
import { useT } from "@/contexts/LanguageProvider";
import { bookingCJSearch } from "@/lib/booking";
import { shuffleDrift, type Category } from "@/lib/driftDestinations";

export default function HomePage() {
  const t = useT();

  // Randomized drift-card destinations. Start with a deterministic set for the
  // initial server-rendered HTML, then swap in random picks on mount to avoid
  // hydration mismatch. Any click re-shuffles for the next view.
  const [drift, setDrift] = useState<ReturnType<typeof shuffleDrift> | null>(null);
  useEffect(() => {
    setDrift(shuffleDrift());
  }, []);
  const reshuffle = () => setDrift(shuffleDrift());

  return (
    <div className="relative">
      {/* HERO + partner strip / expanded guide tip box.
          PartnerStrip is now single-logo (Booking.com only) - much narrower.
          GuideTipsBadge takes equal weight on desktop for better balance. */}
      <div className="mb-8">
        <Hero />
        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <PartnerStrip />
          <div>
            <GuideTipsBadge featuredSlug="bangkok" />
          </div>
        </div>
      </div>

      {/* MAIN SEARCH FORM - moved up as the primary conversion CTA.
          Sits directly under the hero/partner block so users don't scroll to book. */}
      <section id="search-form" className="mb-8 scroll-mt-24 fade-slide-up">
        <div className="text-center mb-5">
          <div className="text-xs section-eyebrow mb-2">
            {t("search_eyebrow")}
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-sea-900 mt-1 leading-tight">
            {t("search_title")}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-coral-gradient" />
        </div>
        <SearchForm />
      </section>

      {/* Divider decorations between Search and Drift sections */}
      <div className="relative h-3 flex items-center justify-center mb-4">
        <Boat className="hidden md:block absolute left-1/4 w-12 text-sea-400 opacity-45 pointer-events-none" />
        <StrawHat className="hidden md:block absolute right-1/4 w-10 text-sea-400 opacity-45 pointer-events-none rotate-6" />
        <Conch className="hidden lg:block absolute left-2/3 w-8 text-sea-500 opacity-45 pointer-events-none -rotate-12" />
      </div>

      {/* WHERE TO DRIFT NEXT - now with vibrant per-card themes.
          Each mood gets its own tropical color: coral (tropical), sea (city), palm (mountain). */}
      <section id="deals" className="relative pt-2 pb-6 mb-8">
        <Hibiscus className="absolute -top-6 -right-2 w-20 md:w-28 text-coral-400 opacity-80 rotate-12 pointer-events-none drift-float" />
        <Starfish className="hidden sm:block absolute -bottom-4 -left-4 w-20 md:w-24 text-sunset-400 opacity-80 -rotate-12 pointer-events-none drift-bob" />

        <div className="text-center mb-6 relative">
          <div className="text-xs section-eyebrow mb-2">
            {t("deals_eyebrow")}
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-sea-900 mt-1 leading-tight">
            {t("deals_title")}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-coral-gradient" />
        </div>

        <div className="relative z-10">
          <div className="grid md:grid-cols-3 gap-5">
            {(
              [
                { cat: "tropical" as Category, titleKey: "deals_tropical_title", emoji: "🏝️", accent: "shell",    fallback: "Bali, Phuket, Maldives", theme: { bg: "from-coral-50 to-sunset-50",  border: "border-coral-200 hover:border-coral-400",   ring: "ring-coral-100",   iconColor: "text-coral-300",   btn: "text-coral-600" } },
                { cat: "city"     as Category, titleKey: "deals_city_title",     emoji: "🏙️", accent: "conch",    fallback: "Tokyo, Singapore, HK",   theme: { bg: "from-sea-50 to-lagoon-50",    border: "border-sea-200 hover:border-sea-400",       ring: "ring-sea-100",     iconColor: "text-sea-300",     btn: "text-sea-700"   } },
                { cat: "mountain" as Category, titleKey: "deals_mountain_title", emoji: "⛰️", accent: "starfish", fallback: "Chiang Mai, Kyoto, Sapa", theme: { bg: "from-palm-50 to-lagoon-50",   border: "border-palm-200 hover:border-palm-400",     ring: "ring-palm-100",    iconColor: "text-palm-300",    btn: "text-palm-600"  } },
              ]
            ).map((c) => {
              const pick = drift?.[c.cat];
              const dest = pick?.primary ?? c.fallback.split(",")[0].trim();
              const descLine = pick
                ? [pick.primary, ...pick.others].join(", ")
                : c.fallback;
              return (
                <a
                  key={c.titleKey}
                  href={bookingCJSearch(dest)}
                  onClick={reshuffle}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className={`group relative bg-gradient-to-br ${c.theme.bg} backdrop-blur rounded-2xl border ${c.theme.border} p-6 hover:shadow-tropical-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block overflow-hidden`}
                >
                  <div className="text-4xl drift-bob inline-block">{c.emoji}</div>
                  <h3 className="font-display text-xl font-semibold mt-2 text-sea-900 group-hover:text-sea-800 transition-colors leading-tight">{t(c.titleKey as never)}</h3>
                  <p className="text-sm text-slate-700 mt-1.5 transition-opacity duration-300">{descLine}</p>
                  <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${c.theme.btn} transition-colors`}>
                    {t("essentials_book_now")} {pick && <span className="opacity-70">· {pick.primary}</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                  {c.accent === "shell"    && <Shell    className={`absolute bottom-3 right-3 w-14 ${c.theme.iconColor} opacity-70 pointer-events-none`} />}
                  {c.accent === "conch"    && <Conch    className={`absolute bottom-3 right-3 w-14 ${c.theme.iconColor} opacity-70 pointer-events-none`} />}
                  {c.accent === "starfish" && <Starfish className={`absolute bottom-3 right-3 w-14 ${c.theme.iconColor} opacity-70 pointer-events-none`} />}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 mb-10">
        <TravelEssentials />
      </section>

      <PalmLeaf className="hidden lg:block fixed -bottom-20 -right-20 w-72 text-sea-200 opacity-60 rotate-45 pointer-events-none -z-10" />
      <Coral className="hidden lg:block fixed top-1/3 -left-10 w-40 text-sea-200 opacity-45 -rotate-6 pointer-events-none -z-10" />
    </div>
  );
}
