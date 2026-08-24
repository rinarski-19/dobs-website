import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Diocese of Baguio primary blue palette.
      colors: {
        primary: {
          50:  '#f0f7ff',
          100: '#e0efff',
          200: '#baddff',
          300: '#84c1ff',
          400: '#4a9eed',
          500: '#2e86d4',
          600: '#1a6db8',
          700: '#155896',
          800: '#144a7c',
          900: '#153e67',
        },
        gold: {
          400: '#D9BC72',
          500: '#C7A24B',
          600: '#a8862e',
        },
        parchment: {
          50:  '#FFFDF7',
          100: '#F7F3EA',
          200: '#EDE5D0',
          300: '#DED5C4',
          400: '#D8CEB8',
        },
        crimson: {
          700: '#8F3A3A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
