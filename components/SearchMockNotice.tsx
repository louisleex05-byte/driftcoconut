"use client";

import { useT } from "@/contexts/LanguageProvider";

/**
 * Small dismissible-style notice explaining that mock hotels are sample data.
 * Shown only when AGODA_MOCK=true is active on the server (passed as prop).
 */
export default function SearchMockNotice() {
  const t = useT();
  return (
    <div
      role="note"
      className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 text-xs sm:text-sm"
    >
      <span className="font-semibold">{t("search_mock_notice_title")}.</span>{" "}
      {t("search_mock_notice_body")}
    </div>
  );
}
