/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#1e3a8a',
        'brand-blue': '#3b82f6',
        'brand-light': '#dbeafe',
        'brand-baby': '#93c5fd',
        'prosperity-navy': '#0f172a',
        'prosperity-blue': '#1e40af',
        'prosperity-light': '#eff6ff',
        'prosperity-accent': '#60a5fa'
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['Poppins', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}