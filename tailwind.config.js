/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f59e0b", // Amber 500
          dark: "#d97706",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
        },
        background: {
          light: "#fffcf5", // Warm beige
          dark: "#030712", // Slate-950 (Midnight)
        },
        surface: {
          light: "#ffffff",
          dark: "#111827", // Slate-900 (Deep Indigo-Black)
        }
      }
    },
  },
  plugins: [],
}

