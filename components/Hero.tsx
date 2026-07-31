"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_PHOTOS } from "@/lib/heroPhotos";
import SearchForm from "./SearchForm";
import { PalmLeaf, Shell, Boat, StrawHat } from "./Decorations";

const ROTATE_MS = 7000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_PHOTOS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = HERO_PHOTOS[index];

  return (
    <section className="relative -mt-6 sm:-mt-8 mb-10 rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
      {/* Decorative palm leaf — top-right corner overlay */}
      <PalmLeaf className="absolute top-3 right-4 w-24 md:w-36 lg:w-44 text-white/50 rotate-[35deg] z-10 pointer-events-none" />
      {/* Straw hat — top-left */}
      <StrawHat className="hidden sm:block absolute top-5 left-4 w-20 md:w-28 text-white/55 -rotate-12 z-10 pointer-events-none" />
      {/* Sailboat — floating on the "horizon" area, right side */}
      <Boat className="hidden md:block absolute top-1/3 right-8 lg:right-16 w-24 lg:w-32 text-white/60 z-10 pointer-events-none" />
      {/* Shell — bottom-left, half-hidden */}
      <Shell className="absolute -bottom-3 -left-2 w-20 md:w-28 text-white/50 -rotate-12 z-10 pointer-events-none" />
      {/* Panoramic image container — 3:1 aspect ratio on desktop, gracefully falls back on mobile */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] w-full min-h-[380px]">
        {HERO_PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover transition-opacity duration-1000 ease-in-out"
            style={{
              objectPosition: photo.position,
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}

        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)",
          }}
        />

        {/* Centered content — headline + subhead */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 sm:pb-10 md:pb-14 px-4">
          <div className="w-full max-w-3xl text-center text-white">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight drop-shadow-lg">
              Find your next stay
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-lg drop-shadow-md opacity-95 px-2">
              Compare thousands of hotels worldwide and book the perfect room.
            </p>
          </div>
        </div>

        {/* Slide indicator dots — bottom center of image */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {HERO_PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search bar overlaps up into the image */}
      <div className="relative -mt-6 md:-mt-12 mx-3 sm:mx-4 md:mx-8 z-10">
        <SearchForm />
      </div>

      {/* Photo credit — updates as the slide rotates */}
      <div className="text-center text-xs text-slate-400 mt-3 transition-opacity duration-500">
        {current.caption} · {current.credit}
      </div>
    </section>
  );
}
