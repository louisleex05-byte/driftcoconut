import { redirect } from "next/navigation";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { bookingCJSearchWithParams, bookingCJSearch } from "@/lib/booking";

type SearchParams = {
  cityId?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
};

/**
 * /search route now server-redirects to Booking.com via our CJ tracker.
 * No more sample listings page - users go straight to live Booking.com results
 * for their exact destination + dates + guests. Any legacy bookmark or shared
 * URL still routes correctly. Commission attribution stays intact via the
 * publisher-ID-wrapped URL.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // Malformed URL - fall back to homepage rather than showing an empty page
  if (!sp.cityId) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Missing destination.</p>
        <Link href="/" className="text-sea-700 underline mt-4 inline-block">
          Start a new search
        </Link>
      </div>
    );
  }

  const cityIdNum = Number(sp.cityId);
  const cityMatch = CITIES.find((c) => c.id === cityIdNum);
  const cityName = cityMatch?.name ?? "Thailand";

  // If dates were provided, forward them; otherwise send a plain destination
  // search so Booking.com prompts the user for dates on the destination page.
  const href = sp.checkIn && sp.checkOut
    ? bookingCJSearchWithParams({
        destination: cityName,
        checkIn: sp.checkIn,
        checkOut: sp.checkOut,
        adults: Number(sp.adults ?? 2),
      })
    : bookingCJSearch(cityName);

  redirect(href);
}
