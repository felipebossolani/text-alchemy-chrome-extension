import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/popup/**/*.{js,ts,jsx,tsx,html}'],
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
}; 