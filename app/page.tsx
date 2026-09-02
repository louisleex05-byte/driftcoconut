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
      <div className="mb-10">
        <Hero />
        {/* PartnerStrip on the left, GuideTipsBadge on the right (lg+); stacks on smaller screens */}
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <PartnerStrip />
          <div className="lg:pt-2">
            <GuideTipsBadge featuredSlug="bangkok" />
          </div>
        </div>
      </div>

      {/* Where to drift next */}
      <section id="deals" className="relative pt-2 pb-6 mb-6">
        <Hibiscus className="absolute -top-6 -right-2 w-20 md:w-28 text-sea-300 opacity-70 rotate-12 pointer-events-none" />
        <Starfish className="hidden sm:block absolute -bottom-4 -left-4 w-20 md:w-24 text-sea-400 opacity-70 -rotate-12 pointer-events-none" />

        <div className="text-center mb-6 relative">
          <div className="text-xs uppercase tracking-widest text-sea-600 font-semibold">
            {t("deals_eyebrow")}
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-sea-800 mt-1">
            {t("deals_title")}
          </h2>
        </div>

        {/* 3 destination cards, full width (Guide Tips badge moved up next to PartnerStrip) */}
        <div className="relative z-10">
          <div className="grid md:grid-cols-3 gap-4">
            {(
              [
                { cat: "tropical" as Category, titleKey: "deals_tropical_title", emoji: "🏝️", accent: "shell",    fallback: "Bali, Phuket, Maldives" },
                { cat: "city"     as Category, titleKey: "deals_city_title",     emoji: "🏙️", accent: "conch",    fallback: "Tokyo, Singapore, HK" },
                { cat: "mountain" as Category, titleKey: "deals_mountain_title", emoji: "⛰️", accent: "starfish", fallback: "Chiang Mai, Kyoto, Sapa" },
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
                  className="group relative bg-white/80 backdrop-blur rounded-xl border border-sea-100 p-6 hover:border-sea-300 hover:shadow-md transition-all cursor-pointer block"
                >
                  <div className="text-3xl">{c.emoji}</div>
                  <h3 className="font-display text-lg font-semibold mt-2 text-sea-800 group-hover:text-sea-700 transition-colors">{t(c.titleKey as never)}</h3>
                  <p className="text-sm text-slate-600 mt-1 transition-opacity duration-300">{descLine}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sea-700 opacity-80 group-hover:opacity-100 transition-opacity">
                    {t("essentials_book_now")} {pick && <span className="text-sea-500">· {pick.primary}</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                  {c.accent === "shell" && <Shell className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-60 pointer-events-none" />}
                  {c.accent === "conch" && <Conch className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-60 pointer-events-none" />}
                  {c.accent === "starfish" && <Starfish className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-60 pointer-events-none" />}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative h-3 flex items-center justify-center">
        <Boat className="hidden md:block absolute left-1/4 w-12 text-sea-400 opacity-45 pointer-events-none" />
        <StrawHat className="hidden md:block absolute right-1/4 w-10 text-sea-400 opacity-45 pointer-events-none rotate-6" />
        <Conch className="hidden lg:block absolute left-2/3 w-8 text-sea-500 opacity-45 pointer-events-none -rotate-12" />
      </div>

      {/* Main search form */}
      <section id="search-form" className="mb-10 scroll-mt-24 pt-2">
        <div className="text-center mb-4">
          <div className="text-xs uppercase tracking-widest text-sea-600 font-semibold">
            {t("search_eyebrow")}
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-sea-800 mt-1">
            {t("search_title")}
          </h2>
        </div>
        <SearchForm />
      </section>

      <section className="mt-10 mb-10">
        <TravelEssentials />
      </section>

      <PalmLeaf className="hidden lg:block fixed -bottom-20 -right-20 w-72 text-sea-200 opacity-60 rotate-45 pointer-events-none -z-10" />
      <Coral className="hidden lg:block fixed top-1/3 -left-10 w-40 text-sea-200 opacity-45 -rotate-6 pointer-events-none -z-10" />
    </div>
  );
}
