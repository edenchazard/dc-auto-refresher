/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // super small!
        'xxs': '300px',
        // basically a size we specify when to "uncollapse stuff"
        'minsz': '390px',
        'mid-sz': '450px',
        'menu-big': '309px'
      },
    },
  },
  plugins: [],
};
