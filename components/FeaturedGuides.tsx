"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";
import GuideCard from "@/components/GuideCard";
import type { GuideSummary } from "@/lib/guides";

/**
 * Homepage funnel fix (Sep 2026): GA4 showed the homepage bouncing at 42.6%
 * while individual guide pages bounced at 0-21% — visitors who reach a guide
 * stick around, but the homepage wasn't surfacing guide content, only external
 * Booking.com search CTAs. This section puts 3 real guides above the fold
 * (right after search) so first-time visitors have an obvious path into the
 * content that actually holds attention.
 *
 * Locale-aware: "/" serves EN/TH/ZH from one URL (the toggle switches UI copy
 * client-side, it doesn't route to /zh). Without this, toggling to Chinese
 * left the guide cards themselves stuck in English — this picks the matching
 * locale's guide data and points hrefs at /zh/guides/... when appropriate,
 * same pattern GuideTipsBadge already uses. Thai has no translated guides yet,
 * so th falls through to the English set/links, matching guide pages sitewide.
 */
export default function FeaturedGuides({
  guidesEn,
  guidesZh,
}: {
  guidesEn: GuideSummary[];
  guidesZh: GuideSummary[];
}) {
  const { locale, t } = useLanguage();
  const isZh = locale === "zh";
  const guides = isZh ? guidesZh : guidesEn;
  const hrefPrefix = isZh ? "/zh" : "";
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
          <GuideCard key={g.slug} guide={g} hrefPrefix={hrefPrefix} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href={`${hrefPrefix}/guides`}
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
