'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';

import { reportError } from '@/shared/lib';

interface ErrorPageProps {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
}

/**
 * Lo que se ve cuando algo revienta al pintar una pantalla.
 *
 * ⚠️ Hasta hoy no existía. Un fallo de render enseñaba la pantalla por defecto
 * de Next —en inglés, sin salida y sin la marca— y **no quedaba registrado en
 * ningún sitio**: ni en Vercel, porque el error ocurre en el navegador, ni en
 * Mixpanel, que solo sabe de eventos de producto. Se perdía entero.
 *
 * Hace dos cosas, y las dos importan:
 *
 *   1. **Lo apunta**, por `reportError`, que es el único sitio por donde saldrá
 *      hacia Datadog cuando esté conectado.
 *   2. **Da salida.** Reintentar arregla lo que fue un tropiezo pasajero, y si
 *      no, hay un enlace a la portada. Un callejón sin salida hace que la gente
 *      cierre y no vuelva.
 *
 * ⚠️ `digest` es lo ÚNICO que Next deja ver del error en producción: el mensaje
 * real se queda en el servidor a propósito, para no filtrar detalles internos
 * al navegador. Por eso se enseña — es lo que permite cruzar lo que vio esta
 * persona con el log del servidor.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps): ReactNode {
  useEffect(() => {
    reportError('navegador', 'la pantalla no se pudo pintar', {
      digest: error.digest,
      name: error.name,
      // El mensaje va sin la traza: en producción Next ya lo reemplaza por uno
      // genérico, y en desarrollo la traza entera está en la consola.
      detail: error.message,
    });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-16 text-cocoa">
      <p className="text-[11px] uppercase tracking-eyebrow text-terracota">
        Se nos rompió algo
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
        Esta pantalla no cargó
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-cocoa/70">
        No es culpa tuya y no perdiste nada. Vuelve a intentarlo; si sigue igual,
        escríbenos a hola@elcharcu.co y lo miramos.
      </p>

      {error.digest === undefined ? null : (
        <p className="mt-4 text-xs text-cocoa/55">
          Si nos escribes, pásanos este código: <code>{error.digest}</code>
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-terracota-dark px-6 py-3 font-medium text-cream-white shadow-surface transition-shadow hover:shadow-raised"
        >
          Volver a intentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-cocoa/15 px-6 py-3 font-medium text-cocoa/80 transition-colors hover:bg-cream"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
