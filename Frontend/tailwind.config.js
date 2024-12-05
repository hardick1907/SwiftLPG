import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        black: {
          ...require("daisyui/src/theming/themes")["black"],
          primary: "#A50000",
          secondary: "#FF4500",
        },
      },
    ],
  },
}