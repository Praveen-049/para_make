import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aerospace: '#0f172a',
        accent: '#5eead4',
      },
    },
  },
  plugins: [forms],
};
