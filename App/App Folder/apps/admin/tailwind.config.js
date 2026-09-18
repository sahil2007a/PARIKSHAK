/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parishak: {
          50: '#E8F8F5',
          100: '#D1F2EB',
          200: '#A3E4D7',
          300: '#76D7C4',
          400: '#48C9B0',
          500: '#16A085',
          600: '#138D75',
          700: '#117A65',
          800: '#0E6655',
          900: '#0B5345'
        },
        darkText: '#14213D',
        brandBg: '#F5F8F7',
        mutedText: '#7A8793',
        brandBorder: '#E1E8E6'
      }
    },
  },
  plugins: [],
}
