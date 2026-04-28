/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};
