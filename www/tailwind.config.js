module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#1A1D1F",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      primary: "#D3D4DB",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
    extend: {
      colors: {
        blue: {
          50: '#EDEFFF',
          100: '#E0E7FF',
          200: '#C7CCFF',
          300: '#A0A8FA',
          400: '#818CF7',
          500: '#5A69EB',
          600: '#4959EB',
          700: '#4338CA',
          800: '#313DA3',
          900: '#2F3782'
        },
        elevation: {
          0: '#1A1D1F',
          1: '#202529',
          2: '#242A2E',
          3: '#2F373D'
        },
        gray: {
          50: '#F5F6FA',
          100: '#F0F1F7',
          200: '#E6E7F0',
          300: '#D3D4DB',
          400: '#9597A6',
          500: '#737480',
          600: '#4D4F5C',
          700: '#3C3D47',
          800: '#2B2C33',
          850: '#1D2124',
          900: '#1A1D1F',
        }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
