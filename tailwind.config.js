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
        'purple-light': '#8C1FBF',
        'lime': '#E8FFF2'
      },
      dropShadow: {
        'hard': '12px 12px 0 rgba(0,0,0,1.0)',
        'hard-light': '12px 12px 0 rgba(255,255,255,1.0)'
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}
