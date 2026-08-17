"use client";

import { useLanguage } from "@/contexts/LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-full border border-sea-200 bg-white/70 text-[10px] sm:text-[11px] font-medium overflow-hidden flex-shrink-0"
      role="group"
      aria-label={t("lang_toggle_aria")}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 transition-colors ${
          locale === "en"
            ? "bg-sea-600 text-white"
            : "text-slate-600 hover:text-sea-700"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("th")}
        aria-pressed={locale === "th"}
        className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 transition-colors ${
          locale === "th"
            ? "bg-sea-600 text-white"
            : "text-slate-600 hover:text-sea-700"
        }`}
      >
        ไทย
      </button>
    </div>
  );
}
