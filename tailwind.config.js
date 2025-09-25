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
        'deep-maroon-dark': '#4a1528',
        'lotus-gold': '#C9A24A',
        'charcoal-gray': '#3A3A3A',
        'charcoal-gray-dark': '#2c2c2c',
        'brand-dark': '#121212',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['"Times New Roman"', 'serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}