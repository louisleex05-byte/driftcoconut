"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CITIES } from "@/lib/cities";

function tomorrow(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + 1 + offset);
  return d.toISOString().slice(0, 10);
}

export default function SearchForm() {
  const router = useRouter();
  const [cityId, setCityId] = useState<number>(CITIES[0].id);
  const [checkIn, setCheckIn] = useState(tomorrow(0));
  const [checkOut, setCheckOut] = useState(tomorrow(2));
  const [adults, setAdults] = useState(2);

  // Group cities by region for the dropdown
  const grouped = useMemo(() => {
    const g: Record<string, typeof CITIES> = {};
    for (const c of CITIES) {
      (g[c.region] ??= []).push(c);
    }
    return g;
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({
      cityId: String(cityId),
      checkIn,
      checkOut,
      adults: String(adults),
    });
    router.push(`/search?${q.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-5 gap-3"
    >
      <label className="md:col-span-2">
        <div className="text-xs font-medium text-slate-600 mb-1">Destination</div>
        <select
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
          value={cityId}
          onChange={(e) => setCityId(Number(e.target.value))}
        >
          {Object.entries(grouped).map(([region, cities]) => (
            <optgroup key={region} label={region}>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label>
        <div className="text-xs font-medium text-slate-600 mb-1">Check-in</div>
        <input
          type="date"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </label>
      <label>
        <div className="text-xs font-medium text-slate-600 mb-1">Check-out</div>
        <input
          type="date"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </label>
      <label>
        <div className="text-xs font-medium text-slate-600 mb-1">Guests</div>
        <input
          type="number"
          min={1}
          max={10}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        />
      </label>
      <div className="md:col-span-5">
        <button
          type="submit"
          className="w-full md:w-auto bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 rounded-lg"
        >
          Search hotels
        </button>
      </div>
    </form>
  );
}
