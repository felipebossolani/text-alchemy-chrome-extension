/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/popup/popup.css'],
  // eslint-disable-next-line import/no-unresolved, global-require
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
