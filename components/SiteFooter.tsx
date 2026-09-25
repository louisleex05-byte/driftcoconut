"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { Wave, Shell, Coral, Conch, Starfish } from "@/components/Decorations";
import { useT } from "@/contexts/LanguageProvider";
import BookingImpressionPixel from "@/components/BookingImpressionPixel";

export default function SiteFooter() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-16 border-t border-sea-100 py-10 bg-white/50 overflow-hidden">
      <Wave className="absolute top-0 left-0 w-full h-6 text-sea-300 opacity-80 pointer-events-none" />
      <Coral className="hidden md:block absolute bottom-2 left-4 w-16 text-sea-400 opacity-50 pointer-events-none" />
      <Conch className="hidden md:block absolute bottom-6 right-24 w-12 text-sea-500 opacity-45 pointer-events-none -rotate-12" />
      <Shell className="absolute bottom-4 right-6 w-14 md:w-20 text-sea-400 opacity-55 pointer-events-none" />
      <Starfish className="hidden sm:block absolute top-8 right-1/3 w-10 text-sand-100 opacity-70 pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm relative">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Logo className="w-9 h-9" />
            <span className="font-display text-lg font-semibold text-sea-700">driftcoconut</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">{t("footer_tagline")}</p>
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-2">{t("footer_col_company")}</div>
          <ul className="space-y-1.5 text-slate-500">
            <li><Link href="/about" className="hover:text-sea-600 transition-colors">{t("nav_about")}</Link></li>
            <li><a href="mailto:hello@driftcoconut.com" className="hover:text-sea-600 transition-colors">{t("footer_link_contact")}</a></li>
            <li><a href="https://www.pinterest.com/Driftcoconut/" target="_blank" rel="noopener noreferrer" className="hover:text-sea-600 transition-colors">Pinterest</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-2">{t("footer_col_legal")}</div>
          <ul className="space-y-1.5 text-slate-500">
            <li><Link href="/privacy" className="hover:text-sea-600 transition-colors">{t("footer_link_privacy")}</Link></li>
            <li><Link href="/terms" className="hover:text-sea-600 transition-colors">{t("footer_link_terms")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-2">{t("footer_col_partners")}</div>
          {/*
            Partner list must reflect ONLY active affiliate relationships used on the site.
            Currently active:
              - Booking.com (CJ, approved 14-May-2026, 4% lead) - hero Search + guide "Where to stay"
              - Klook (Travelpayouts) - guide "Things to do" tour bookings
              - Airalo (Travelpayouts) - guide "Getting around" eSIM
              - Welcome Pickups (Travelpayouts) - guide "Getting around" airport transfers
            Removed to match honest positioning: Expedia, Hotels.com, Viator, Tripadvisor, Aviasales.
          */}
          <ul className="space-y-1.5 text-slate-500 text-xs">
            <li>Booking.com</li>
            <li>MakeMyTrip · Goibibo</li>
            <li>Klook · Airalo</li>
            <li>Welcome Pickups</li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 mt-8 pt-6 border-t border-sea-100 text-xs text-slate-400 text-center space-y-2">
        <p className="max-w-3xl mx-auto text-[11px] leading-relaxed">
          {t("footer_ftc_disclosure")}
        </p>
        <p>© {year} driftcoconut. {t("footer_copyright")}</p>
      </div>

      {/* CJ impression pixel — required for Booking.com EPC reconciliation. */}
      <BookingImpressionPixel />
    </footer>
  );
}
