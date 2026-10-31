"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HERO_PHOTOS } from "@/lib/heroPhotos";
import { useLanguage } from "@/contexts/LanguageProvider";

const ROTATE_MS = 3000;

export default function Hero() {
  const { locale, t } = useLanguage();
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
      {/* Mobile hero is 20% taller; desktop keeps its panoramic proportions. */}
      <div className="relative aspect-[10/9] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] w-full min-h-[456px] sm:min-h-[380px]">
        {HERO_PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            // Bypass Vercel's image optimizer for hero photos.
            // Rationale: 22 rotating slides x every deploy = quota hits on the free
            // tier -> intermittent 500s / blanks. Files are already reasonable size
            // (200-1200 KB), so serving them raw from the CDN is cheaper AND more
            // reliable than paying quota to convert them to WebP on the fly.
            unoptimized
            loading={i === 0 ? "eager" : "lazy"}
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
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight drop-shadow-lg text-balance">
              {t("hero_title")}
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-lg drop-shadow-md opacity-95 px-2">
              {t("hero_subtitle")}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={locale === "zh" ? "/zh/guides" : "/guides"}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-sea-800 shadow-md transition-colors hover:bg-sea-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("hero_guides_cta")}
              </Link>
              <a
                href="#search-form"
                className="rounded-full border border-white/80 bg-slate-900/35 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("hero_hotels_cta")}
              </a>
            </div>
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

      {/* Destination caption — bottom-right, no photographer/source credit */}
      <div className="absolute bottom-2 right-3 text-[10px] sm:text-xs text-white/80 transition-opacity duration-500 z-10 drop-shadow">
        {current.caption}
      </div>
    </section>
  );
}
