import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TripPlanner from "@/components/TripPlanner";
import {
  SHOPEE_ESSENTIAL_CATEGORIES,
  SHOPEE_ESSENTIALS,
  type ShopeeEssential,
} from "@/lib/shopeeEssentials";

export const metadata: Metadata = {
  title: "Travel essentials for Thailand",
  description: "A carefully chosen collection of practical travel essentials for Thailand.",
};

function ProductCard({ product }: { product: ShopeeEssential }) {
  const label = product.affiliateUrl
    ? "Affiliate link verified"
    : product.status === "under-review"
      ? "Under review"
      : "Link being prepared";

  const card = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sea-100 bg-white/85 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-sea-200 group-hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-sea-50 bg-white">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-contain p-4 transition-transform duration-300 hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sea-600">
            {label}
          </p>
          <span className="rounded-full bg-sea-50 px-2 py-1 text-[10px] font-medium text-sea-700">
            Shopee Thailand
          </span>
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold leading-tight text-sea-900">{product.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.reason}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-sea-50 py-4 text-xs">
          <div>
            <dt className="text-slate-400">Price checked</dt>
            <dd className="mt-0.5 font-semibold text-slate-700">{product.observedPrice}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Demand</dt>
            <dd className="mt-0.5 font-semibold text-slate-700">{product.observedDemand}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-400">Listing signal</dt>
            <dd className="mt-0.5 font-semibold text-slate-700">{product.observedRating}</dd>
          </div>
        </dl>

        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          Observed {product.observedAt}. Price, stock, and availability can change.
        </p>

        <span
          className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
            product.affiliateUrl
              ? "bg-sea-700 text-white transition-colors group-hover:bg-sea-800"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {product.affiliateUrl ? "View on Shopee ↗" : "Affiliate link coming soon"}
        </span>
      </div>
    </article>
  );

  if (!product.affiliateUrl) return card;

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={`View ${product.name} on Shopee`}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sea-600 focus-visible:ring-offset-2"
    >
      {card}
    </a>
  );
}

export default function TravelEssentialsPage() {
  return (
    <div className="relative overflow-hidden">
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
            Travel essentials
          </p>
          <span
            aria-hidden="true"
            className="absolute -right-6 -top-3 z-10 rotate-6 text-3xl drop-shadow-sm sm:-right-8 sm:text-4xl"
          >
            🎒
          </span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-sea-900 sm:text-5xl">
          Practical picks for smoother Thailand trips
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          A small, carefully reviewed collection for packing, charging, and looking after your kit on the road.
        </p>
      </section>

      <div className="relative space-y-12 pb-12">
        {SHOPEE_ESSENTIAL_CATEGORIES.map((category) => {
          const products = SHOPEE_ESSENTIALS.filter((product) => product.category === category.id);
          if (products.length === 0) return null;

          return (
            <section key={category.id} aria-labelledby={`${category.id}-heading`}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-sea-100 pb-4">
                <div>
                  <p className="text-2xl" aria-hidden="true">{category.icon}</p>
                  <h2 id={`${category.id}-heading`} className="mt-1 font-display text-2xl font-semibold text-sea-900">
                    {category.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600">{category.description}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mb-10 rounded-2xl border border-sea-100 bg-sea-50/70 p-6 text-center">
        <h2 className="font-display text-2xl font-semibold text-sea-900">More Thailand planning help</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Pair your essentials with practical destination advice before you go.
        </p>
        <Link href="/guides" className="mt-4 inline-flex rounded-full bg-sea-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sea-800">
          Browse destination guides
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
          Note
        </h2>
        <p>
          We may earn a commission when affiliate links are added and used, at no extra cost to you. Product facts are checked before publication and can change on the retailer site.
        </p>
      </aside>
    </div>
  );
}
