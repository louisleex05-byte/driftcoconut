"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { useT } from "@/contexts/LanguageProvider";

function tomorrow(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + 1 + offset);
  return d.toISOString().slice(0, 10);
}

export default function HeaderSearch() {
  const t = useT();
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim().toLowerCase();

    // Try to match input text to a known city
    const match = CITIES.find((c) => c.name.toLowerCase().includes(query));

    if (match && query.length > 1) {
      // Direct hit — go straight to results
      const params = new URLSearchParams({
        cityId: String(match.id),
        checkIn: tomorrow(0),
        checkOut: tomorrow(2),
        adults: "2",
      });
      router.push(`/search?${params.toString()}`);
    } else {
      // No match — scroll to the main search form on homepage
      if (window.location.pathname === "/") {
        document.getElementById("search-form")?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/#search-form");
      }
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4"
      role="search"
    >
      <div className="relative w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sea-500 pointer-events-none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("header_search_placeholder")}
          className="w-full pl-9 pr-3 py-2 rounded-full border border-sea-200 bg-white/80 text-sm placeholder:text-slate-400 focus:outline-none focus:border-sea-500 focus:bg-white transition-colors"
          aria-label={t("header_search_aria")}
        />
      </div>
    </form>
  );
}
