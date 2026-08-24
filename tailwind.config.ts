import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Diocese of Baguio Schools brand system ──
      // primary = deep diocesan navy · gold = liturgical accent
      // parchment = warm surface · forest = supporting green
      colors: {
        primary: {
          50:  '#eff4f9',
          100: '#dbe6f1',
          200: '#b9cee1',
          300: '#8daeca',
          400: '#5c86ab',
          500: '#3a6690',
          600: '#294f72',
          700: '#16324F', // deep navy — main brand
          800: '#112841',
          900: '#0c1c2e',
        },
        gold: {
          50:  '#faf6ea',
          100: '#f2e8cc',
          200: '#e7d4a0',
          300: '#D9BC72',
          400: '#cfa856',
          500: '#C7A24B', // main accent
          600: '#a8862e',
          700: '#876a22',
        },
        parchment: {
          50:  '#FFFDF7',
          100: '#F7F3EA',
          200: '#EDE5D0',
          300: '#DED5C4',
          400: '#D8CEB8',
        },
        forest: {
          400: '#4e8c6d',
          500: '#285943',
          600: '#1e4433',
          700: '#163324',
        },
        crimson: {
          700: '#8F3A3A',
        },
      },
      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        diocesan: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 40, 65, 0.04), 0 6px 20px -12px rgba(16, 40, 65, 0.18)',
      },
    },
  },
  plugins: [],
}

export default config
