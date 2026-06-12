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
        ink: "#1f2a24",
        parchment: "#f4efe0",
        copper: "#9f5930",
        moss: "#526846",
        tide: "#2f6f73"
      },
      boxShadow: {
        atlas: "0 18px 60px rgba(31, 42, 36, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
