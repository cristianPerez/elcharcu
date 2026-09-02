'use client';

import { useEffect, type ReactNode } from 'react';

import { reportError } from '@/shared/lib';

interface GlobalErrorProps {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
}

/**
 * El último recurso: cuando revienta el propio layout raíz.
 *
 * ⚠️ SUSTITUYE AL `<html>` ENTERO, así que tiene que traer sus propias etiquetas
 * `html` y `body`. Es la única pantalla del proyecto que no puede apoyarse en
 * nada de lo de arriba — ni providers, ni fuentes cargadas por `next/font`, ni
 * los estilos globales, porque justo eso es lo que puede haber fallado.
 *
 * Por eso va con estilos EN LÍNEA y con familias de fuente del sistema. Usar
 * clases de Tailwind aquí sería apostar a que la hoja de estilos cargó, que es
 * precisamente lo que no se puede dar por hecho en esta pantalla.
 *
 * Se distingue de `error.tsx`: aquel cubre los fallos dentro del árbol y sí
 * tiene layout; este solo aparece si se cae el cimiento.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps): ReactNode {
  useEffect(() => {
    reportError('navegador', 'el layout raíz reventó', {
      digest: error.digest,
      name: error.name,
      detail: error.message,
    });
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#F4F1EB',
          color: '#1E1612',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <main style={{ maxWidth: '32rem' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              lineHeight: 1.2,
              color: '#2D4A3E',
            }}
          >
            El Charcu no pudo cargar
          </h1>
          <p style={{ marginTop: '16px', fontSize: '17px', lineHeight: 1.6 }}>
            Algo se rompió antes de que la página existiera. No perdiste nada. Vuelve a
            intentarlo y, si sigue igual, escríbenos a hola@elcharcu.co.
          </p>

          {error.digest === undefined ? null : (
            <p style={{ marginTop: '16px', fontSize: '13px', opacity: 0.65 }}>
              Código para pasarnos: <code>{error.digest}</code>
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '28px',
              border: 0,
              borderRadius: '999px',
              padding: '14px 26px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#FBFAF7',
              backgroundColor: '#A8654A',
              cursor: 'pointer',
            }}
          >
            Volver a intentar
          </button>
        </main>
      </body>
    </html>
  );
}
