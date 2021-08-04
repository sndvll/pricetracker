module.exports = {
  prefix: '',
  purge: {
    //enabled: false,
    content: [
      './src/**/*.{html,ts,scss}',
      './purgecss-safelist.txt'
    ],
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true
    },
    extend: {
      inset: {
        '-3': '-0.8rem',
        '-2': '-0.6rem',
        '-1': '-0.4rem',
      },
      strokeWidth: {
        '3': '3',
        '4': '4'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')({
    modifiers: ['sm']
  })],
};
