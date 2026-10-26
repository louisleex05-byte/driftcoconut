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
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-3 group min-w-0 flex-shrink"
        >
          <Logo className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 transition-transform group-hover:-rotate-6" />
          <span className="hidden min-w-0 truncate font-display text-xl font-semibold leading-none tracking-tight text-sea-700 sm:inline sm:text-2xl md:text-3xl">
            driftcoconut
          </span>
        </Link>

        <HeaderSearch />

        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 flex-shrink-0">
          <Link href="/#deals" className="hidden transition-colors hover:text-sea-600 sm:inline">
            {t("nav_deals")}
          </Link>
          <Link
            href="/travel-essentials"
            aria-label={t("nav_essentials")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-sea-50 hover:text-sea-700 sm:h-auto sm:w-auto sm:rounded-none sm:hover:bg-transparent"
          >
            <span aria-hidden="true" className="text-base sm:hidden">🧳</span>
            <span className="hidden sm:inline">{t("nav_essentials")}</span>
          </Link>
          <Link href="/about" className="hidden transition-colors hover:text-sea-600 sm:inline">
            {t("nav_about")}
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
