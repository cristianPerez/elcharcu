'use client';

import { useEffect, useState } from 'react';

/** Lo que tarda `brasa-hop` en tailwind.config.ts. Si cambia allí, cambia aquí. */
const DURACION_MS = 1600;

/** Cuánto espera desde que carga la página antes del primer salto. */
const ESPERA_INICIAL_MS = 1200;

/** Cuánto hay que bajar para que se considere que alguien está LEYENDO. */
const SCROLL_MINIMO_PX = 600;

/** Silencio mínimo entre dos saltos. Sin esto, el scroll lo dispara sin parar. */
const DESCANSO_MS = 12_000;

/** Cuántas veces salta como mucho en toda la visita. */
const MAX_SALTOS = 3;

/**
 * Hace que el botón flotante pegue un salto en dos momentos: al entrar a la
 * página, y cuando alguien lleva un rato bajando por la receta.
 *
 * ⚠️ POR QUÉ ESTÁ LIMITADO A TRES. El botón lleva desde el 2026-09-01 en la
 * esquina y casi nadie lo toca: de 17 personas, 10 no han preguntado nunca. El
 * problema no es que no se vea —se ve— sino que no parece que haga nada. Un
 * salto lo delata como algo vivo.
 *
 * Pero un botón que se mueve cada vez que bajas es un banner, y el precio de
 * equivocarse aquí es que la receta se vuelva insoportable de leer. Por eso hay
 * tres frenos: un descanso de 12 s entre saltos, un tope de 3 en toda la visita,
 * y se calla para siempre en cuanto alguien abre el chat —ya no hace falta
 * llamarlo.
 *
 * Respeta `prefers-reduced-motion`: quien lo pidió no ve ni el primero.
 */
export function useAttentionHop(silenciar: boolean): boolean {
  const [saltando, setSaltando] = useState(false);

  useEffect(() => {
    if (silenciar) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let saltos = 0;
    let ultimo = 0;
    let temporizador: ReturnType<typeof setTimeout> | undefined;

    const saltar = (): void => {
      const ahora = Date.now();

      if (saltos >= MAX_SALTOS || ahora - ultimo < DESCANSO_MS) {
        return;
      }

      saltos += 1;
      ultimo = ahora;
      setSaltando(true);

      temporizador = setTimeout(() => {
        // Hay que QUITAR la clase para poder volver a ponerla: una animación
        // CSS no se reinicia si el elemento nunca deja de tenerla.
        setSaltando(false);
      }, DURACION_MS);
    };

    const inicial = setTimeout(saltar, ESPERA_INICIAL_MS);

    const alBajar = (): void => {
      if (window.scrollY > SCROLL_MINIMO_PX) {
        saltar();
      }
    };

    window.addEventListener('scroll', alBajar, { passive: true });

    return () => {
      clearTimeout(inicial);

      if (temporizador !== undefined) {
        clearTimeout(temporizador);
      }

      window.removeEventListener('scroll', alBajar);
    };
  }, [silenciar]);

  return saltando;
}
