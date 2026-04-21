import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        emerald: {
          DEFAULT: "#006400",
          light: "#008800",
          deep: "#004000",
        },
        gold: {
          DEFAULT: "#D4AF77",
          light: "#E8C97A",
          dark: "#B8945A",
        },
        charcoal: "#1A1A18",
        dark: "#111111",
        "mid-gray": "#6B6B5E",
        "light-gray": "#D1D1C7",
        warm: "#FAF8F3",
        ivory: "#FEFDFC",
        cream: "#F4F0E6",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "sans-serif"],
        urdu: ["Noto Nastaliq Urdu", "serif"],
      },
      fontSize: {
        "2xs": "0.6875rem",
      },
      letterSpacing: {
        widest2: "0.15em",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.04)",
        deep: "0 12px 40px rgba(0,20,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
