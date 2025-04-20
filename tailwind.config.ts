// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // ⬅️ THIS LINE IS REQUIRED
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#8ECAE6",
          primary: "#219EBC",
          dark: "#023047",
          yellow: "#FFB703",
          orange: "#FB8500",
        },
        earth: {
          olive: "#606C38",
          forest: "#283618",
          cream: "#FEFCC8",
          sand: "#DDA15E",
          clay: "#BC6C25",
        },
      },
    },
  },
  plugins: [],
};

export default config;
