/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hufflepuff color palette
        hufflepuff: {
          yellow: '#F0C75E',
          gold: '#DAA520',
          'dark-gold': '#B8860B',
          brown: '#704214',
          'dark-brown': '#4A2C0F',
          cream: '#FFF8DC',
          'warm-brown': '#8B4513',
          tan: '#D2B48C',
        }
      }
    },
  },
  plugins: [],
}

