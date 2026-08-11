// Centralized affiliate link config for Travelpayouts partners.
// All URLs are tracked via Travelpayouts' tpk.mx shortener — commissions
// attribute to your Marker ID automatically.
//
// To add a new partner: apply on Travelpayouts, generate a tracked link,
// paste it here, then reference the key in components.

export const AFFILIATE_LINKS = {
  // Tours, activities, experiences — Asia focus
  klook: "https://klook.tpk.mx/nsmgv9sX",
  // Airport transfers globally
  welcomePickups: "https://tpk.mx/1lwxsIoN",
  // International eSIM — 18% commission
  yesim: "https://yesim.tpk.mx/3oNaHk4h",
  // Flight comparison + booking
  kiwi: "https://kiwi.tpk.mx/tQAy1nbS",
  // Physical/eSIM alternative to Yesim
  drimsim: "https://drimsim.tpk.mx/bVdli8RO",
} as const;

export type AffiliateKey = keyof typeof AFFILIATE_LINKS;
