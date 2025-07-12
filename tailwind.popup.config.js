import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './public/*.html'
  ],
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
}; 