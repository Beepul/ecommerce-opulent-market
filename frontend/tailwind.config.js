/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'noto': ['Noto Sans','sans-serif']
    },
    extend: {
      container: {
        center: true,
        padding: 20,
        screens: {
          sm:"1024px",
          md:"1024px",
          lg:"1024px",
          xl: "1296px",
        }
      },
      colors: {
        primary: '#67ad5c',
        textPrimary: '#2c3338',
        textSecondary: '#757575',
        bgGray: '#F4F4F4'
      }
    },
  },
  plugins: [],
}

