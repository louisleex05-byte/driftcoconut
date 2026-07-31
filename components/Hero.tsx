import Image from "next/image";
import SearchForm from "./SearchForm";

export default function Hero() {
  return (
    <section className="relative -mt-8 mb-10 rounded-b-3xl overflow-hidden">
      {/* Panoramic image container — 3:1 aspect ratio on desktop, 4:3 on mobile */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] w-full min-h-[380px]">
        <Image
          src="/hero/bali-sanur.jpg"
          alt="Traditional jukung fishing boat at sunrise on Sanur Beach, Bali"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          // Off-center crop: boat sits on the left third, right two-thirds clean for text
          style={{ objectPosition: "left center" }}
        />

        {/* Dark gradient overlay at the bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)",
          }}
        />

        {/* Centered content — headline, subhead, search bar sit on right two-thirds */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:pb-14 px-4">
          <div className="w-full max-w-3xl text-center text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg">
              Find your next stay
            </h1>
            <p className="mt-3 text-sm md:text-lg drop-shadow-md opacity-95">
              Compare thousands of hotels worldwide and book the perfect room.
            </p>
          </div>
        </div>
      </div>

      {/* Search bar floats below the image on desktop, overlaps upward */}
      <div className="relative -mt-8 md:-mt-12 mx-4 md:mx-8 z-10">
        <SearchForm />
      </div>

      {/* Photo credit */}
      <div className="text-center text-xs text-slate-400 mt-3">
        Sanur Beach, Bali · Photo: Wande Mokkori / Pixabay
      </div>
    </section>
  );
}
