
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,App,services,types,src}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
