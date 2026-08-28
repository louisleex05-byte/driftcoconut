// Agoda Long Tail Search API client — server-side only.
// Docs: https://partners.agoda.com/ (Long Tail API section)

const AGODA_ENDPOINT =
  "https://affiliateapi7643.agoda.com/affiliateservice/lt_v1";

/**
 * Get a working "Book on Agoda" URL for a hotel.
 * - When we're using mock data (landingURL contains `cid=DEMO`), we fall back to
 *   Agoda's real search page for the hotel name — this guarantees the button
 *   never 404s while our real Agoda API is still pending approval.
 * - Once the real Agoda API is connected, hotel.landingURL becomes a genuine
 *   affiliate deep-link (with the real cid= tracking your site ID). No code
 *   change needed — this helper transparently forwards it.
 *
 * The AGODA_SITE_ID env var is appended as `cid=` to the search fallback so
 * that once your affiliate account is approved, clicks attribute retroactively.
 */
export function getAgodaBookingUrl(hotel: {
  hotelName: string;
  landingURL: string;
}): string {
  const isMock = hotel.landingURL.includes("cid=DEMO");
  if (!isMock) return hotel.landingURL;

  const query = encodeURIComponent(hotel.hotelName);
  const cid = process.env.NEXT_PUBLIC_AGODA_SITE_ID || process.env.AGODA_SITE_ID;
  const cidParam = cid ? `&cid=${cid}` : "";
  return `https://www.agoda.com/search?q=${query}${cidParam}`;
}

export type AgodaSearchParams = {
  cityId?: number;         // Agoda city id (e.g., Bangkok = 9395)
  hotelIds?: number[];     // Or search specific hotels
  checkIn: string;         // YYYY-MM-DD
  checkOut: string;        // YYYY-MM-DD
  adults?: number;         // default 2
  children?: number;       // default 0
  rooms?: number;          // default 1
  language?: string;       // default "en-us"
  currency?: string;       // default "USD"
};

export type AgodaHotel = {
  hotelId: number;
  hotelName: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  imageURL: string;
  dailyRate: number;
  crossedOutRate?: number;
  currency: string;
  landingURL: string;      // affiliate deep link — includes your siteid
  freeWifi?: boolean;
  freeBreakfast?: boolean;
};

type AgodaApiResponse = {
  results?: AgodaHotel[];
  status?: { error?: string };
};

export async function searchAgoda(
  params: AgodaSearchParams
): Promise<AgodaHotel[]> {
  // Mock mode — use before Agoda API approval or for local dev without credentials.
  if (process.env.AGODA_MOCK === "true") {
    const { MOCK_HOTELS } = await import("./mockHotels");
    // Small artificial delay to feel realistic
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_HOTELS;
  }

  const siteId = process.env.AGODA_SITE_ID;
  const apiKey = process.env.AGODA_API_KEY;

  if (!siteId || !apiKey) {
    throw new Error(
      "Missing AGODA_SITE_ID or AGODA_API_KEY in .env.local (or set AGODA_MOCK=true)"
    );
  }

  const body = {
    criteria: {
      additional: {
        currency: params.currency ?? "USD",
        language: params.language ?? "en-us",
        maxResult: 30,
        discountOnly: false,
        occupancy: {
          numberOfAdult: params.adults ?? 2,
          numberOfChildren: params.children ?? 0,
        },
      },
      checkInDate: params.checkIn,
      checkOutDate: params.checkOut,
      cityId: params.cityId,
      hotelId: params.hotelIds,
    },
  };

  const res = await fetch(AGODA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${siteId}:${apiKey}`,
    },
    body: JSON.stringify(body),
    // Cache for 15 minutes — rates change hourly, not per-second
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`Agoda API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as AgodaApiResponse;
  if (data.status?.error) throw new Error(data.status.error);
  return data.results ?? [];
}
