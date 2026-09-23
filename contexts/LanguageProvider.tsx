"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, dictionary, LOCALES, type Locale, type TranslationKey } from "@/lib/i18n";

const STORAGE_KEY = "driftcoconut.locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Load persisted choice on mount (client only — avoids hydration mismatch).
  // Also detect route-based locale: /zh/... URLs force locale=zh regardless of
  // localStorage. This makes Xiaohongshu / Weibo deep-links open in Chinese UI
  // even when the user has no prior visit history.
  useEffect(() => {
    try {
      // Route detection wins - a user landing on /zh/guides/bangkok wants Chinese
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      if (path.startsWith("/zh")) {
        setLocaleState("zh");
        document.documentElement.lang = "zh-CN";
        return;
      }
      // Otherwise honour persisted preference
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (LOCALES as string[]).includes(saved) && saved !== "zh") {
        setLocaleState(saved as Locale);
        document.documentElement.lang = saved;
      }
    } catch {
      // localStorage unavailable — silently fall back to default
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
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
