"use client";

import Link from "next/link";
import { useT } from "@/contexts/LanguageProvider";
import { PalmLeaf } from "@/components/Decorations";

/**
 * Homepage callout that promotes the latest destination guide.
 * Ported from the PC-session GuideTipsBadge — sea-blue palette,
 * corner "GUIDE TIPS" pill, featured guide card, "See all guides" link.
 *
 * NOTE: The `/guides` route + Bangkok MDX still need to be scaffolded on this
 * instance of the repo. Until then, the "Read the guide" CTA links to
 * `/guides/bangkok` which will 404 locally; on the PC-side push, it will
 * resolve to the real content.
 */
export default function GuideTipsBadge({
  featuredSlug = "bangkok",
}: {
  featuredSlug?: string;
}) {
  const t = useT();
  return (
    <aside
      aria-label={t("guide_tips_pill")}
      className="relative bg-gradient-to-br from-sea-50 via-white to-sea-50 border border-sea-200 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden"
    >
      {/* Corner GUIDE TIPS pill */}
      <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest bg-sea-600 text-white font-semibold px-2 py-1 rounded-full shadow-sm">
        {t("guide_tips_pill")}
      </div>

      {/* Ambient palm leaf as background flourish */}
      <PalmLeaf className="absolute -bottom-6 -right-6 w-32 text-sea-200 opacity-50 rotate-12 pointer-events-none" />

      <div className="relative">
        <div className="text-[10px] uppercase tracking-widest text-sea-600 font-semibold mb-1">
          {t("guide_tips_eyebrow")}
        </div>

        <h3 className="font-display text-base sm:text-lg font-semibold text-sea-800 leading-tight">
          {t("guide_tips_featured_title")}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {t("guide_tips_featured_teaser")}
        </p>

        <Link
          href={`/guides/${featuredSlug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white bg-sea-600 hover:bg-sea-700 transition-colors px-4 py-2 rounded-lg"
        >
          {t("guide_tips_read_cta")}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>

        <div className="mt-4 pt-3 border-t border-sea-100">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1 text-xs font-medium text-sea-700 hover:text-sea-900 transition-colors"
          >
            {t("guide_tips_see_all")}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
