/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#cc0000',
          deep: '#8b0000',
          bright: '#ff1a1a',
          light: '#ff6b6b',
          pale: '#fff0f0',
          blush: '#ffe4e4',
        },
        gold: {
          DEFAULT: '#d4a017',
          light: '#f5d76e',
        },
        text: {
          dark: '#2a0a0a',
          mid: '#6b2020',
        }
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'ring-pulse': 'ringPulse 3s ease infinite',
        'float-up': 'floatUp 7s ease-in infinite',
        'hero-in': 'heroIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both',
        'btn-pulse': 'btnPulse 2.5s ease infinite',
        'bubble-in': 'bubbleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both',
      },
      keyframes: {
        ringPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.08)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(0) rotate(0deg) scale(0.8)' },
          '8%': { opacity: '0.85' },
          '90%': { opacity: '0.3' },
          '100%': { opacity: '0', transform: 'translateY(-110vh) rotate(22deg) scale(1.2)' },
        },
        heroIn: {
          'from': { opacity: '0', transform: 'translateY(-24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        btnPulse: {
          '0%, 100%': { boxShadow: '0 0 50px rgba(204,0,0,0.6)' },
          '50%': { boxShadow: '0 0 80px rgba(204,0,0,0.9)' },
        },
        bubbleIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}