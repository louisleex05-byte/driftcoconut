import { listGuides } from "@/lib/guides";
import HomeClient from "@/components/HomeClient";

// Server component so listGuides() (fs-based) can run at request/build time.
// All interactive/translated UI lives in HomeClient; we just hand it real
// guide data for the "Featured guides" homepage-funnel section.
//
// This route ("/") serves EN/TH/ZH all from the same URL — the language
// toggle switches UI copy client-side rather than routing to /zh. So we fetch
// BOTH locale variants of the featured guides here and let FeaturedGuides
// (client-side, locale-aware) pick the right one at render time — otherwise
// toggling to Chinese would leave the guide cards themselves stuck in English.
// Hand-picked homepage guides in display order.
const FEATURED_SLUGS = ["phang-nga-khao-lak", "kanchanaburi", "mae-hong-son", "khao-kho"];

export default async function HomePage() {
  const [guidesEn, guidesZh] = await Promise.all([listGuides("en"), listGuides("zh")]);
  const featuredEn = FEATURED_SLUGS
    .map((s) => guidesEn.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => g != null);
  const featuredZh = FEATURED_SLUGS
    .map((s) => guidesZh.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => g != null);
  return <HomeClient guidesEn={featuredEn} guidesZh={featuredZh} />;
}
