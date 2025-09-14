/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-beige': '#F8F5EF',
        'deep-maroon': '#5B1A32',
        'lotus-gold': '#C9A24A',
        'charcoal-gray': '#3A3A3A',
        'brand-dark': '#121212',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}

