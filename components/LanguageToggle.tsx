"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageProvider";
import type { Locale } from "@/lib/i18n";

// Paths that have a real /zh/... twin: /, /about, /privacy, /terms, /guides, /guides/<slug>.
// Add a path here when you create its /zh page.
const HAS_ZH_ROUTE = /^\/(about|privacy|terms|guides(\/[^/]+)?)?\/?$/;
const THAI_GUIDES = new Set(["khao-yai", "khao-kho", "chiangrai", "nan", "mae-hong-son"]);

// Toggle between EN / TH / 中文.
// Chinese has real routed pages under /zh/... — clicking 中文 navigates there
// so users get the Chinese guide content, not just Chinese UI chrome.
// The five translated Thai guides have real /th/guides/... pages.
export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const pick = (next: Locale) => {
    setLocale(next);
    const base = pathname?.replace(/^\/(zh|th)(?=\/|$)/, "") || "/";
    const thaiGuide = base.match(/^\/guides\/([^/]+)\/?$/)?.[1];
    if (next === "th" && (base === "/guides" || (thaiGuide && THAI_GUIDES.has(thaiGuide)))) {
      router.push(`/th${base}`);
    } else if (next === "zh" && HAS_ZH_ROUTE.test(base)) {
      router.push(`/zh${base === "/" ? "" : base}`);
    } else if (pathname?.startsWith("/zh") || pathname?.startsWith("/th")) {
      router.push(base);
    }
  };

  const btn = (val: Locale, label: string) => (
    <button
      key={val}
      type="button"
      onClick={() => pick(val)}
      aria-pressed={locale === val}
      className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 transition-all ${
        locale === val
          ? "bg-coral-gradient text-white font-semibold shadow-sm"
          : "text-slate-600 hover:text-coral-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="inline-flex items-center rounded-full border border-coral-200 bg-white/80 text-[10px] sm:text-[11px] font-medium overflow-hidden flex-shrink-0 shadow-sm"
      role="group"
      aria-label={t("lang_toggle_aria")}
    >
      {btn("en", "EN")}
      {btn("th", "ไทย")}
      {btn("zh", "中文")}
    </div>
  );
}
