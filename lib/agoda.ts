// Agoda Long Tail Search API client — server-side only.
// Docs: https://partners.agoda.com/ (Long Tail API section)

const AGODA_ENDPOINT =
  "https://affiliateapi7643.agoda.com/affiliateservice/lt_v1";

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
