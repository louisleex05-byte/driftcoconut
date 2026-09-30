"use client";

// Homepage eSIM strip: Airalo's search box, shown by default between the hotel search
// and "Where to drift next". The widget script is lazy-loaded when the strip is about
// to scroll into view, so it costs nothing on first paint.
//
// Widget = Travelpayouts embed for Airalo (campaign 541, promo 8588). Same source as
// the "Search eSIMs" tab in TripPlanner (which is hidden on the homepage to avoid a duplicate).

import TpWidget from "@/components/TpWidget";
import { useLanguage } from "@/contexts/LanguageProvider";

const SRC = (locale: string) =>
  `https://tpemb.com/content?trs=561168&shmarker=763258&locale=${locale}&powered_by=true&color_button=%235080c5&color_focused=%23f2685f&secondary=%23FFFFFF&dark=%2311100f&light=%23FFFFFF&special=%23C4C4C4&border_radius=5&plain=false&no_labels=true&promo_id=8588&campaign_id=541`;

export default function EsimStrip() {
  const { locale, t } = useLanguage();
  const widgetLocale = locale === "th" ? "th" : "en";

  return (
    <section aria-label={t("home_esim_title")} className="mb-8 rounded-2xl border border-sea-100 bg-white/70 p-4 sm:p-5">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-widest text-sea-600 font-semibold">
          {t("home_esim_eyebrow")}
        </div>
        <h2 className="font-display text-lg md:text-xl font-semibold text-sea-800 mt-0.5">
          {t("home_esim_title")}
        </h2>
        <p className="text-xs text-slate-600 mt-1">{t("home_esim_sub")}</p>
      </div>
      <div className="mt-3 max-w-xl mx-auto">
        <TpWidget key={widgetLocale} src={SRC(widgetLocale)} minHeight={150} lazy />
      </div>
    </section>
  );
}
