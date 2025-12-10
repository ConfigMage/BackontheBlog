import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#0d1117",
          surface: "#161b22",
          border: "#30363d",
          accent: "#58a6ff",
          text: "#c9d1d9",
          muted: "#8b949e",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
