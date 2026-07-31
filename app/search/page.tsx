import { searchAgoda } from "@/lib/agoda";
import HotelCard from "@/components/HotelCard";
import Link from "next/link";

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

  let hotels: Awaited<ReturnType<typeof searchAgoda>> = [];
  let errorMsg: string | null = null;

  try {
    hotels = await searchAgoda({
      cityId: Number(sp.cityId),
      checkIn: sp.checkIn,
      checkOut: sp.checkOut,
      adults: Number(sp.adults ?? 2),
    });
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Search failed";
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-slate-500 hover:text-sea-700">
          ← New search
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {hotels.length} hotels · {sp.checkIn} → {sp.checkOut}
        </h1>
      </div>

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
