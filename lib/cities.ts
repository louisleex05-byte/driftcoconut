// Popular Agoda city IDs. Full list is in the Hotel Data File (downloadable from
// partners.agoda.com → Tools → Hotel Data File). This is a curated subset covering
// major travel destinations.

export type City = {
  id: number;
  name: string;
  region: "Asia" | "Europe" | "Americas" | "Oceania" | "Middle East" | "Africa";
};

export const CITIES: City[] = [
  // Asia
  { id: 9395, name: "Bangkok, Thailand", region: "Asia" },
  { id: 17193, name: "Bali, Indonesia", region: "Asia" },
  { id: 4064, name: "Tokyo, Japan", region: "Asia" },
  { id: 4562, name: "Singapore", region: "Asia" },
  { id: 18773, name: "Kuala Lumpur, Malaysia", region: "Asia" },
  { id: 5085, name: "Hong Kong", region: "Asia" },
  { id: 14257, name: "Seoul, South Korea", region: "Asia" },
  { id: 16440, name: "Ho Chi Minh City, Vietnam", region: "Asia" },
  { id: 15414, name: "Hanoi, Vietnam", region: "Asia" },
  { id: 20211, name: "Osaka, Japan", region: "Asia" },
  { id: 15957, name: "Kyoto, Japan", region: "Asia" },
  { id: 20263, name: "Phuket, Thailand", region: "Asia" },
  { id: 8584, name: "Chiang Mai, Thailand", region: "Asia" },
  { id: 22930, name: "Taipei, Taiwan", region: "Asia" },
  { id: 3739, name: "Manila, Philippines", region: "Asia" },
  { id: 3227, name: "Boracay, Philippines", region: "Asia" },
  { id: 26637, name: "Siem Reap, Cambodia", region: "Asia" },
  { id: 2794, name: "Jakarta, Indonesia", region: "Asia" },
  { id: 903, name: "Colombo, Sri Lanka", region: "Asia" },
  { id: 20105, name: "Maldives", region: "Asia" },
  { id: 6088, name: "Mumbai, India", region: "Asia" },
  { id: 3357, name: "New Delhi, India", region: "Asia" },

  // Europe
  { id: 12310, name: "London, United Kingdom", region: "Europe" },
  { id: 3597, name: "Paris, France", region: "Europe" },
  { id: 9174, name: "Rome, Italy", region: "Europe" },
  { id: 4570, name: "Barcelona, Spain", region: "Europe" },
  { id: 1732, name: "Amsterdam, Netherlands", region: "Europe" },
  { id: 4285, name: "Istanbul, Turkey", region: "Europe" },
  { id: 5484, name: "Prague, Czech Republic", region: "Europe" },
  { id: 17252, name: "Vienna, Austria", region: "Europe" },
  { id: 1301, name: "Athens, Greece", region: "Europe" },

  // Americas
  { id: 5691, name: "New York, USA", region: "Americas" },
  { id: 20421, name: "Los Angeles, USA", region: "Americas" },
  { id: 8299, name: "Las Vegas, USA", region: "Americas" },
  { id: 11066, name: "San Francisco, USA", region: "Americas" },
  { id: 4894, name: "Miami, USA", region: "Americas" },
  { id: 2618, name: "Toronto, Canada", region: "Americas" },
  { id: 9448, name: "Vancouver, Canada", region: "Americas" },
  { id: 2029, name: "Cancun, Mexico", region: "Americas" },

  // Oceania
  { id: 14701, name: "Sydney, Australia", region: "Oceania" },
  { id: 8534, name: "Melbourne, Australia", region: "Oceania" },
  { id: 20207, name: "Gold Coast, Australia", region: "Oceania" },
  { id: 9506, name: "Auckland, New Zealand", region: "Oceania" },

  // Middle East
  { id: 10186, name: "Dubai, UAE", region: "Middle East" },
  { id: 25332, name: "Abu Dhabi, UAE", region: "Middle East" },
  { id: 21781, name: "Doha, Qatar", region: "Middle East" },

  // Africa
  { id: 10265, name: "Cape Town, South Africa", region: "Africa" },
  { id: 15075, name: "Cairo, Egypt", region: "Africa" },
  { id: 21127, name: "Marrakech, Morocco", region: "Africa" },
];
