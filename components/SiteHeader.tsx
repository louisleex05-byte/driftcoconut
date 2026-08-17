"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import HeaderSearch from "@/components/HeaderSearch";
import LanguageToggle from "@/components/LanguageToggle";
import { useT } from "@/contexts/LanguageProvider";

export default function SiteHeader() {
  const t = useT();
  return (
    <header className="bg-white/70 backdrop-blur border-b border-sea-100 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink"
        >
          <Logo className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 transition-transform group-hover:-rotate-6" />
          <span className="flex flex-col min-w-0 leading-none">
            <span className="font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-sea-700 truncate">
              driftcoconut
            </span>
            <span
              className="font-display text-[10px] sm:text-[11px] font-medium tracking-wide text-emerald-600 mt-0.5 truncate animate-drift"
              lang="th"
              aria-label="Drift Coconut in Thai"
            >
              มะพร้าวลอยน้ำ <span className="text-emerald-500/70">(Drift Coconut)</span>
            </span>
          </span>
        </Link>

        <HeaderSearch />

        <nav className="flex items-center gap-3 sm:gap-4 text-sm text-slate-600 flex-shrink-0">
          <a
            href="/#search-form"
            className="md:hidden flex items-center gap-1 hover:text-sea-600 transition-colors"
            aria-label={t("nav_search_aria")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </a>
          <Link href="/#deals" className="hover:text-sea-600 transition-colors">
            {t("nav_deals")}
          </Link>
          <Link href="/about" className="hover:text-sea-600 transition-colors">
            {t("nav_about")}
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
