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
        dungeon: {
          dark: '#0f1117',
          panel: '#1a1d26',
          card: '#222634',
          border: '#333a4d',
          gold: '#eab308',
          accent: '#6366f1',
          crimson: '#dc2626',
          emerald: '#10b981',
          azure: '#0284c7'
        }
      }
    },
  },
  plugins: [],
}
