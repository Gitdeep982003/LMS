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
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#FCFBF7",
          100: "#FAF5EC",
          200: "#F2E6CE",
          300: "#E5D0A6",
          400: "#D4B87C",
          500: "#C59B63", // Kalaivani Signature Brand Gold
          600: "#B88A44",
          700: "#966D2F",
          800: "#755220",
          900: "#543A18",
        },
        obsidian: {
          DEFAULT: "#0C141F", // Deep Midnight Obsidian from landing page
          hover: "#16202E",
          light: "#222D3E",
        },
        warm: {
          50: "#FAF8F5", // Warm Ivory Background
          100: "#F5F1E9",
          200: "#EAE4D9", // Subtle stone border
          300: "#DDD4C4",
          400: "#C2B59F",
        },
        primary: {
          DEFAULT: "#0C141F",
          hover: "#16202E",
          gold: "#C59B63",
          light: "#FAF5EC",
        },
        emerald: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#ecfdf5",
        },
      },
      fontFamily: {
        poppins: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
        sans: ["'Poppins'", "var(--font-poppins)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
        display: ["'Poppins'", "var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(12, 20, 31, 0.04), 0 1px 2px -1px rgba(12, 20, 31, 0.04)",
        "card-hover": "0 8px 16px -2px rgba(197, 155, 99, 0.12), 0 4px 6px -4px rgba(12, 20, 31, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
