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
        'neera-bg': '#F2EDE6',
        'neera-bg-deep': '#EBE4DC',
        'neera-text': '#2C2420',
        'neera-text-soft': '#7A6E68',
        'neera-text-muted': '#A89E98',
        'neera-accent': '#5C1F2E',
        'neera-accent-soft': '#8B3A4A',
        'neera-border': '#DDD6CE',
        'neera-white': '#FAF7F4',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['"Times New Roman"', 'serif'],
      },
      textShadow: {
        'glow': '0px 2px 15px rgba(0,0,0,0.5)',
      },
      scale: {
        '103': '1.03',
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

