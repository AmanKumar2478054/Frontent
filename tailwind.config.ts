import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'spin-reverse': 'spin-reverse 3s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
