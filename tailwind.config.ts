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
        cream: {
          DEFAULT: '#F4F1EB', // superficie de página
          white: '#FFFFFF', // superficie de tarjeta, un nivel por encima
        },
        sage: '#7A9E8E',
        cocoa: '#1E1612', // Marrón Oscuro
      },
      /**
       * Profundidad en superficies claras.
       *
       * No se añade ningún color a la paleta: la sombra es `cocoa` con muy
       * poca opacidad, así que la página se ve a tres niveles sin salirse de
       * la Guía de Marca. Un solo tono plano era el problema principal.
       */
      boxShadow: {
        surface: '0 1px 3px rgba(30, 22, 18, 0.06)',
        raised: '0 1px 3px rgba(30, 22, 18, 0.08), 0 8px 24px rgba(30, 22, 18, 0.06)',
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
