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
      <div className="max-w-screen-2xl mx-auto px-2 py-2 sm:px-4 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 sm:gap-3">
        <div className="flex w-full items-center justify-between gap-2 sm:contents">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink"
          >
            <Logo className="w-14 h-14 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 transition-transform group-hover:-rotate-6" />
            <span className="min-w-0 truncate font-display text-lg min-[360px]:text-xl font-semibold leading-none tracking-tight text-sea-700 sm:text-2xl md:text-3xl">
              driftcoconut
            </span>
          </Link>
          <div className="sm:hidden"><LanguageToggle /></div>
        </div>

        <HeaderSearch />

        <nav className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1 sm:gap-4 text-xs sm:text-sm text-slate-600 flex-shrink-0">
          <Link href="/#deals" className="whitespace-nowrap transition-colors hover:text-sea-600">
            {t("nav_deals")}
          </Link>
          <Link
            href="/travel-essentials"
            className="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-sea-600"
          >
            <span aria-hidden="true" className="text-base sm:hidden">🧳</span>
            <span>{t("nav_essentials")}</span>
          </Link>
          <Link href="/about" className="whitespace-nowrap transition-colors hover:text-sea-600">
            {t("nav_about")}
          </Link>
          <div className="hidden sm:block"><LanguageToggle /></div>
        </nav>
      </div>
    </header>
  );
}
