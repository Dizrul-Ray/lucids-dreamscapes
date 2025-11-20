/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lucid: {
          900: '#0c0a09', // Stone 950 (Background)
          800: '#1c1917', // Stone 900 (Panels)
          700: '#292524', // Stone 800 (Borders/Accents)
          600: '#44403c', // Stone 700 (Hover)
          accent: '#d97706', // Amber 600 (Campfire Glow)
          accentHover: '#b45309', // Amber 700
          blood: '#7f1d1d', // Red 900
          parchment: '#e7e5e4', // Stone 200
          glass: 'rgba(12, 10, 9, 0.7)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 3s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '25%': { opacity: '0.9' },
          '75%': { opacity: '0.85' },
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}