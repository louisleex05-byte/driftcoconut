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
          <Logo className="w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 transition-transform group-hover:-rotate-6" />
          <span className="font-display text-base sm:text-2xl md:text-3xl font-semibold tracking-tight text-sea-700 leading-none truncate min-w-0">
            driftcoconut
          </span>
        </Link>

        <HeaderSearch />

        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 flex-shrink-0">
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
