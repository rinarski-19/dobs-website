import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Diocese of Baguio supporting palette; buttons use the main diocesan blue.
      colors: {
        primary: {
          50:  '#f0f4f0',
          100: '#d6e4da',
          200: '#adc9b6',
          300: '#7aaa8e',
          400: '#4e8c6d',
          500: '#285943',  // forest green — main
          600: '#1e4433',
          700: '#163324',
          800: '#16324F',  // deep navy — headings
          900: '#0f2035',
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
