import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Seawater blue — the signature accent
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
          DEFAULT: "#2A93AB",   // seawater 500
          dark: "#1A6377",      // seawater 700
        },
        // Warm sand accent for occasional highlights
        sand: {
          50: "#FBF7F0",
          100: "#F4EBDA",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
