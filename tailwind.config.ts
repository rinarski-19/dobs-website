import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Brand colors — soft blue palette
      // ⚠️ Exact shade TBD — update when official brand is confirmed
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
