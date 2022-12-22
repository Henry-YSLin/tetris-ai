module.exports = {
  content: [
    './src/*.js',
    './src/*.jsx',
    './src/**/*.jsx',
    './src/**/*.js',
    './src/*.ts',
    './src/*.tsx',
    './src/**/*.tsx',
    './src/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
