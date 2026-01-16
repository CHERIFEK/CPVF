/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        soft: {
          50: '#fdfbf7',
          100: '#f7f3e8',
          200: '#efe5cd',
          300: '#e5d0a6',
          400: '#d9b678',
          500: '#ce9d52',
          600: '#b58040',
          700: '#916135',
          800: '#774e31',
          900: '#63402d',
        },
        mint: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
        },
        salmon: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
        }
      }
    },
  },
  plugins: [],
}