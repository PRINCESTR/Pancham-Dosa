/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        gold: '#D4AF37',
        deepBrown: '#3E2723',
        softOrange: '#FF9800',
        logoGreen: '#2D7521',
        logoLightGreen: '#85B638'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
