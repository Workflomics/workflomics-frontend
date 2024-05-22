/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "flomics-theme": {
          primary: "#ce4136",
          secondary: "#f6d860",
          accent: "#cd373a",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          ".btn-primary": {
            "color": "#fff"
          }
        },
      },
    ]
  }
}
