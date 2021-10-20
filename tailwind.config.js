module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['"Dosis"', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'],
      'heading': [ '"Fredoka One"','"Dosis"', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'],
    },
    extend: { 
      colors:{
        tomato:{
          light: '#ffb2a4',
          DEFAULT: '#f04426',
          dark: '#c4260b',
        },
        green: {
          light: '#aecc7d',
          DEFAULT: '#79a72f',
          dark: '#749441',
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

