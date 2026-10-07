/**
 * El INTENTO de entrada: lo que une los pasos del embudo del enlace mágico
 * (2026-10-07).
 *
 * El problema que mide: alguien pide el enlace en el navegador interno de
 * Instagram, el correo se abre en Gmail y el enlace en Safari. Para Mixpanel
 * esos son dos navegadores, dos `distinct_id` y dos personas. Sin algo que los
 * una no se puede ni contar cuántos se caen.
 *
 * Así que al pedírsele la cuenta se crea un intento —un id aleatorio, el
 * motivo y la página de origen— y vive en DOS sitios:
 *
 *   · una cookie, que solo existe en el navegador que pidió el enlace;
 *   · los parámetros del `emailRedirectTo`, que viajan dentro del correo a
 *     cualquier navegador.
 *
 * El callback compara los dos: si la cookie trae el mismo id que el enlace, es
 * el mismo navegador (`same_browser`). Y como el enlace también lleva el
 * `visitor_id` de quien lo pidió, los eventos del otro navegador se le pueden
 * atribuir a la misma persona.
 *
 * Nada de esto es dato personal: ids aleatorios y una ruta de la propia web.
 * ⚠️ No cambia a dónde se le manda al entrar: `next` sigue siendo el de antes.
 */

export const AUTH_ATTEMPT_COOKIE = 'elcharcu_intento';
/** Lo que deja el callback al entrar, para medir si llegó a donde iba. */
export const AUTH_DONE_COOKIE = 'elcharcu_entro';

/** Por qué se le pidió la cuenta. */
export type AuthTrigger =
  | 'capsula'
  | 'curso_gratis'
  | 'curso'
  | 'tercera_pregunta'
  | 'avisame'
  | 'menu_entrar'
  | 'crear_cuenta'
  | 'app';

const TRIGGERS: readonly AuthTrigger[] = [
  'capsula',
  'curso_gratis',
  'curso',
  'tercera_pregunta',
  'avisame',
  'menu_entrar',
  'crear_cuenta',
  'app',
];

export interface AuthAttempt {
  readonly id: string;
  readonly trigger: AuthTrigger;
  /** La página que quería ver cuando se le pidió la cuenta. */
  readonly origin: string | null;
}

/** Los nombres de los parámetros que viajan en el enlace del correo. */
export const ATTEMPT_PARAMS = {
  id: 'intento',
  trigger: 'disparador',
  origin: 'origen',
  visitor: 'visitante',
} as const;

const ID_PATTERN = /^[a-z0-9-]{8,64}$/i;
const MAX_ORIGIN = 300;

export function isAuthTrigger(value: unknown): value is AuthTrigger {
  return typeof value === 'string' && TRIGGERS.some((trigger) => trigger === value);
}

/** Solo rutas de esta web: `/cursos/x`, nunca `//otro.co` ni una URL completa. */
export function safeOrigin(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return null;
  }
  return value.slice(0, MAX_ORIGIN);
}

export function safeAttemptId(value: unknown): string | null {
  return typeof value === 'string' && ID_PATTERN.test(value) ? value : null;
}

export function encodeAttempt(attempt: AuthAttempt): string {
  return encodeURIComponent(JSON.stringify(attempt));
}

/** El intento guardado en la cookie, o `null` si no hay o no se entiende. */
export function decodeAttempt(raw: string | undefined | null): AuthAttempt | null {
  if (raw === undefined || raw === null || raw === '') {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    const { id, trigger, origin } = parsed as Record<string, unknown>;
    const safeId = safeAttemptId(id);
    if (safeId === null || !isAuthTrigger(trigger)) {
      return null;
    }
    return { id: safeId, trigger, origin: safeOrigin(origin) };
  } catch {
    return null;
  }
}

/**
 * Los parámetros que se cuelgan del `emailRedirectTo`. No sustituyen a `next`:
 * se suman a él, y el callback los ignora para decidir a dónde redirigir.
 */
export function attemptRedirectParams(
  attempt: AuthAttempt,
  visitorId: string | null,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(ATTEMPT_PARAMS.id, attempt.id);
  params.set(ATTEMPT_PARAMS.trigger, attempt.trigger);
  if (attempt.origin !== null) {
    params.set(ATTEMPT_PARAMS.origin, attempt.origin);
  }
  if (visitorId !== null && safeAttemptId(visitorId) !== null) {
    params.set(ATTEMPT_PARAMS.visitor, visitorId);
  }
  return params;
}
