"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageProvider";
import type { Locale } from "@/lib/i18n";

// Toggle between EN / TH / 中文.
// Chinese has real routed pages under /zh/... — clicking 中文 navigates there
// so users get the Chinese guide content, not just Chinese UI chrome.
// EN/TH stay on the same URL (they share content routes for now).
export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const pick = (next: Locale) => {
    setLocale(next);
    // Route swap for Chinese: /guides/bangkok  <->  /zh/guides/bangkok
    if (next === "zh" && pathname && !pathname.startsWith("/zh")) {
      router.push(`/zh${pathname === "/" ? "" : pathname}`);
    } else if (next !== "zh" && pathname?.startsWith("/zh")) {
      const stripped = pathname.replace(/^\/zh/, "") || "/";
      router.push(stripped);
    }
  };

  const btn = (val: Locale, label: string) => (
    <button
      key={val}
      type="button"
      onClick={() => pick(val)}
      aria-pressed={locale === val}
      className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 transition-colors ${
        locale === val ? "bg-sea-600 text-white" : "text-slate-600 hover:text-sea-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="inline-flex items-center rounded-full border border-sea-200 bg-white/70 text-[10px] sm:text-[11px] font-medium overflow-hidden flex-shrink-0"
      role="group"
      aria-label={t("lang_toggle_aria")}
    >
      {btn("en", "EN")}
      {btn("th", "ไทย")}
      {btn("zh", "中文")}
    </div>
  );
}
