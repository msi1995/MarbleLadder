/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '128': '32rem',
        '160': '40rem',
        '192': '48rem',
      },
    },
  },
  plugins: [],
}

