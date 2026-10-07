import {
  AUTH_ATTEMPT_COOKIE,
  AUTH_DONE_COOKIE,
  decodeAttempt,
  encodeAttempt,
  safeOrigin,
  type AuthAttempt,
  type AuthTrigger,
} from './authAttempt';
import { ANALYTICS_EVENTS } from './events';
import { rememberedVisitorId } from './identity';
import { track, type AnalyticsProperties } from './mixpanel';
import { browserContextOf } from './userAgent';

/** Lo que dura un intento: lo mismo que el enlace del correo (1 h en Supabase). */
const ATTEMPT_MAX_AGE_S = 60 * 60;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const prefix = `${name}=`;
  const found = document.cookie.split('; ').find((part) => part.startsWith(prefix));
  return found === undefined ? null : found.slice(prefix.length);
}

function writeCookie(name: string, value: string, maxAgeS: number): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${String(maxAgeS)}; SameSite=Lax${secure}`;
}

/** El intento que este navegador tiene abierto, si lo tiene. */
export function currentAuthAttempt(): AuthAttempt | null {
  return decodeAttempt(readCookie(AUTH_ATTEMPT_COOKIE));
}

/**
 * Abre un intento nuevo y mide que se le pidió la cuenta (`auth_modal_opened`).
 *
 * Se llama cada vez que se le enseña el formulario del correo. Un intento por
 * apertura: si cierra y vuelve a abrir, es otro intento, que es lo que se
 * quiere contar.
 */
export function startAuthAttempt(
  trigger: AuthTrigger,
  origin: string | null,
): AuthAttempt {
  const attempt: AuthAttempt = {
    id: crypto.randomUUID(),
    trigger,
    origin: safeOrigin(origin),
  };
  writeCookie(AUTH_ATTEMPT_COOKIE, encodeAttempt(attempt), ATTEMPT_MAX_AGE_S);
  trackAuthStep(ANALYTICS_EVENTS.authModalOpened, attempt);
  return attempt;
}

/** El intento abierto, o uno nuevo si no hay (alguien que llega sin pasar por el formulario). */
export function ensureAuthAttempt(fallback: AuthTrigger): AuthAttempt {
  return currentAuthAttempt() ?? startAuthAttempt(fallback, null);
}

/** Un paso del embudo con todo su contexto: navegador, dispositivo, intento. */
export function trackAuthStep(
  event: string,
  attempt: AuthAttempt,
  extra: AnalyticsProperties = {},
): void {
  track(event, {
    ...browserContextOf(navigator.userAgent),
    intento: attempt.id,
    trigger: attempt.trigger,
    origen: attempt.origin ?? undefined,
    // Al pedirlo, por definición, se está en el navegador que lo pide.
    same_browser: true,
    ...extra,
  });
}

/** El `visitor_id` de este navegador, para que el enlace lo lleve consigo. */
export function attemptVisitorId(): string | null {
  return rememberedVisitorId();
}

/**
 * Lo que dejó el callback al entrar: a dónde quería ir y cómo entró. Se lee una
 * vez y se borra.
 */
export function takeAuthDone(): {
  readonly attempt: AuthAttempt;
  readonly sameBrowser: boolean | null;
} | null {
  const raw = readCookie(AUTH_DONE_COOKIE);
  if (raw === null) {
    return null;
  }
  writeCookie(AUTH_DONE_COOKIE, '', 0);
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    const { attempt, sameBrowser } = parsed as Record<string, unknown>;
    const decoded = decodeAttempt(
      typeof attempt === 'string' ? attempt : encodeURIComponent(JSON.stringify(attempt)),
    );
    if (decoded === null) {
      return null;
    }
    return {
      attempt: decoded,
      sameBrowser: typeof sameBrowser === 'boolean' ? sameBrowser : null,
    };
  } catch {
    return null;
  }
}
