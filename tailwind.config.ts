import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: "var(--notion-bg)",
          "bg-secondary": "var(--notion-bg-secondary)",
          "bg-hover": "var(--notion-bg-hover)",
          text: "var(--notion-text)",
          "text-secondary": "var(--notion-text-secondary)",
          "text-tertiary": "var(--notion-text-tertiary)",
          border: "var(--notion-border)",
          accent: "var(--notion-accent)",
          "accent-hover": "var(--notion-accent-hover)",
          sidebar: "var(--notion-sidebar)",
          "sidebar-hover": "var(--notion-sidebar-hover)",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif", "-apple-system", "BlinkMacSystemFont",
          "Segoe UI", "Helvetica", "Apple Color Emoji", "Arial",
          "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol",
        ],
      },
      fontSize: {
        "page-title": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
      },
      maxWidth: {
        "page-content": "900px",
      },
    },
  },
  plugins: [],
};

export default config;
