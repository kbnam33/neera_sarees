/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        'soft-beige': '#F7F4EF',
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
      textShadow: {
        'glow': '0px 2px 15px rgba(0,0,0,0.5)',
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
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        fadeInDown: 'fadeInDown 0.8s ease-out forwards',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow-glow': {
          textShadow: theme('textShadow.glow'),
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

