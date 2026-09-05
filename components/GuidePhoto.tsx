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
  pai: {
    hero:          { file: "hero.jpg",           alt: "Pai valley at sunrise with mist over rice paddies and mountain backdrop in northern Thailand" },
    whenToGo:      { file: "when-to-go.jpg",     alt: "Ban Rak Thai Yunnanese Chinese tea village lake at dawn in cool season" },
    pai:           { file: "pai.jpg",            alt: "Pai Walking Street night market with hipster cafes and travelers in Mae Hong Son" },
    maeHongSon:    { file: "mae-hong-son.jpg",   alt: "Wat Chong Klang and Wat Chong Kham twin Burmese temples reflected in Chong Kham Lake" },
    banRakThai:    { file: "ban-rak-thai.jpg",   alt: "Ban Rak Thai Yunnanese Chinese tea plantation village on Myanmar border" },
    yunLai:        { file: "yun-lai.jpg",        alt: "Yun Lai viewpoint at dawn overlooking misty Pai valley in Mae Hong Son" },
    watChongKlang: { file: "wat-chong-klang.jpg", alt: "Wat Chong Klang Burmese-style temple on Chong Kham Lake in Mae Hong Son town" },
    localFood:     { file: "local-food.jpg",     alt: "Yunnanese steamed pork buns and hot tea breakfast at Ban Rak Thai" },
  },
  samui: {
    hero:         { file: "hero.jpg",          alt: "Bophut Fisherman's Village lantern-lit walking street in Koh Samui at dusk" },
    whenToGo:     { file: "when-to-go.jpg",    alt: "Ang Thong Marine Park emerald lagoon and limestone islands off Koh Samui" },
    bophut:       { file: "bophut.jpg",        alt: "Bophut Fisherman's Village boutique dinner strip on the north coast of Koh Samui" },
    choengMon:    { file: "choeng-mon.jpg",    alt: "Choeng Mon crescent beach with calm swimming water on Koh Samui's east tip" },
    chaweng:      { file: "chaweng.jpg",       alt: "Chaweng Beach main tourist strip and long sand strip on Koh Samui" },
    lamai:        { file: "lamai.jpg",         alt: "Lamai Beach and Hin Ta Hin Yai grandfather grandmother rock formations Koh Samui" },
    bigBuddha:    { file: "big-buddha.jpg",    alt: "Big Buddha Wat Phra Yai gold statue on Ko Fan islet Koh Samui" },
    angThong:     { file: "ang-thong.jpg",     alt: "Ang Thong National Marine Park limestone archipelago day trip from Koh Samui" },
    nathonMarket: { file: "nathon-market.jpg", alt: "Nathon fresh market grilled fish and Thai food stalls at dawn Koh Samui" },
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
  ayutthaya: {
    hero:              { file: "hero.jpg",                alt: "Wat Mahathat sandstone Buddha head entwined in banyan tree roots at Ayutthaya Historical Park" },
    whenToGo:          { file: "when-to-go.jpg",          alt: "Ayutthaya Historical Park Buddhist temple ruins during dry season sunset" },
    historicalPark:    { file: "historical-park.jpg",     alt: "Ayutthaya Historical Park UNESCO ancient capital ruins with reclining Buddha" },
    watMahathat:       { file: "wat-mahathat.jpg",        alt: "Wat Mahathat Buddha head embraced by fig tree roots in Ayutthaya" },
    watPhraSiSanphet:  { file: "wat-phra-si-sanphet.jpg", alt: "Wat Phra Si Sanphet three white chedis royal Buddhist temple Ayutthaya" },
    bangPaIn:          { file: "bang-pa-in.jpg",          alt: "Bang Pa-In Royal Summer Palace Thai gazebo on the lake near Ayutthaya" },
    nightBazaar:       { file: "night-bazaar.jpg",        alt: "Ayutthaya night market food stalls and evening dining on the island" },
    boatTrip:          { file: "boat-trip.jpg",           alt: "Longtail boat sunset river tour circling Ayutthaya historic island" },
    boatNoodles:       { file: "boat-noodles.jpg",        alt: "Ayutthaya boat noodles kuay tiew rue with dark beef broth street food" },
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
