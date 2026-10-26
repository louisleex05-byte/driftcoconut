/**
 * Hand-picked "next stop" links shown under every guide. Keys and values are guide slugs.
 * Slugs that don't exist (or have no translation for the current locale) are skipped automatically.
 */
export const RELATED: Record<string, string[]> = {
  ayutthaya: ["bangkok", "kanchanaburi", "sukhothai"],
  bali: ["phuket", "krabi", "samui"],
  bangkok: ["ayutthaya", "chiang-mai", "krabi", "kanchanaburi"],
  "cha-am": ["hua-hin", "kanchanaburi", "pattaya"],
  "chiang-mai": ["chiangrai", "mae-hong-son", "sukhothai"],
  chiangrai: ["chiang-mai", "mae-hong-son", "sukhothai"],
  "hua-hin": ["cha-am", "kanchanaburi", "pattaya"],
  "khao-yai": ["ayutthaya", "kanchanaburi", "bangkok"],
  "khao-kho": ["sukhothai", "nan", "khao-yai"],
  "khao-sok-cheow-lan-lake": ["krabi", "phuket", "samui"],
  "phang-nga-khao-lak": ["phuket", "krabi", "khao-sok-cheow-lan-lake"],
  kanchanaburi: ["ayutthaya", "hua-hin", "bangkok"],
  khanom: ["samui", "krabi", "phuket"],
  "koh-chang": ["pattaya", "bangkok", "hua-hin"],
  "koh-lanta": ["krabi", "phuket", "samui"],
  "koh-phangan": ["samui", "koh-tao"],
  "koh-tao": ["koh-phangan", "samui"],
  krabi: ["phuket", "koh-lanta", "samui"],
  "mae-hong-son": ["chiang-mai", "chiangrai", "sukhothai"],
  nan: ["chiang-mai", "mae-hong-son", "kanchanaburi"],
  pattaya: ["bangkok", "hua-hin", "koh-chang"],
  phuket: ["krabi", "koh-lanta", "samui"],
  pranburi: ["hua-hin", "cha-am", "kanchanaburi"],
  samui: ["koh-phangan", "koh-tao", "phuket"],
  sukhothai: ["ayutthaya", "chiang-mai", "chiangrai"],
};
