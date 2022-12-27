/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  safelist: ["bg-blue-400", "bg-red-400", "bg-green-400"],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },

    extend: {},
  },
  plugins: [],
};
