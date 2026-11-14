"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, dictionary, LOCALES, type Locale, type TranslationKey } from "@/lib/i18n";
import { TRAVEL_ESSENTIALS_LANG, TRAVEL_ESSENTIALS_PATHS } from "@/lib/travelEssentials";

const STORAGE_KEY = "driftcoconut.locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const pathname = usePathname();
  // The Essentials pages render their copy on the server. Keep shared UI and the
  // embedded trip planner in the route's language, even with an older saved choice.
  const essentialsLocale = LOCALES.find((locale) => TRAVEL_ESSENTIALS_PATHS[locale] === pathname);
  const locale = essentialsLocale ?? selectedLocale;

  // Load persisted choice on mount (client only — avoids hydration mismatch).
  // Routed Chinese and Thai guide URLs override a saved UI preference.
  useEffect(() => {
    try {
      // Route detection wins - a user landing on /zh/guides/bangkok wants Chinese
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      if (path.startsWith("/zh")) {
        setLocaleState("zh");
        return;
      }
      if (path.startsWith("/th")) {
        setLocaleState("th");
        return;
      }
      // Otherwise honour persisted preference
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (LOCALES as string[]).includes(saved) && saved !== "zh") {
        setLocaleState(saved as Locale);
      }
    } catch {
      // localStorage unavailable — silently fall back to default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = TRAVEL_ESSENTIALS_LANG[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      const bundle = dictionary[locale] ?? dictionary[DEFAULT_LOCALE];
      return bundle[key] ?? dictionary[DEFAULT_LOCALE][key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

/** Shortcut hook — returns just the `t` function. */
export function useT() {
  return useLanguage().t;
}
