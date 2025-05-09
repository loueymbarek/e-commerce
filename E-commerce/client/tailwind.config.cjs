/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {

      colors:{
        pending:'#FF9533',
        delivred:"#39DE54"
      },
      backgroundImage: {
      'my-image': "url('/src/assets/test.jpg')"
    }
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['winter', 'dracula'],
  },
};
