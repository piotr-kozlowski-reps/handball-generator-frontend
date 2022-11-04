/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      appInFocus: "#456576",
      appSuccess: "#765372",
      appError: "#c94141",
      appMainBackground: "#FAFBFB",
      appMainDarkBackground: "#20232A",
      appButton: "#3f3408",
      black: "#000",
    },
    fontFamily: {
      display: ["Dosis", "sans-serif"],
      body: ["Dosis", "sans-serif"],
      loading: ["Flow Rounded", "cursive"],
    },
    extend: {
      fontSize: {
        14: "14px",
      },
      backgroundColor: {
        "main-bg": "#FAFBFB",
        "main-dark-bg": "#20232A",
        "secondary-dark-bg": "#33373E",
        "light-gray": "#F7F7F7",
        "half-transparent": "rgba(0, 0, 0, 0.5)",
      },
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      width: {
        400: "400px",
        760: "760px",
        780: "780px",
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1400: "1400px",
      },
      height: {
        80: "80px",
      },
      minHeight: {
        590: "590px",
      },
      backgroundImage: {
        "hero-pattern":
          "url('https://res.cloudinary.com/dn8l30dkf/image/upload/v1656488020/korsol-dashboard/landscape-agriculture_ydgpqf.png')",
      },
      zIndex: {
        max: "10000001",
      },
      scale: {
        101: "1.015",
      },
    },
  },
  plugins: [],
};
