import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Override white so text-white, border-white/10 etc. flip with theme
        white: "rgb(var(--gt-fg) / <alpha-value>)",
        // Semantic aliases (black stays true black — used for text-black on accent buttons)
        background: "rgb(var(--gt-bg) / <alpha-value>)",
        surface: "rgb(var(--gt-surface) / <alpha-value>)",
        foreground: "rgb(var(--gt-fg) / <alpha-value>)",
        muted: "rgb(var(--gt-muted) / <alpha-value>)",
        accent: "#F9FF00",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Trade Gothic Condensed"', '"Trade Gothic"', "system-ui", "sans-serif"],
        headline: ['"Trade Gothic"', "system-ui", "sans-serif"],
        secondary: ["Lato", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(249, 255, 1, 0.2)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
