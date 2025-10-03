import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class", 
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-m)', 'sans-serif'],
      },
      screens: {
        'max-xs': { max: '399px' }, 
      },
    },
  },
  plugins: [],
}

export default config
