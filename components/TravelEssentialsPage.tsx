import Image from "next/image";
import Link from "next/link";
import TripPlanner from "@/components/TripPlanner";
import ShopeeProductLink from "@/components/ShopeeProductLink";
import {
  SHOPEE_ESSENTIAL_CATEGORIES,
  localizedShopeeEssentials,
  type ShopeeEssential,
} from "@/lib/shopeeEssentials";
import type { Locale } from "@/lib/i18n";
import { TRAVEL_ESSENTIALS_COPY, TRAVEL_ESSENTIALS_LANG } from "@/lib/travelEssentials";

type TravelEssentialsCopy = (typeof TRAVEL_ESSENTIALS_COPY)[Locale];

function ProductCard({ product, copy }: { product: ShopeeEssential; copy: TravelEssentialsCopy }) {
  const label = product.affiliateUrl
    ? copy.affiliateLink
    : product.status === "under-review"
      ? copy.underReview
      : copy.preparingLink;

  const card = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sea-100 bg-white/85 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-sea-200 group-hover:shadow-md">
      {product.imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-sea-50 bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-contain p-4 transition-transform duration-300 hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sea-600">
            {label}
          </p>
          <span className="rounded-full bg-sea-50 px-2 py-1 text-[10px] font-medium text-sea-700">
            {copy.retailer}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-sea-900">{product.name}</h3>
        {product.reason && <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.reason}</p>}

        {product.observedAt && (
          <>
            <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-sea-50 py-4 text-xs">
              <div>
                <dt className="text-slate-400">{copy.price}</dt>
                <dd className="mt-0.5 font-semibold text-slate-700">{product.observedPrice}</dd>
              </div>
              <div>
                <dt className="text-slate-400">{copy.demand}</dt>
                <dd className="mt-0.5 font-semibold text-slate-700">{product.observedDemand}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-400">{copy.rating}</dt>
                <dd className="mt-0.5 font-semibold text-slate-700">{product.observedRating}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              {copy.observed(product.observedAt)}
            </p>
          </>
        )}

        <span
          className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
            product.affiliateUrl
              ? "bg-sea-700 text-white transition-colors group-hover:bg-sea-800"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {product.affiliateUrl ? `${copy.shop} ↗` : copy.comingSoon}
        </span>
      </div>
    </article>
  );

  if (!product.affiliateUrl) return card;

  return (
    <ShopeeProductLink
      href={product.affiliateUrl}
      productId={product.id}
      label={copy.shopProduct(product.name)}
    >
      {card}
    </ShopeeProductLink>
  );
}

export default function TravelEssentialsPage({ locale }: { locale: Locale }) {
  const copy = TRAVEL_ESSENTIALS_COPY[locale];
  const catalog = localizedShopeeEssentials(locale);
  const guidesHref = locale === "en" ? "/guides" : `/${locale}/guides`;

  return (
    <div lang={TRAVEL_ESSENTIALS_LANG[locale]} className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sea-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-coral-100/50 blur-3xl" />

      <section className="relative mx-auto max-w-4xl py-8 text-center sm:py-14">
        <div className="relative mx-auto inline-flex items-center">
          <span
            aria-hidden="true"
            className="absolute -left-7 -top-3 z-10 -rotate-6 text-3xl drop-shadow-sm sm:-left-9 sm:text-4xl"
          >
            🏕️
          </span>
          <p className="relative rounded-full bg-sand-100/90 px-8 py-2 font-display text-lg font-semibold uppercase tracking-[0.16em] text-sea-800 shadow-sm ring-1 ring-sand-200 sm:px-10 sm:text-xl">
            {copy.eyebrow}
          </p>
          <span
            aria-hidden="true"
            className="absolute -right-6 -top-3 z-10 rotate-6 text-3xl drop-shadow-sm sm:-right-8 sm:text-4xl"
          >
            🎒
          </span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-sea-900 sm:text-5xl">
          {copy.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          {copy.introduction}
        </p>
      </section>

      <div className="relative space-y-12 pb-12">
        {SHOPEE_ESSENTIAL_CATEGORIES.map((category) => {
          const products = catalog.filter((product) => product.category === category.id);
          if (products.length === 0) return null;

          const { title, description } = category.copy[locale];

          return (
            <section key={category.id} aria-labelledby={`${category.id}-heading`}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-sea-100 pb-4">
                <div>
                  <p className="text-2xl" aria-hidden="true">{category.icon}</p>
                  <h2 id={`${category.id}-heading`} className="mt-1 font-display text-2xl font-semibold text-sea-900">
                    {title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => <ProductCard key={product.id} product={product} copy={copy} />)}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mb-10 rounded-2xl border border-sea-100 bg-white/85 p-6 text-center shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-sea-900">{copy.outdoorTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          {copy.outdoorDescription}
        </p>
        <a
          href="https://lezzcamp.com/en/gear"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-full border border-sea-600 px-5 py-2.5 text-sm font-semibold text-sea-800 transition-colors hover:bg-sea-50"
        >
          {copy.outdoorLink} ↗
        </a>
      </section>

      <section className="mb-10 rounded-2xl border border-sea-100 bg-sea-50/70 p-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-sea-900">{copy.guidesTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          {copy.guidesDescription}
        </p>
        <Link href={guidesHref} className="mt-4 inline-flex rounded-full bg-sea-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sea-800">
          {copy.guidesLink}
        </Link>
      </section>

      <section className="mb-10 border-t border-sea-100 pt-10">
        <TripPlanner />
      </section>

      <aside
        aria-labelledby="affiliate-note-heading"
        className="mb-10 rounded-xl border border-sand-200 bg-sand-50 px-5 py-4 text-center text-sm leading-relaxed text-slate-600"
      >
        <h2 id="affiliate-note-heading" className="mb-1 font-semibold text-slate-700">
          {copy.noteTitle}
        </h2>
        <p>
          {copy.note}
        </p>
      </aside>
    </div>
  );
}
