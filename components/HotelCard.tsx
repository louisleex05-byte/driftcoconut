import Image from "next/image";
import Link from "next/link";
import type { AgodaHotel } from "@/lib/agoda";

export default function HotelCard({ hotel }: { hotel: AgodaHotel }) {
  return (
    <Link
      href={`/hotel/${hotel.hotelId}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {hotel.imageURL ? (
          <Image
            src={hotel.imageURL}
            alt={hotel.hotelName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
          {"★".repeat(Math.round(hotel.starRating))}
        </div>
        <h3 className="font-semibold line-clamp-2 group-hover:text-brand">
          {hotel.hotelName}
        </h3>
        <div className="mt-1 text-xs text-slate-500">
          {hotel.reviewScore ? `${hotel.reviewScore.toFixed(1)} · ${hotel.reviewCount} reviews` : "No reviews yet"}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {hotel.crossedOutRate && hotel.crossedOutRate > hotel.dailyRate ? (
            <span className="text-xs text-slate-400 line-through">
              {hotel.currency} {Math.round(hotel.crossedOutRate)}
            </span>
          ) : null}
          <span className="text-lg font-bold text-brand">
            {hotel.currency} {Math.round(hotel.dailyRate)}
          </span>
          <span className="text-xs text-slate-500">/ night</span>
        </div>
      </div>
    </Link>
  );
}
