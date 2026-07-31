import { NextRequest, NextResponse } from "next/server";
import { searchAgoda } from "@/lib/agoda";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const cityIdRaw = sp.get("cityId");
  const checkIn = sp.get("checkIn");
  const checkOut = sp.get("checkOut");

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: "checkIn and checkOut are required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  try {
    const hotels = await searchAgoda({
      cityId: cityIdRaw ? Number(cityIdRaw) : undefined,
      checkIn,
      checkOut,
      adults: Number(sp.get("adults") ?? 2),
      children: Number(sp.get("children") ?? 0),
      rooms: Number(sp.get("rooms") ?? 1),
      currency: sp.get("currency") ?? "USD",
    });

    return NextResponse.json({ hotels }, {
      headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=300" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
