module.exports = {
  prefix: '',
  content: [
    './src/**/*.{html,ts,scss}',
    './sndvll-lib/sndvll-core/purgecss-safelist.txt'
  ],
  darkMode: 'media', // or 'media' or 'class'
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
  variants: {
    extend: {
      invert: ['dark']
    }
  },
  plugins: [require('@tailwindcss/typography')({
    modifiers: ['sm']
  })],
};
