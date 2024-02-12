import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          ["dark-hover"]: colors.neutral[800],
        },
        primary: {
          DEFAULT: "#FFD700",
          hover: colors.amber[400],
        },
        error: {
          DEFAULT: "#dc3545",
        },
        brown: {
          DEFAULT: "#52493e",
          dark: "#433c32",
        },
        orange: {
          DEFAULT: "#f06f25",
        },
      },
    },
  },
  plugins: [],
};
