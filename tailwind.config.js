/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e5e5e5',
        'content-primary': '#262626',
        'content-secondary': '#525252',
        'content-tertiary': '#a3a3a3',
        grape: {
          200: '#ddd6fe',
          600: '#735cf6',
        },
        alert: {
          'positive-bg': '#f0fdf5',
          'positive-text': '#16a34c',
          'warning-bg': '#fff7ed',
          'warning-text': '#ea580c',
          'negative-bg': '#fee2e2',
          'negative-text': '#b91c1c',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
      keyframes: {
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-5px)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'bounce-dot': 'bounce-dot 1.2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
