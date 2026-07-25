import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca — Guía de Marca El Charcu
        forest: {
          DEFAULT: '#2D4A3E', // Verde Bosque
          dark: '#233b31',
          light: '#3a5f50',
        },
        terracota: {
          DEFAULT: '#C17A5A',
          dark: '#a8664a',
        },
        cream: '#F4F1EB',
        sage: '#7A9E8E',
        cocoa: '#1E1612', // Marrón Oscuro
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      letterSpacing: {
        eyebrow: '0.28em',
      },
    },
  },
  plugins: [],
};

export default config;
