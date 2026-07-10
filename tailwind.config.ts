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
        paper: "#F6F5F1",
        ink: "#1E2A22",
        moss: "#3E5641",
        clay: "#B5764A",
        line: "#D8D5CC",
        "sale-lock": "#8B5E3C",
        locked: {
          bg: "#FBF7F2",
          border: "#C9A688",
          placeholder: "#C4A98F",
          badgeBg: "#F2E9E0",
        },
        muted: "#8A8578",
        "muted-2": "#6B6858",
        placeholder: "#B4B0A3",
        danger: { bg: "#F0E5E5", fg: "#9C4A4A" },
        status: {
          trong: { bg: "#E8F0E5", fg: "#3E5641" },
          "dang-thue": { bg: "#F2E9E0", fg: "#B5764A" },
          "dang-sua": { bg: "#F0E5E5", fg: "#9C4A4A" },
          "ngung-cho-thue": { bg: "#E9E7E1", fg: "#6B6858" },
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        field: "8px",
        pill: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
