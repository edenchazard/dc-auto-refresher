module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // super small!
        'xxs': '300px',
        // basically a size we specify when to "uncollapse stuff"
        'minsz': '390px',
        'mid-sz': '450px',
      },
    },
  },
  plugins: [],
};
