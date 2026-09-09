/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF9F6',
        parchment: '#F4F1EA',
        ink: '#2C2A26',
        sepia: '#6B6356',
        brass: '#B8932E',
        'brass-light': '#D4AF37',
        'brass-dark': '#8A6D1F',
        'warm-gray': '#E6E1D6',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(44, 42, 38, 0.05)',
        'medium': '0 8px 30px rgba(44, 42, 38, 0.08)',
        'brass': '0 4px 20px rgba(184, 147, 46, 0.15)',
      },
      transitionTimingFunction: {
        'oxford': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
