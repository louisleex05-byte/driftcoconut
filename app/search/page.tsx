import { searchAgoda } from "@/lib/agoda";
import HotelCard from "@/components/HotelCard";
import Link from "next/link";
import { PalmLeaf, Conch } from "@/components/Decorations";
import { CITIES } from "@/lib/cities";
import SearchBookingCard from "@/components/SearchBookingCard";
import SearchMockNotice from "@/components/SearchMockNotice";

type SearchParams = {
  cityId?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  if (!sp.cityId || !sp.checkIn || !sp.checkOut) {
    return (
      <div className="text-center py-16">
        <p>Missing search parameters.</p>
        <Link href="/" className="text-sea-700 underline">Go back</Link>
      </div>
    );
  }

  const cityIdNum = Number(sp.cityId);
  const cityMatch = CITIES.find((c) => c.id === cityIdNum);
  const cityName = cityMatch?.name ?? "your destination";
  const isMock = process.env.AGODA_MOCK === "true";

  let hotels: Awaited<ReturnType<typeof searchAgoda>> = [];
  let errorMsg: string | null = null;

  try {
    hotels = await searchAgoda({
      cityId: cityIdNum,
      checkIn: sp.checkIn,
      checkOut: sp.checkOut,
      adults: Number(sp.adults ?? 2),
    });
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Search failed";
  }

  return (
    <div className="space-y-6 relative">
      {/* Ambient corner accents on results page */}
      <PalmLeaf className="hidden lg:block absolute -top-4 -right-8 w-24 text-sea-200 opacity-55 rotate-45 pointer-events-none" />
      <Conch className="hidden lg:block fixed bottom-24 left-4 w-14 text-sea-300 opacity-45 pointer-events-none -z-10" />

      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-sea-700">
          ← New search
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {hotels.length} hotels · {cityName} · {sp.checkIn} → {sp.checkOut}
        </h1>
      </div>

      {/* Booking.com CJ — city-aware "real inventory" CTA (top of results) */}
      <SearchBookingCard cityName={cityName} />

      {/* Mock-mode notice — only shown when we're serving sample listings */}
      {isMock && <SearchMockNotice />}

      {errorMsg ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <div className="font-semibold">Search error</div>
          <div className="text-sm mt-1">{errorMsg}</div>
          <div className="text-xs mt-2 text-red-700">
            Make sure AGODA_SITE_ID and AGODA_API_KEY are set in .env.local
          </div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          No hotels found for these dates.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map((h) => (
            <HotelCard key={h.hotelId} hotel={h} />
          ))}
        </div>
      )}
    </div>
  );
}
