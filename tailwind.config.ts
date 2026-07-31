import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f6cbd",
          dark: "#0a4d87",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
