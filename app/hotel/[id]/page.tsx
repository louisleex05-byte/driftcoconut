import { MOCK_HOTELS, getHotelDetail } from "@/lib/mockHotels";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PalmLeaf, Shell } from "@/components/Decorations";

type Params = { id: string };

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const hotelId = Number(id);
  const hotel = MOCK_HOTELS.find((h) => h.hotelId === hotelId);
  if (!hotel) notFound();

  const detail = getHotelDetail(hotelId);

  return (
    <div className="space-y-8 relative">
      {/* Corner accents */}
      <PalmLeaf className="hidden lg:block fixed top-24 -right-8 w-32 text-sea-200 opacity-50 rotate-12 pointer-events-none -z-10" />
      <Shell className="hidden lg:block fixed bottom-8 left-4 w-14 text-sea-300 opacity-50 pointer-events-none -z-10" />

      <Link href="/" className="text-sm text-slate-500 hover:text-sea-700">
        ← Back to search
      </Link>

      {/* Photo gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
        <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto bg-slate-100">
          <Image
            src={detail.photos[0]}
            alt={hotel.hotelName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        {detail.photos.slice(1, 5).map((photo, i) => (
          <div key={i} className="relative aspect-[4/3] bg-slate-100">
            <Image
              src={photo}
              alt={`${hotel.hotelName} photo ${i + 2}`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Header info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-1 text-amber-500 text-sm">
              {"★".repeat(Math.round(hotel.starRating))}
            </div>
            <h1 className="text-3xl font-bold mt-1">{hotel.hotelName}</h1>
            <p className="text-slate-500 text-sm mt-1">{detail.address}</p>
            {hotel.reviewScore ? (
              <div className="mt-3 inline-flex items-center gap-2 bg-sea-600 text-white rounded-lg px-3 py-1 text-sm font-semibold">
                {hotel.reviewScore.toFixed(1)}
                <span className="font-normal opacity-90">
                  · {hotel.reviewCount} reviews
                </span>
              </div>
            ) : null}
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-2">About this hotel</h2>
            <p className="text-slate-600 leading-relaxed">{detail.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              {detail.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="text-sea-700">✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Available rooms</h2>
            <div className="space-y-3">
              {detail.rooms.map((room) => (
                <div
                  key={room.name}
                  className="bg-white border border-sea-100 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {room.sqm} m² · {room.bed}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-sea-700">
                      {hotel.currency} {room.price}
                    </div>
                    <div className="text-xs text-slate-500">/ night</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky book box */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4 bg-white border border-sea-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-baseline gap-2">
              {hotel.crossedOutRate && hotel.crossedOutRate > hotel.dailyRate ? (
                <span className="text-sm text-slate-400 line-through">
                  {hotel.currency} {Math.round(hotel.crossedOutRate)}
                </span>
              ) : null}
              <span className="text-2xl font-bold text-sea-700">
                {hotel.currency} {Math.round(hotel.dailyRate)}
              </span>
              <span className="text-sm text-slate-500">/ night</span>
            </div>
            <a
              href={hotel.landingURL}
              target="_blank"
              rel="noopener sponsored"
              className="mt-4 block w-full bg-sea-600 hover:bg-sea-700 text-white text-center font-semibold py-3 rounded-lg"
            >
              Book on Agoda
            </a>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Secure booking · Free cancellation on most rooms
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
