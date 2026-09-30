// Centralized affiliate link config for Travelpayouts partners.
// All URLs are tracked via Travelpayouts' tpk.mx shortener — commissions
// attribute to your Marker ID automatically.
//
// To add a new partner: apply on Travelpayouts, generate a tracked link,
// paste it here, then reference the key in components.

export const AFFILIATE_LINKS = {
  // ─── Row 1: core essentials ────────────────────────────────────
  // Tours, activities, experiences — Asia focus (5% commission)
  klook: "https://klook.tpk.mx/nsmgv9sX",
  // Airport transfers globally (8–9%)
  welcomePickups: "https://tpk.mx/1lwxsIoN",
  // International eSIM (18%)
  yesim: "https://yesim.tpk.mx/3oNaHk4h",
  // Flight comparison + booking (3%)
  kiwi: "https://kiwi.tpk.mx/tQAy1nbS",

  // ─── Row 2: expansion partners (Aug 2026) ──────────────────────
  // Flight meta-search — HOT program, 40% commission
  aviasales: "https://aviasales.tpk.mx/20RxFiWc",
  // Global eSIM — most recognized brand (12%)
  airalo: "https://airalo.tpk.mx/UWmFPctG",
  // Travel insurance (25%)
  ekta: "https://ektatraveling.tpk.mx/79O4liS5",
  // Flight delay/cancellation compensation — pure lead-gen (15–16.6%)
  airhelp: "https://airhelp.tpk.mx/wErRQsAI",

  // ─── Alternative / stacked cards ───────────────────────────────
  // Physical SIM alternative to Yesim
  drimsim: "https://drimsim.tpk.mx/bVdli8RO",
  // Attraction / museum tickets — alternative to Klook (3.5–8%)
  tiqets: "https://tiqets.tpk.mx/dVQTBNpn",

  // ─── Trip planner slots — PASTE TRACKED LINKS HERE ─────────────
  // Leave as "" until you generate the link in Travelpayouts (Tools → Links →
  // pick the program → copy the tpk.mx short link). The trip planner hides any
  // tile or "Also:" link whose URL is empty, so nothing broken ever shows.
  // Step 1 (Before you go)
  saily: "https://saily.tpk.mx/IIgXfbbi", // eSIM (15%) — "Also:" under Yesim, next to Airalo
  // Step 2 (When you land)
  getrentacar: "https://getrentacar.tpk.mx/XoVtDxvf", // Car rental (10%, 90-day cookie)
  kiwitaxi: "https://kiwitaxi.tpk.mx/33nZFmOH", // Private transfers (9–11%) — "Also:" under Welcome Pickups
  bikesbooking: "https://bikesbooking.tpk.mx/C3xF3LI4", // Scooter / bike rental (4%) — 4th tile in step 2
  // Step 3 (While you're there)
  kkday: "https://kkday.tpk.mx/mNmsSQ1R", // Asia tours & activities (1–5%) — "Also:" under Klook
  gocity: "https://gocity.tpk.mx/TPRoyvLg", // Attraction passes (3.4–6%) — 4th tile in step 3
  // Step 4 (If things go wrong)
  compensair: "https://compensair.tpk.mx/LphYOfwg", // Flight compensation (fixed €5–12) — third tile in step 4
  claimcompass: "",    // Flight compensation alt — shown as "Also:" under AirHelp
} as const;

export type AffiliateKey = keyof typeof AFFILIATE_LINKS;
