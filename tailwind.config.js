/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          blue: '#5865F2',
          blueHover: '#4752C4',
          gray: {
            100: '#f2f3f5',
            200: '#ebedef',
            300: '#e3e5e8',
            400: '#80848e',
            500: '#4e5058',
            600: '#313338',
            700: '#2b2d31',
            800: '#1e1f22',
            900: '#111214',
          }
        }
      },
      fontFamily: {
        sans: ['"gg sans"', 'Noto Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
