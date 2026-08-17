"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_PHOTOS } from "@/lib/heroPhotos";
import { useT } from "@/contexts/LanguageProvider";

const ROTATE_MS = 3000;

export default function Hero() {
  const t = useT();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_PHOTOS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = HERO_PHOTOS[index];

  return (
    <section className="relative -mt-6 sm:-mt-8 rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
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
              {t("hero_title")}
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-lg drop-shadow-md opacity-95 px-2">
              {t("hero_subtitle")}
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

      {/* Photo credit — sits inside hero, subtle bottom-right */}
      <div className="absolute bottom-2 right-3 text-[10px] sm:text-xs text-white/80 transition-opacity duration-500 z-10 drop-shadow">
        {current.caption} · {current.credit}
      </div>
    </section>
  );
}
