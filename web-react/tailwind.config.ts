import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF9',
          100: '#F7F5F2',
          200: '#EAE5DC',
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 1s ease-out forwards',
        'scroll-testimonials': 'scroll-testimonials 80s linear infinite',
        'scroll-logos': 'scroll-logos 40s linear infinite',
        'wheel': 'wheel-rotate 15s linear infinite',
        'infinite-scroll-1': 'scroll-row-1 40s linear infinite',
        'infinite-scroll-2': 'scroll-row-2 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-testimonials': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-logos': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'wheel-rotate': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-50% - 2rem))' },
        },
        'scroll-row-1': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 1rem))' },
        },
        'scroll-row-2': {
          '0%': { transform: 'translateX(calc(-50% - 1rem))' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    }
  },
  plugins: []
};

export default config;
