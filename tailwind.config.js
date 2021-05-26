module.exports = {
  prefix: '',
  purge: {
    enabled: false,
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    container: {
      center: true
    },
  },
  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
};
