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
        'lime': '#E8FFF2',
        'lime-hover': '#F4FFF9',
        'purple-dark': '#170022',
        'purple-dark-hover': '#380152'
      },
      dropShadow: {
        'hard-small': '6px 6px 0 rgba(0,0,0,1.0)',
        'hard-small-light': '6px 6px 0 rgba(255,255,255,1.0)',
        'hard': '12px 12px 0 rgba(0,0,0,1.0)',
        'hard-light': '12px 12px 0 rgba(255,255,255,1.0)'
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}
