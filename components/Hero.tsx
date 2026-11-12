"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HERO_PHOTOS } from "@/lib/heroPhotos";
import { useLanguage } from "@/contexts/LanguageProvider";

const ROTATE_MS = 3000;

export default function Hero() {
  const { locale, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const showSlide = (nextIndex: number) => {
    if (nextIndex === index) return;
    setPreviousIndex(index);
    setImageLoaded(false);
    setIndex(nextIndex);
  };

  useEffect(() => {
    if (imageRef.current?.complete) setImageLoaded(true);
  }, [index]);

  useEffect(() => {
    const id = setInterval(() => {
      if (imageLoaded) showSlide((index + 1) % HERO_PHOTOS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [imageLoaded, index]);

  useEffect(() => {
    if (previousIndex === null || !imageLoaded) return;
    const id = setTimeout(() => setPreviousIndex(null), 1000);
    return () => clearTimeout(id);
  }, [imageLoaded, previousIndex]);

  const current = HERO_PHOTOS[index];
  const currentBase = current.src.replace(/\.jpg$/, "");

  return (
    <section className="relative -mt-6 sm:-mt-8 rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
      {/* Show more of each rotating photo on wide screens while keeping mobile proportions. */}
      <div className="relative aspect-[3/4] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[12/5] w-full min-h-[550px] sm:min-h-[380px] lg:min-h-[520px]">
        {previousIndex !== null && (
          <img
            key={`previous-${HERO_PHOTOS[previousIndex].src}`}
            src={HERO_PHOTOS[previousIndex].src.replace(/\.jpg$/, "-1920.webp")}
            srcSet={`${HERO_PHOTOS[previousIndex].src.replace(/\.jpg$/, "")}-1200.webp 1200w, ${HERO_PHOTOS[previousIndex].src.replace(/\.jpg$/, "")}-1920.webp 1920w`}
            alt=""
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: HERO_PHOTOS[previousIndex].position }}
          />
        )}
        <img
          key={current.src}
          ref={imageRef}
          src={`${currentBase}-1920.webp`}
          srcSet={`${currentBase}-1200.webp 1200w, ${currentBase}-1920.webp 1920w`}
          alt={current.alt}
          fetchPriority={index === 0 ? "high" : undefined}
          sizes="100vw"
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ objectPosition: current.position, opacity: previousIndex === null || imageLoaded ? 1 : 0 }}
        />

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
            <div className="mt-4 flex flex-nowrap justify-center gap-2 sm:mt-5 sm:flex-wrap sm:gap-3">
              <Link
                href={locale === "zh" ? "/zh/guides" : "/guides"}
                className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] min-[360px]:text-xs sm:bg-white sm:px-5 sm:py-2.5 sm:text-sm font-semibold text-sea-800 shadow-md transition-colors hover:bg-sea-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("hero_guides_cta")}
              </Link>
              <a
                href="#search-form"
                className="rounded-full border border-white/70 bg-slate-900/25 px-3 py-1.5 text-[10px] min-[360px]:text-xs sm:border-white/80 sm:bg-slate-900/35 sm:px-5 sm:py-2.5 sm:text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
              onClick={() => showSlide(i)}
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
