/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#09080D",
          200: "#3a393b",
        },
        secondary: {
          100: "#fff",
          200: "#1F2932",
        },

        tertiary: {
          100: "#2954F1",
        },
        danger: {
          100: "#ef4444",
        },
      },

      backgroundColor: {
        danger: {
          100: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
