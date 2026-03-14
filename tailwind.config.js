/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#f97316', dark: '#ea580c', light: '#fb923c' },
        dark: { DEFAULT: '#0f0f0f', card: '#1a1a2e', lighter: '#16213e', border: '#2d2d4e' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    },
  },
  plugins: [],
}
