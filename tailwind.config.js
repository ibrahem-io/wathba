/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'saudi-green': '#1B5E20',
        'saudi-green-light': '#2E7D32',
        'saudi-green-dark': '#0D4E14',
        'saudi-gold': '#FFB300',
        'saudi-gold-light': '#FFC107',
        'saudi-gold-dark': '#FF8F00',
        'saudi-gray': '#F5F5F5',
        'saudi-text': '#212121',
        'saudi-text-light': '#757575',
      },
      fontFamily: {
        'arabic': ['Noto Sans Arabic', 'Tahoma', 'Arial', 'sans-serif'],
        'english': ['Roboto', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};