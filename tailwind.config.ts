// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-m)', 'sans-serif'], // This is correct
      },
    },
  },
  plugins: [],
}

export default config
