/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#2954F1",
        },
        secondary: {
          100: "#fff",
          200: "#1F2932",
        },
      },
    },
  },
  plugins: [],
};
