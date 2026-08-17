// Rotating hero photos for the homepage slideshow.
// Each has an off-center crop position so the search overlay stays readable.

export type HeroPhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  // Tailwind object-position class OR raw CSS value
  position: string;
};

export const HERO_PHOTOS: HeroPhoto[] = [
  // ─── Featured first slide ────────────────────────────────────────
  {
    src: "/hero/myanmar-bagan-balloon.jpg",
    alt: "Hot air balloon over Bagan pagodas at sunrise, Myanmar",
    caption: "Bagan balloons, Myanmar",
    credit: "Photo: Peggy_Marco / Pixabay",
    // Balloon is top-right of source; shift up + right so it stays fully visible on wide crops
    position: "75% 25%",
  },

  // ─── Original set: tropical / Maldives / Bali ────────────────────
  {
    src: "/hero/bali-sanur.jpg",
    alt: "Traditional jukung fishing boat at sunrise on Sanur Beach, Bali",
    caption: "Sanur Beach, Bali",
    credit: "Photo: Wande Mokkori / Pixabay",
    position: "left center",
  },
  {
    src: "/hero/maldives-overwater.jpg",
    alt: "Overwater bungalows on turquoise water in the Maldives",
    caption: "Overwater villas, Maldives",
    credit: "Photo: Ruledis21 / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/maldives-pool.jpg",
    alt: "Infinity pool with palm trees overlooking the ocean",
    caption: "Resort infinity pool, Maldives",
    credit: "Photo: Webkims / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/maldives-hammock.jpg",
    alt: "Relaxing in a hammock on a Maldives beach under a palm tree",
    caption: "Beach hammock, Maldives",
    credit: "Photo: Josepons28 / Pixabay",
    position: "center 35%",
  },
  {
    src: "/hero/maldives-dhoni.jpg",
    alt: "Traditional Maldivian dhoni boat at a resort dock with turquoise lagoon",
    caption: "Resort dhoni, Maldives",
    credit: "Photo: Csehokel / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/maldives-palm-beach.jpg",
    alt: "Coconut palm tree leaning over a Maldives beach and turquoise sea",
    caption: "Palm beach, Maldives",
    credit: "Photo: Da1374 / Pixabay",
    position: "30% center",
  },

  // ─── City breaks: Japan ──────────────────────────────────────────
  {
    src: "/hero/tokyo-shibuya-crossing.jpg",
    alt: "Shibuya crossing at night in Tokyo lit by neon signs",
    caption: "Shibuya crossing, Tokyo",
    credit: "Photo: StockSnap / Pixabay",
    position: "center 60%",
  },
  {
    src: "/hero/osaka-dotonbori-glico.jpg",
    alt: "Dotonbori canal Osaka with Glico Running Man and neon billboards",
    caption: "Dotonbori, Osaka",
    credit: "Photo: Wassy_St / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/osaka-dotonbori-sunset.jpg",
    alt: "Dotonbori canal at sunset with Ferris wheel reflection, Osaka",
    caption: "Dotonbori sunset, Osaka",
    credit: "Photo: Radiobj5 / Pixabay",
    position: "center 30%",
  },
  {
    src: "/hero/osaka-castle.jpg",
    alt: "Osaka Castle main keep with cherry trees and blue sky",
    caption: "Osaka Castle",
    credit: "Photo: Djedj / Pixabay",
    position: "center 40%",
  },

  // ─── City breaks: Hong Kong ──────────────────────────────────────
  {
    src: "/hero/hong-kong-tram-night.jpg",
    alt: "Vintage double-decker tram on a Hong Kong street at night",
    caption: "Hong Kong tram",
    credit: "Photo: NextVoyage / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/hong-kong-junk-boat.jpg",
    alt: "Traditional red-sailed junk boat with Hong Kong skyline behind",
    caption: "Junk boat, Victoria Harbour",
    credit: "Photo: Stokpic / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/hong-kong-peak-lion.jpg",
    alt: "Stone guardian lion overlooking Hong Kong skyline from the Peak",
    caption: "Victoria Peak, Hong Kong",
    credit: "Photo: Mainathlet / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/hong-kong-peak-night.jpg",
    alt: "Panoramic night view of Hong Kong skyline from Victoria Peak",
    caption: "Hong Kong skyline at night",
    credit: "Photo: RolandoEmail / Pixabay",
    position: "center 60%",
  },
  {
    src: "/hero/hong-kong-big-buddha.jpg",
    alt: "Tian Tan Big Buddha bronze statue against dramatic sky",
    caption: "Tian Tan Buddha, Hong Kong",
    credit: "Photo: TheDigitalArtist / Pixabay",
    position: "center 40%",
  },

  // ─── City breaks: Singapore ──────────────────────────────────────
  {
    src: "/hero/singapore-marina-bay-day.jpg",
    alt: "Marina Bay Sands and ArtScience Museum with cloudy sky",
    caption: "Marina Bay Sands, Singapore",
    credit: "Photo: Cegoh / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/singapore-marina-bay-night.jpg",
    alt: "Marina Bay Sands illuminated at blue hour with reflections",
    caption: "Marina Bay Sands at night",
    credit: "Photo: Cegoh / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/singapore-supertrees.jpg",
    alt: "Supertree Grove at Gardens by the Bay Singapore under bright sky",
    caption: "Gardens by the Bay, Singapore",
    credit: "Photo: Rudy1412 / Pixabay",
    position: "center center",
  },

  // ─── Cultural / mountain / SE Asia ───────────────────────────────
  {
    src: "/hero/thailand-phu-chi-fa.jpg",
    alt: "Two travelers on Phu Chi Fa cliff at sunrise, northern Thailand",
    caption: "Phu Chi Fa, Chiang Rai",
    credit: "Photo: Sasint / Pixabay",
    position: "center 40%",
  },
  {
    src: "/hero/taiwan-sky-lanterns.jpg",
    alt: "Floating sky lanterns during Pingxi lantern festival",
    caption: "Sky lanterns, Pingxi",
    credit: "Photo: WPhoto / Pixabay",
    position: "center center",
  },
  {
    src: "/hero/seoul-namdaemun-market.jpg",
    alt: "Colorful Korean street food display at Namdaemun Market, Seoul",
    caption: "Namdaemun Market, Seoul",
    credit: "Photo: TragrPx / Pixabay",
    position: "center center",
  },
];
