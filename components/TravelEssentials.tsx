"use client";

import { AFFILIATE_LINKS } from "@/lib/affiliateLinks";
import { useT } from "@/contexts/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n";

type Essential = {
  key: keyof typeof AFFILIATE_LINKS;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  emoji: string;
  color: string;
  bg: string;
  hot?: boolean;
};

// Row 1 — core essentials
const ESSENTIALS_ROW1: Essential[] = [
  { key: "klook",          titleKey: "card_klook_title",          subtitleKey: "card_klook_sub",          emoji: "🎟️", color: "text-amber-700",   bg: "bg-amber-50" },
  { key: "welcomePickups", titleKey: "card_welcomepickups_title", subtitleKey: "card_welcomepickups_sub", emoji: "🚕", color: "text-sea-700",     bg: "bg-sea-50" },
  { key: "yesim",          titleKey: "card_yesim_title",          subtitleKey: "card_yesim_sub",          emoji: "📶", color: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "kiwi",           titleKey: "card_kiwi_title",           subtitleKey: "card_kiwi_sub",           emoji: "✈️", color: "text-slate-700",   bg: "bg-slate-100" },
];

// Row 2 — expansion partners
const ESSENTIALS_ROW2: Essential[] = [
  { key: "aviasales", titleKey: "card_aviasales_title", subtitleKey: "card_aviasales_sub", emoji: "🛫", color: "text-rose-700",   bg: "bg-rose-50", hot: true },
  { key: "ekta",      titleKey: "card_ekta_title",      subtitleKey: "card_ekta_sub",      emoji: "🛡️", color: "text-teal-700",   bg: "bg-teal-50" },
  { key: "airhelp",   titleKey: "card_airhelp_title",   subtitleKey: "card_airhelp_sub",   emoji: "💸", color: "text-orange-700", bg: "bg-orange-50" },
];

function EssentialCard({ e }: { e: Essential }) {
  const t = useT();
  return (
    <a
      href={AFFILIATE_LINKS[e.key]}
      target="_blank"
      rel="noopener sponsored"
      className="group bg-white/80 backdrop-blur border border-sea-100 rounded-lg p-2.5 hover:border-sea-300 hover:shadow-sm transition-all flex flex-col relative"
    >
      {e.hot && (
        <div className="absolute top-1 right-1 text-[8px] uppercase tracking-wider text-rose-700 font-semibold bg-rose-50 px-1.5 py-[1px] rounded-full">
          {t("card_hot_badge")}
        </div>
      )}
      <div className={`w-8 h-8 rounded-full ${e.bg} flex items-center justify-center text-base mb-1.5 flex-shrink-0`}>
        {e.emoji}
      </div>
      <h3 className={`font-display text-[13px] leading-tight font-semibold ${e.color} group-hover:text-sea-700 transition-colors`}>
        {t(e.titleKey)}
      </h3>
      <p className="text-[11px] leading-snug text-slate-600 mt-0.5">{t(e.subtitleKey)}</p>
      <div className="mt-1.5 text-[11px] font-medium text-sea-700 inline-flex items-center gap-1">
        {t("essentials_book_now")}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

function AlternativeCard({
  href,
  emoji,
  bg,
  titleKey,
  subtitleKey,
  titleColor,
}: {
  href: string;
  emoji: string;
  bg: string;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  titleColor: string;
}) {
  const t = useT();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored"
      className="group bg-white/80 backdrop-blur border border-sea-100 rounded-lg p-2.5 hover:border-sea-300 hover:shadow-sm transition-all flex flex-col relative"
    >
      <div className="absolute top-1 right-1 text-[8px] uppercase tracking-wider text-sea-600 font-semibold bg-sea-50 px-1.5 py-[1px] rounded-full">
        {t("card_alt_badge")}
      </div>
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-base mb-1.5 flex-shrink-0`}>
        {emoji}
      </div>
      <h3 className={`font-display text-[13px] leading-tight font-semibold ${titleColor} group-hover:text-sea-700 transition-colors`}>
        {t(titleKey)}
      </h3>
      <p className="text-[11px] leading-snug text-slate-600 mt-0.5">{t(subtitleKey)}</p>
      <div className="mt-1.5 text-[11px] font-medium text-sea-700 inline-flex items-center gap-1">
        {t("essentials_book_now")}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

export default function TravelEssentials({
  compact = false,
  headingKey = "essentials_default_heading",
  subheadingKey = "essentials_default_sub",
}: {
  compact?: boolean;
  headingKey?: TranslationKey;
  subheadingKey?: TranslationKey;
}) {
  const t = useT();
  return (
    <section aria-label={t("essentials_eyebrow")} className="relative">
      {!compact && (
        <div className="text-center mb-4">
          <div className="text-[10px] uppercase tracking-widest text-sea-600 font-semibold">
            {t("essentials_eyebrow")}
          </div>
          <h2 className="font-display text-xl md:text-2xl font-semibold text-sea-800 mt-0.5">
            {t(headingKey)}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
            {t(subheadingKey)}
          </p>
        </div>
      )}

      {/* Row 1 */}
      <div className={`grid gap-2 sm:gap-2.5 items-start ${compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {ESSENTIALS_ROW1.map((e) => (
          <div key={e.key} className="flex flex-col gap-2">
            <EssentialCard e={e} />

            {/* Tiqets stacked under Klook */}
            {e.key === "klook" && (
              <AlternativeCard
                href={AFFILIATE_LINKS.tiqets}
                emoji="🎫"
                bg="bg-fuchsia-50"
                titleKey="card_tiqets_title"
                subtitleKey="card_tiqets_sub"
                titleColor="text-fuchsia-700"
              />
            )}

            {/* Drimsim + Airalo stacked under Yesim */}
            {e.key === "yesim" && (
              <>
                <AlternativeCard
                  href={AFFILIATE_LINKS.drimsim}
                  emoji="📱"
                  bg="bg-sky-50"
                  titleKey="card_drimsim_title"
                  subtitleKey="card_drimsim_sub"
                  titleColor="text-sky-700"
                />
                <AlternativeCard
                  href={AFFILIATE_LINKS.airalo}
                  emoji="🌐"
                  bg="bg-indigo-50"
                  titleKey="card_airalo_title"
                  subtitleKey="card_airalo_sub"
                  titleColor="text-indigo-700"
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className={`mt-2 sm:mt-2.5 grid gap-2 sm:gap-2.5 items-start ${compact ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {ESSENTIALS_ROW2.map((e) => (
          <EssentialCard key={e.key} e={e} />
        ))}
      </div>

      <p className="text-[9px] text-slate-400 mt-3 text-center italic">
        {t("essentials_disclosure")}
      </p>
    </section>
  );
}
