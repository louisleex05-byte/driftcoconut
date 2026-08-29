// Pools of destinations for the "Where to drift next" cards.
// Each visit shuffles picks — after any click, the set re-shuffles so
// returning visitors see fresh options.

export type Category = "tropical" | "city" | "mountain";

export const DRIFT_POOLS: Record<Category, string[]> = {
  tropical: [
    "Bali",
    "Phuket",
    "Maldives",
    "Boracay",
    "Krabi",
    "Koh Samui",
    "Palawan",
    "Langkawi",
    "Nha Trang",
    "Lombok",
  ],
  city: [
    "Tokyo",
    "Singapore",
    "Hong Kong",
    "Seoul",
    "Osaka",
    "Taipei",
    "Bangkok",
    "Kuala Lumpur",
    "Shanghai",
    "Ho Chi Minh City",
  ],
  mountain: [
    "Chiang Mai",
    "Kyoto",
    "Sapa",
    "Da Lat",
    "Ubud",
    "Cameron Highlands",
    "Kathmandu",
    "Pai",
    "Baguio",
    "Yangshuo",
  ],
};

/**
 * Pick N distinct random items from a list. If list has fewer than N items,
 * returns all of them.
 */
export function pickRandom<T>(list: T[], n: number): T[] {
  const copy = [...list];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

/**
 * Randomly select destinations for all three drift categories.
 * Returns { primary, others } per category — primary is the card link,
 * others fill the "e.g. also X, Y" description.
 */
export function shuffleDrift(): Record<
  Category,
  { primary: string; others: string[] }
> {
  const result = {} as Record<Category, { primary: string; others: string[] }>;
  (Object.keys(DRIFT_POOLS) as Category[]).forEach((cat) => {
    const picks = pickRandom(DRIFT_POOLS[cat], 3);
    result[cat] = { primary: picks[0], others: picks.slice(1) };
  });
  return result;
}
