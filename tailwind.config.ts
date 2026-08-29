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
        // Birthday palette — pastels paired with the diocesan navy.
        // All are light tones. Use them for backgrounds, borders, rings and
        // icons, or as TEXT ONLY on a navy ground (primary-700+), where they
        // clear 10:1. None of them are legible as text on white.
        'buttercup-sky': '#FFF2B2',
        'sunwashed':     '#FFE08A',
        'cloud-puff':    '#FFF7D6',
        'dewy-blue':     '#A8C6E7',
        'morning-breeze':'#7FA8D6',
      },
      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        diocesan: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 40, 65, 0.04), 0 6px 20px -12px rgba(16, 40, 65, 0.18)',
      },
      // Birthday section motion. Applied through the `motion-safe:` variant so
      // anyone with reduced-motion enabled gets the section rendered static.
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-7px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.4',  transform: 'scale(1) rotate(0deg)' },
          '50%':      { opacity: '0.95', transform: 'scale(1.15) rotate(8deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(12deg)' },
          '50%':      { transform: 'translate(-6px, -5px) rotate(4deg)' },
        },
        'rise-in': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Radiant blobs: the inner element breathes (scale + glow), the outer
        // wrapper wanders. Split across two elements so the transforms compose
        // instead of overwriting each other.
        radiate: {
          '0%, 100%': { transform: 'scale(0.92)', opacity: '0.45' },
          '50%':      { transform: 'scale(1.16)', opacity: '0.95' },
        },
        'blob-drift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%':      { transform: 'translate(20px, -16px)' },
          '66%':      { transform: 'translate(-16px, 14px)' },
        },
      },
      animation: {
        float:     'float 6s ease-in-out infinite',
        twinkle:   'twinkle 3.2s ease-in-out infinite',
        drift:     'drift 8s ease-in-out infinite',
        'rise-in': 'rise-in 0.5s ease-out both',
        radiate:      'radiate 7s ease-in-out infinite',
        'blob-drift': 'blob-drift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
