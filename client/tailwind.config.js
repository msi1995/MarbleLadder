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
      width: {
        '128': '32rem',
        '160': '40rem',
        '192': '48rem',
      },
      brightness: {
        25: '.25',
        20: '.20',
        15: '.15',
        10: '.10',
      }
    },
  },
  plugins: [],
}

