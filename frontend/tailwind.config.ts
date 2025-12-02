// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          // Softer cyan accent (for subtle UI & hover states)
          light: "#5AF2FF",
          // Main brand cyan (buttons, links, key accents)
          primary: "#00E5FF",
          // Very dark “brand” color – good for text on yellow/orange
          dark: "#020617", // roughly slate-950

          // Warm highlight options that still fit the sci-fi theme
          yellow: "#FACC15", // tailwind yellow-400
          orange: "#FB923C", // tailwind orange-400
        },
        earth: {
          // Main page background
          olive: "#111827", // very dark, almost black
          // Section background (slightly lighter)
          forest: "#0B1220", // like a deep indigo / panel bg
          // Main light text color
          cream: "#E2E8F0", // slate-200
          // Secondary panel / card background
          sand: "#1E293B", // slate-800-ish
          // Muted text / subtle accents
          clay: "#1f2933", // slate-400
        },
      },
    },
  },
  plugins: [],
};

export default config;
