import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#20241f",
        parchment: "#f7f3e7",
        copper: "#b16b2b",
        moss: "#4c7a30",
        tide: "#247b8a",
        sky: "#4aa9df",
        meadow: "#6f9f2e",
        sun: "#f2c14e",
        flower: "#d94b35",
        steel: "#4b5963"
      },
      boxShadow: {
        atlas: "0 20px 60px rgba(30, 42, 44, 0.18)",
        fluent: "0 8px 24px rgba(32, 36, 31, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
