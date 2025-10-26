/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF8EE',
        'dark-brown': '#1E1A18',
        'mustard': '#FFB000',
        'teal': '#00C2B2',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        'shake-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        tada: {
            '0%': { transform: 'scale(1)' },
            '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
            '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
            '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
            '100%': { transform: 'scale(1) rotate(0)' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'mascot-correct': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '20%': { transform: 'translateY(-10px) scale(1.1) rotate(-5deg)' },
          '40%': { transform: 'translateY(0) scale(0.95)' },
          '60%': { transform: 'translateY(-5px) scale(1.05) rotate(5deg)' },
          '80%': { transform: 'translateY(0) scale(1)' },
        },
        'mascot-incorrect': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px) rotate(-3deg)' },
          '40%, 80%': { transform: 'translateX(4px) rotate(3deg)' },
        },
        'mascot-wowed': {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.2) rotate(5deg)' },
          '60%': { transform: 'scale(0.9) rotate(-5deg)' },
          '80%': { transform: 'scale(1.1)' },
        },
        'mascot-sad': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(5px) rotate(-2deg)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out both',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'shake-horizontal': 'shake-horizontal 0.5s cubic-bezier(.36,.07,.19,.97) both',
        tada: 'tada 1s ease-in-out',
        'bounce-in': 'bounce-in 0.6s ease-out both',
        'gentle-bounce': 'gentle-bounce 2.5s ease-in-out infinite',
        'mascot-correct': 'mascot-correct 0.8s ease-in-out',
        'mascot-incorrect': 'mascot-incorrect 0.6s ease-in-out',
        'mascot-wowed': 'mascot-wowed 0.7s ease-in-out',
        'mascot-sad': 'mascot-sad 1s ease-in-out',
      }
    }
  },
  plugins: [],
}
