// Popular Agoda city IDs. Full list is in the Hotel Data File (downloadable from
// partners.agoda.com → Tools → Hotel Data File). This is a curated subset covering
// major travel destinations.
//
// PRIMARY FOCUS: Thailand destinations - driftcoconut.com is a Thailand niche site.
// Every published guide (bangkok, chiang-mai, phuket, krabi, samui, pattaya, ayutthaya,
// chiang-rai, pai, hua-hin, kanchanaburi) MUST have a matching entry here so the
// homepage dropdown routes to the right Booking.com search results.
// Thai IDs in the 9xxxx range are placeholders; Agoda API runs in mock mode
// (AGODA_MOCK=true) so these never hit a real API. Booking.com CJ routing uses
// the NAME field, not the ID, so any accurate name string works.

export type City = {
  id: number;
  name: string;
  region: "Thailand" | "Asia" | "Europe" | "Americas" | "Oceania" | "Middle East" | "Africa";
};

export const CITIES: City[] = [
  // === Thailand - primary focus, matches every published guide ===
  { id: 9395,  name: "Bangkok, Thailand",      region: "Thailand" },
  { id: 8584,  name: "Chiang Mai, Thailand",   region: "Thailand" },
  { id: 20263, name: "Phuket, Thailand",       region: "Thailand" },
  { id: 91001, name: "Krabi, Thailand",        region: "Thailand" },
  { id: 91002, name: "Koh Samui, Thailand",    region: "Thailand" },
  { id: 91003, name: "Pattaya, Thailand",      region: "Thailand" },
  { id: 91004, name: "Chiang Rai, Thailand",   region: "Thailand" },
  { id: 91005, name: "Ayutthaya, Thailand",    region: "Thailand" },
  { id: 91006, name: "Pai, Thailand",          region: "Thailand" },
  { id: 91007, name: "Mae Hong Son, Thailand", region: "Thailand" },
  { id: 91008, name: "Hua Hin, Thailand",      region: "Thailand" },
  { id: 91009, name: "Kanchanaburi, Thailand", region: "Thailand" },
  { id: 91010, name: "Koh Lanta, Thailand",    region: "Thailand" },
  { id: 91011, name: "Koh Chang, Thailand",    region: "Thailand" },
  { id: 91012, name: "Koh Phangan, Thailand",  region: "Thailand" },
  { id: 91013, name: "Koh Tao, Thailand",      region: "Thailand" },
  { id: 91014, name: "Cha-am, Thailand",       region: "Thailand" },
  { id: 91015, name: "Sukhothai, Thailand",    region: "Thailand" },

  // === Asia (secondary) ===
  { id: 17193, name: "Bali, Indonesia",           region: "Asia" },
  { id: 4064,  name: "Tokyo, Japan",              region: "Asia" },
  { id: 4562,  name: "Singapore",                 region: "Asia" },
  { id: 18773, name: "Kuala Lumpur, Malaysia",    region: "Asia" },
  { id: 5085,  name: "Hong Kong",                 region: "Asia" },
  { id: 14257, name: "Seoul, South Korea",        region: "Asia" },
  { id: 16440, name: "Ho Chi Minh City, Vietnam", region: "Asia" },
  { id: 15414, name: "Hanoi, Vietnam",            region: "Asia" },
  { id: 20211, name: "Osaka, Japan",              region: "Asia" },
  { id: 15957, name: "Kyoto, Japan",              region: "Asia" },
  { id: 22930, name: "Taipei, Taiwan",            region: "Asia" },
  { id: 3739,  name: "Manila, Philippines",       region: "Asia" },
  { id: 3227,  name: "Boracay, Philippines",      region: "Asia" },
  { id: 26637, name: "Siem Reap, Cambodia",       region: "Asia" },
  { id: 2794,  name: "Jakarta, Indonesia",        region: "Asia" },
  { id: 903,   name: "Colombo, Sri Lanka",        region: "Asia" },
  { id: 20105, name: "Maldives",                  region: "Asia" },
  { id: 6088,  name: "Mumbai, India",             region: "Asia" },
  { id: 3357,  name: "New Delhi, India",          region: "Asia" },

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
