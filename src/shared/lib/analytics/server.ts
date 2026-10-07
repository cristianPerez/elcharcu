import { analyticsConfig } from './config';
import type { AnalyticsProperties } from './mixpanel';

/**
 * Mandar un evento a Mixpanel DESDE EL SERVIDOR (2026-10-07).
 *
 * Hace falta para lo que pasa en una ruta y no en una pantalla: el aterrizaje
 * del enlace mágico ocurre en `/auth/callback`, que redirige antes de pintar
 * nada. Si se midiera en el navegador, justo los que FALLAN —los que acaban en
 * otro navegador sin sesión— serían los que menos llegan a mandar el evento.
 *
 * Sin dependencias: la API de ingesta de Mixpanel es un POST con JSON.
 * `ip=0` porque la IP sería la del servidor de Vercel, no la de la persona, y
 * geolocalizarla daría un país falso.
 *
 * Nunca lanza: perder un evento es preferible a romper una entrada.
 */
export async function trackServer(
  event: string,
  distinctId: string,
  properties: AnalyticsProperties = {},
): Promise<void> {
  const token = analyticsConfig.mixpanelToken;
  if (token === '' || distinctId === '') {
    return;
  }

  try {
    await fetch('https://api.mixpanel.com/track?ip=0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/plain' },
      body: JSON.stringify([
        {
          event,
          properties: {
            ...properties,
            token,
            distinct_id: distinctId,
            time: Date.now(),
            $insert_id: crypto.randomUUID(),
            origen_evento: 'servidor',
          },
        },
      ]),
    });
  } catch {
    // Sin red hacia Mixpanel: el evento se pierde y la entrada sigue.
  }
}

export {
  ATTEMPT_PARAMS,
  AUTH_ATTEMPT_COOKIE,
  AUTH_DONE_COOKIE,
  decodeAttempt,
  encodeAttempt,
  isAuthTrigger,
  safeAttemptId,
  safeOrigin,
} from './authAttempt';
export type { AuthAttempt, AuthTrigger } from './authAttempt';
export { browserContextOf } from './userAgent';
export { ANALYTICS_EVENTS } from './events';
