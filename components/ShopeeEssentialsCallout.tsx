"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";
import { TRAVEL_ESSENTIALS_PATHS } from "@/lib/travelEssentials";

export default function ShopeeEssentialsCallout() {
  const { locale, t } = useLanguage();

  return (
    <section
      aria-labelledby="shopee-essentials-heading"
      className="relative mb-10 overflow-hidden rounded-3xl border border-sea-100 bg-gradient-to-br from-sea-50 via-white to-sand-50 px-6 py-8 shadow-sm sm:px-10"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-coral-100/70 blur-3xl" />
      <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="section-eyebrow text-xs">{t("shop_essentials_eyebrow")}</p>
          <h2
            id="shopee-essentials-heading"
            className="mt-2 font-display text-2xl font-semibold leading-tight text-sea-900 md:text-4xl"
          >
            {t("shop_essentials_title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {t("shop_essentials_sub")}
          </p>
        </div>

        <Link
          href={TRAVEL_ESSENTIALS_PATHS[locale]}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sea-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-sea-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea-700"
        >
          <span aria-hidden="true">🧳</span>
          {t("shop_essentials_cta")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
