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
    // Shift crop so the person sits slightly off-center under the headline
    position: "center 35%",
  },
];
