/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Source Sans Pro', 'sans-serif'],
      'mono': ['Source Code Pro', 'ui-monospace']
    },
    extend: {
      colors: {
        'purple': '#3C0059'
      },
      dropShadow: {
        'hard': '12px 12px 0 rgba(0,0,0,1.0)'
      }
    },
  },
  plugins: [],
}
