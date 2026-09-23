import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Seawater blue - the signature accent (kept for continuity)
        sea: {
          50: "#F0F9FB",
          100: "#DAF0F5",
          200: "#B8E1EB",
          300: "#85CBDB",
          400: "#4FAFC5",
          500: "#2A93AB",
          600: "#1E7A91",
          700: "#1A6377",
          800: "#194F5F",
          900: "#0F3541",
        },
        brand: {
          DEFAULT: "#2A93AB",
          dark: "#1A6377",
        },
        // === Vibrant tropical palette additions ===
        // Coral - warm tropical accent for CTAs, hover states, lively touches
        coral: {
          50:  "#FFF5F1",
          100: "#FFE4D9",
          200: "#FFC5B0",
          300: "#FF9C7A",
          400: "#FF7550",
          500: "#F55428",
          600: "#DE3E13",
          700: "#B22F0E",
        },
        // Sunset - warm gold/amber for section eyebrows, feel-good highlights
        sunset: {
          50:  "#FFFAEE",
          100: "#FFEFC7",
          200: "#FFDD87",
          300: "#FFC547",
          400: "#F5A81C",
          500: "#D68A0A",
          600: "#A96A08",
        },
        // Palm - rich green for nature elements, drift cards, verdant accents
        palm: {
          50:  "#F0F9EF",
          100: "#D8EFD5",
          200: "#A9DBA2",
          300: "#7CC072",
          400: "#4FA044",
          500: "#358230",
          600: "#26661F",
        },
        // Lagoon - jewel-tone teal complementary to sea (adds depth)
        lagoon: {
          50:  "#EDFAF6",
          100: "#CFF0E5",
          200: "#8EDBC3",
          300: "#4CBF9F",
          400: "#22A282",
          500: "#118266",
        },
        // Warm sand palette (expanded from 2 shades)
        sand: {
          50:  "#FBF7F0",
          100: "#F4EBDA",
          200: "#E8D5B5",
          300: "#D6B98A",
          400: "#B99763",
        },
      },
      boxShadow: {
        // Softer, warmer shadows for tropical feel-good depth
        "tropical":     "0 4px 20px -6px rgba(255, 117, 80, 0.25), 0 2px 6px -2px rgba(30, 122, 145, 0.08)",
        "tropical-lg":  "0 12px 40px -12px rgba(255, 117, 80, 0.30), 0 4px 12px -4px rgba(30, 122, 145, 0.12)",
        "lagoon-glow":  "0 0 40px -8px rgba(76, 191, 159, 0.45)",
      },
      backgroundImage: {
        "sunset-gradient": "linear-gradient(135deg, #FFEFC7 0%, #FFC5B0 45%, #B8E1EB 100%)",
        "lagoon-gradient": "linear-gradient(135deg, #CFF0E5 0%, #B8E1EB 55%, #DAF0F5 100%)",
        "coral-gradient":  "linear-gradient(135deg, #FF9C7A 0%, #F55428 100%)",
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
