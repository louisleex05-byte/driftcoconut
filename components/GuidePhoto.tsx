import Image from "next/image";

// Per-guide slot → photo file + alt text.
// The MDX writes `<GuidePhoto slot="whenToGo" />` — this resolves the slot for the
// current guideSlug (defaulting to bangkok for backwards-compat).
//
// To add photos for a new guide: add a new entry keyed by that guide's slug, with
// slot names matching the <GuidePhoto slot="..." /> tags used in its MDX.

type PhotoEntry = { file: string; alt: string };

const GUIDES: Record<string, Record<string, PhotoEntry>> = {
  bangkok: {
    hero:      { file: "hero.jpg",       alt: "Bangkok skyline at night with the Chao Phraya River in view" },
    whenToGo:  { file: "when-to-go.jpg", alt: "Songkran water festival celebration in the streets of Bangkok" },
    sukhumvit: { file: "sukhumvit.jpg",  alt: "BTS Skytrain running above Sukhumvit Road in Bangkok" },
    silom:     { file: "silom.jpg",      alt: "Rooftop bar overlooking Bangkok's Silom skyline at sunset" },
    riverside: { file: "riverside.jpg",  alt: "Longtail boat on the Chao Phraya River at dusk, Bangkok" },
    oldTown:   { file: "old-town.jpg",   alt: "Reclining Buddha statue at Wat Pho temple, Bangkok" },
    activity:  { file: "activity.jpg",   alt: "Wat Arun temple silhouetted against sunset across the Chao Phraya" },
    localTips: { file: "local-tips.jpg", alt: "Street food vendor cooking pad thai at a Bangkok night market" },
  },
  "chiang-mai": {
    hero:        { file: "hero.jpg",         alt: "Doi Suthep golden temple overlooking Chiang Mai city at sunset" },
    whenToGo:    { file: "when-to-go.jpg",   alt: "Yi Peng lantern festival releasing sky lanterns over Chiang Mai" },
    oldCity:     { file: "old-city.jpg",     alt: "Chiang Mai Old City ancient moat and city wall" },
    nimman:      { file: "nimman.jpg",       alt: "Nimman coffee shop and cafe district in Chiang Mai" },
    riverside:   { file: "riverside.jpg",    alt: "Ping River teak houses at sunset in Chiang Mai" },
    nightBazaar: { file: "night-bazaar.jpg", alt: "Chiang Mai Night Bazaar and Anusarn Market stalls at night" },
    santitham:   { file: "santitham.jpg",    alt: "Santitham local Thai residential neighborhood in Chiang Mai" },
    doiSuthep:   { file: "doi-suthep.jpg",   alt: "Wat Phra That Doi Suthep temple with mountain view" },
    khaoSoi:     { file: "khao-soi.jpg",     alt: "Bowl of Northern Thai khao soi curry noodles in Chiang Mai" },
  },
  bali: {
    hero:         { file: "hero.jpg",          alt: "Tegallalang rice terraces in the Ubud hills of Bali at sunrise" },
    whenToGo:     { file: "when-to-go.jpg",    alt: "Balinese Nyepi Ogoh-Ogoh parade before the Day of Silence" },
    ubud:         { file: "ubud.jpg",          alt: "Ubud rice terraces and jungle village in Bali" },
    canggu:       { file: "canggu.jpg",        alt: "Surfer at Batu Bolong beach in Canggu, Bali" },
    seminyak:     { file: "seminyak.jpg",      alt: "Seminyak beach club at sunset with cocktails on the sand" },
    uluwatu:      { file: "uluwatu.jpg",       alt: "Uluwatu Temple perched on a cliff over the Indian Ocean at sunset" },
    sanur:        { file: "sanur.jpg",         alt: "Sanur beach at dawn with traditional Balinese jukung fishing boats" },
    nusaPenida:   { file: "nusa-penida.jpg",   alt: "Kelingking Beach T-Rex cliff view on Nusa Penida" },
    cookingClass: { file: "cooking-class.jpg", alt: "Balinese cooking class with fresh market ingredients" },
    warung:       { file: "warung.jpg",        alt: "Traditional Balinese warung serving nasi campur and babi guling" },
  },
  phuket: {
    hero:       { file: "hero.jpg",        alt: "Promthep Cape sunset viewpoint at the southern tip of Phuket" },
    whenToGo:   { file: "when-to-go.jpg",  alt: "Andaman coast red flag beach warning during monsoon season in Phuket" },
    kata:       { file: "kata.jpg",        alt: "Kata Beach family-friendly Andaman coast in Phuket at sunset" },
    bangTao:    { file: "bang-tao.jpg",    alt: "Bang Tao and Kamala luxury resort beach in northern Phuket" },
    oldTown:    { file: "old-town.jpg",    alt: "Sino-Portuguese saffron shophouses on Thalang Road in Phuket Old Town" },
    patong:     { file: "patong.jpg",      alt: "Patong Beach in daytime with longtail boats and busy sand strip" },
    bigBuddha:  { file: "big-buddha.jpg",  alt: "Big Buddha Wat Phra Yai marble statue overlooking Phuket bay" },
    phiPhi:     { file: "phi-phi.jpg",     alt: "Phi Phi Islands turquoise water and limestone cliffs day trip from Phuket" },
    khanomJeen: { file: "khanom-jeen.jpg", alt: "Southern Thai khanom jeen curry rice noodles with fresh vegetables" },
  },
  pattaya: {
    hero:       { file: "hero.jpg",        alt: "Wongamat Beach at sunset with the Pattaya coastline in the background" },
    whenToGo:   { file: "when-to-go.jpg",  alt: "Songkran and Wan Lai water festival celebration in Pattaya" },
    wongamat:   { file: "wongamat.jpg",    alt: "Wongamat Beach at sunset with palms and family-friendly seafront in North Pattaya" },
    jomtien:    { file: "jomtien.jpg",     alt: "Jomtien Beach with tree shade and calm sand south of Pattaya" },
    pratamnak:  { file: "pratamnak.jpg",   alt: "Pratamnak Hill viewpoint over Pattaya Bay with Big Buddha Wat Phra Yai" },
    central:    { file: "central.jpg",     alt: "Central Pattaya beach and skyline near Central Festival mall" },
    sanctuary:  { file: "sanctuary.jpg",   alt: "Sanctuary of Truth all-teak temple by the sea in Pattaya" },
    kohLarn:    { file: "koh-larn.jpg",    alt: "Coral Island Koh Larn white sand beach and turquoise water day trip from Pattaya" },
    nongNooch:  { file: "nong-nooch.jpg",  alt: "Nong Nooch Tropical Botanical Garden with topiary and orchid houses" },
    fishMarket: { file: "fish-market.jpg", alt: "Naklua Fish Market grilled seafood and local Thai stalls at dawn" },
  },
};

export default function GuidePhoto({
  slot,
  guideSlug = "bangkok",
}: {
  slot: string;
  guideSlug?: string;
}) {
  const guide = GUIDES[guideSlug] ?? GUIDES.bangkok;
  const meta = guide[slot];
  if (!meta) return null;
  return (
    <figure className="my-8 not-prose">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
        <Image
          src={`/guides/${guideSlug}/${meta.file}`}
          alt={meta.alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 text-xs text-slate-500 italic">{meta.alt}</figcaption>
    </figure>
  );
}
