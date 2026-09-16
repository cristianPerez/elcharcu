import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
          Paleta de marca — Guía de Marca El Charcu (revisada 2026-09-16).

          Dos familias y nada más: VERDE BOSQUE para los fondos —la raíz— y
          NARANJA BRASA para lo que se toca —la calidez—. El naranja es una
          RAMPA de cuatro pasos, no un color, y cada paso tiene un trabajo:

          · `light`  (#F5A87F) resalte sobre fondo OSCURO, donde el brasa ya es
                     demasiado parecido al fondo para separarse.
          · DEFAULT  (#EE8B5D) el relleno de los botones y lo que debe saltar.
          · `dark`   (#C96A3C) el estado hover/pressed de ese relleno.
          · `tinta`  (#9C4A22) el naranja como TEXTO sobre fondo claro.

          ⚠️ LA RAMPA EXISTE POR CONTRASTE, no por gusto. Sobre crema, el brasa
          da 2,2:1 — ilegible como texto (AA pide 4,5:1). La tinta da 5,45:1 y
          sí pasa. Y al revés: texto BLANCO sobre brasa da 2,48:1 y NO se puede
          usar; sobre brasa va texto `cocoa`, que da 7,2:1. Por eso el botón
          principal es naranja con letra oscura y no naranja con letra blanca,
          que era lo primero que uno haría.
        */
        forest: {
          DEFAULT: '#2D4A3E', // Verde Bosque
          dark: '#233B31', // Bosque Oscuro
          light: '#3A5F50',
        },
        brasa: {
          light: '#F5A87F', // Naranja Claro
          DEFAULT: '#EE8B5D', // Naranja Brasa
          dark: '#C96A3C', // Naranja Oscuro
          tinta: '#9C4A22', // Naranja Tinta
        },
        /*
          `terracota` es ahora un ALIAS de la rampa, no una familia aparte.

          Se queda porque está escrito en 139 sitios y renombrarlos de golpe
          sería un diff imposible de revisar sobre algo que solo cambia de
          color. Apunta a los dos pasos que sirven en superficie clara, que es
          donde vive casi todo su uso: 66 de esos 139 son `text-terracota`, y
          con el brasa puro se habrían vuelto ilegibles.

          No añadas usos nuevos: en código nuevo se escribe `brasa`.
        */
        terracota: {
          DEFAULT: '#C96A3C', // = brasa.dark
          dark: '#9C4A22', // = brasa.tinta
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
      /**
       * La barrita que corre por el borde de una tarjeta recién tocada.
       *
       * Va de -100% a 400% y no de 0 a 100: así entra desde fuera y sale por
       * el otro lado, que es lo que hace que se lea como "está pasando algo"
       * en vez de como una barra de progreso que miente sobre cuánto falta.
       */
      keyframes: {
        'nav-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        /*
          El saltito del botón flotante.

          Sube 6 px y vuelve, dos veces, con una pausa larga en medio (del 40 %
          al 100 % no pasa nada). Esa pausa es lo que lo separa de un botón que
          "vibra": llama una vez y se queda quieto.

          No escala ni cambia de color — solo se mueve. Un botón que crece
          tapa lo que tiene debajo justo cuando alguien está leyendo.
        */
        'brasa-hop': {
          '0%, 40%, 100%': { transform: 'translateY(0)' },
          '12%': { transform: 'translateY(-6px)' },
          '24%': { transform: 'translateY(0)' },
          '32%': { transform: 'translateY(-3px)' },
        },
        /* El halo que sale del botón, una vez, para reforzar el salto. */
        'brasa-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'brasa-hop': 'brasa-hop 1.6s ease-in-out',
        'brasa-ring': 'brasa-ring 1.6s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
