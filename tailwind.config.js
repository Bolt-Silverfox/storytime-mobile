/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#EC4007",
        "primary-light": "#FFC7CC",
        border: "#4A413F",
        text: "#616161",
        link: "#0731EC",
        black: "#212121",
        "bg-light": "#FFFCFBFB",
        bgLight: "#FFFCFBFB",
        light: "#FAF42",
        disabled: "#FF8771",
        purple: "#4807EC",
        "border-light": "#E0E0E0",
        "border-lighter": "#FAF4F2",
        blue: "#4807EC",
        yellow: "#ECC607",
      },
    },
  },
  plugins: [],
};
