// Per-destination relevance rules for the trip planner.
//
// The planner is generic by default, but a few tiles are misleading in some places
// (e.g. "Koh Tao airport transfer" when the island has no airport, or an
// attraction pass where none exists). Rules are keyed by the lower-cased city name
// taken from a guide's `destination` frontmatter ("Koh Tao, Thailand" → "koh tao").
//
// Add a destination here when you publish a guide where a tile would not fit.

export type PlannerProfile = {
  /** No usable airport in the destination itself: relabel the transfer tile "Transfer to {dest}". */
  transferTo?: boolean;
  /** Tile ids to hide for this destination (see TILES in TripPlanner.tsx). */
  hide?: string[];
};

const ISLAND_OR_NATURE_HIDE = ["tickets", "gocity"]; // no museum tickets / city pass there

const RULES: Record<string, PlannerProfile> = {
  // Islands and places reached via another airport, station or pier
  "koh tao":      { transferTo: true, hide: [...ISLAND_OR_NATURE_HIDE, "cars"] },
  "koh phangan":  { transferTo: true, hide: ISLAND_OR_NATURE_HIDE },
  "koh lanta":    { transferTo: true, hide: ISLAND_OR_NATURE_HIDE },
  "koh chang":    { transferTo: true, hide: ISLAND_OR_NATURE_HIDE },
  "cha am":       { transferTo: true, hide: ISLAND_OR_NATURE_HIDE },
  "hua hin":      { transferTo: true, hide: ISLAND_OR_NATURE_HIDE },
  "pattaya":      { transferTo: true, hide: ["gocity"] },
  "kanchanaburi": { transferTo: true, hide: ISLAND_OR_NATURE_HIDE },
  "ayutthaya":    { transferTo: true, hide: ["gocity"] },
  // Nature-focused places with an airport
  "mae hong son": { hide: ISLAND_OR_NATURE_HIDE },
  "krabi":        { hide: ISLAND_OR_NATURE_HIDE },
  "samui":        { hide: ISLAND_OR_NATURE_HIDE },
  // Go City only sells a pass in Bangkok among our destinations
  "chiang mai":   { hide: ["gocity"] },
  "chiang rai":   { hide: ["gocity"] },
  "sukhothai":    { hide: ["gocity"] },
  "phuket":       { hide: ["gocity"] },
  "bali":         { hide: ["gocity"] },
};

export function plannerProfile(destination?: string): PlannerProfile {
  if (!destination) return {};
  const key = destination.trim().toLowerCase().replace(/-/g, " ");
  return RULES[key] ?? {};
}
