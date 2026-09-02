import { reportError } from './reportError';

/**
 * Escucha lo que revienta en el navegador FUERA de React.
 *
 * ⚠️ Los `error.tsx` de Next solo atrapan lo que falla al PINTAR. Todo lo demás
 * —una promesa que nadie capturó, un error dentro de un `setTimeout`, un
 * manejador de evento que lanza— no pasa por React y hasta hoy desaparecía sin
 * dejar rastro: no llega a los logs de Vercel, porque ocurre en el navegador, y
 * no llega a Mixpanel, que solo sabe de eventos de producto.
 *
 * Esto es lo que hace que exista algo que mandar cuando Datadog esté conectado.
 * Sin ello, el SDK del navegador se instalaría para recoger un silencio.
 *
 * ⚠️ NO SE MANDA LA URL ENTERA. Puede llevar parámetros con datos de la
 * persona, y esto acaba saliendo del edificio. Va solo la ruta.
 *
 * Devuelve la función para dejar de escuchar. Idempotente: llamarla dos veces
 * no duplica los reportes.
 */
let yaEscuchando = false;

export function watchBrowserErrors(): () => void {
  if (typeof window === 'undefined' || yaEscuchando) {
    return () => undefined;
  }
  yaEscuchando = true;

  const alFallar = (event: ErrorEvent): void => {
    reportError('navegador', 'excepción sin capturar', {
      detail: event.message,
      source: event.filename,
      line: event.lineno,
      path: window.location.pathname,
    });
  };

  const alRechazar = (event: PromiseRejectionEvent): void => {
    const razon: unknown = event.reason;
    reportError('navegador', 'promesa rechazada sin capturar', {
      detail:
        razon instanceof Error
          ? razon.message
          : typeof razon === 'string'
            ? razon
            : 'motivo no legible',
      path: window.location.pathname,
    });
  };

  window.addEventListener('error', alFallar);
  window.addEventListener('unhandledrejection', alRechazar);

  return () => {
    window.removeEventListener('error', alFallar);
    window.removeEventListener('unhandledrejection', alRechazar);
    yaEscuchando = false;
  };
}
