/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#9d7fdb", // lavender
          dark: "#8a6bd2",    // darker lavender
          light: "#b29ae5",   // lighter lavender
        },
        secondary: {
          DEFAULT: "#f3f4f6", // light gray
          dark: "#e5e7eb",    // slightly darker gray
        },
        destructive: {
          DEFAULT: "#ef4444", // red-500
          dark: "#dc2626",    // red-600
        },
        muted: {
          DEFAULT: "#f3f4f6", // light gray
          foreground: "#6b7280", // medium gray
        },
        background: {
          DEFAULT: "#ffffff", // white for light mode
          dark: "#121212",    // dark gray for dark mode
        },
        foreground: {
          DEFAULT: "#1f2937", // dark gray for light mode
          dark: "#e5e7eb",    // light gray for dark mode
        },
        accent: {
          DEFAULT: "#e9e2f5", // very light lavender
          dark: "#4a3a70",    // deep lavender
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
