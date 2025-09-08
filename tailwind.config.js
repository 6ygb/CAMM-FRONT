/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // App foundation
        background: '#0a0d14',
        surface: '#12161f',
        'surface-2': '#0b0f19',
        border: '#273043',

        // Type
        foreground: '#e5e7eb',
        'muted-foreground': '#9aa4b2',

        // Brand
        primary: {
          DEFAULT: '#d3b753',         // muted gold (base)
          foreground: '#0a0d14',
          50: '#fff8db',
          100: '#fff0b6',
          200: '#f5e38c',
          300: '#e8cf6b',             // use this for buttons
          400: '#d3b753',             // text/accents
          500: '#b79c3e',
          600: '#937a2f',
          700: '#6f5c23',
          800: '#4b3f17',
          900: '#2f2710'
        },
      },
      boxShadow: {
        soft: '0 10px 20px -10px rgba(0,0,0,0.4)'
      }
    }
  },
  plugins: []
}
