/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          dark: "#2563eb",    // blue-600
          light: "#60a5fa",   // blue-400
        },
        secondary: {
          DEFAULT: "#f3f4f6", // gray-100
          dark: "#e5e7eb",    // gray-200
        },
        destructive: {
          DEFAULT: "#ef4444", // red-500
          dark: "#dc2626",    // red-600
        },
        muted: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#6b7280", // gray-500
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
