"use client";

import Link from "next/link";
import { useT } from "@/contexts/LanguageProvider";
import GuideCard from "@/components/GuideCard";
import type { GuideSummary } from "@/lib/guides";

/**
 * Homepage funnel fix (Sep 2026): GA4 showed the homepage bouncing at 42.6%
 * while individual guide pages bounced at 0-21% — visitors who reach a guide
 * stick around, but the homepage wasn't surfacing guide content, only external
 * Booking.com search CTAs. This section puts 3 real guides above the fold
 * (right after search) so first-time visitors have an obvious path into the
 * content that actually holds attention.
 */
export default function FeaturedGuides({ guides }: { guides: GuideSummary[] }) {
  const t = useT();
  if (guides.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="text-center mb-6">
        <div className="text-xs section-eyebrow mb-2">{t("featured_guides_eyebrow")}</div>
        <h2 className="font-display text-2xl md:text-4xl font-semibold text-sea-900 mt-1 leading-tight">
          {t("featured_guides_title")}
        </h2>
        <p className="text-slate-600 mt-2 max-w-xl mx-auto">{t("featured_guides_subtitle")}</p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-coral-gradient" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sea-700 hover:text-sea-900 transition-colors"
        >
          {t("featured_guides_cta")}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
