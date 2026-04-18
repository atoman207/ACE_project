import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#b94047",
          50: "#fdf3f3",
          100: "#fbe5e6",
          200: "#f7cfd1",
          300: "#efacaf",
          400: "#e47c81",
          500: "#d4555b",
          600: "#b94047",
          700: "#9a333a",
          800: "#802d33",
          900: "#6b2a2f",
          950: "#3a1214",
        },
        ink: {
          DEFAULT: "#1f2328",
          soft: "#4a5057",
          muted: "#6b7280",
          faint: "#9ca3af",
        },
        surface: {
          DEFAULT: "#ffffff",
          alt: "#fafafa",
          warm: "#faf6f2",
          line: "#e5e7eb",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          '"Noto Sans JP"',
          "Meiryo",
          "sans-serif",
        ],
        serif: [
          '"Noto Serif JP"',
          '"Hiragino Mincho ProN"',
          "YuMincho",
          "serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 2px 6px rgba(16,24,40,0.04)",
        lift: "0 8px 24px rgba(16,24,40,0.08)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
