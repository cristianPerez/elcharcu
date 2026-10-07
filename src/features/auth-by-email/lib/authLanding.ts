import { type NextRequest, type NextResponse } from 'next/server';

import { readVisitorId } from '@/shared/api/visitor';
import {
  ANALYTICS_EVENTS,
  ATTEMPT_PARAMS,
  AUTH_ATTEMPT_COOKIE,
  AUTH_DONE_COOKIE,
  browserContextOf,
  decodeAttempt,
  isAuthTrigger,
  safeAttemptId,
  safeOrigin,
  trackServer,
} from '@/shared/lib/analytics/server';

type Flow = 'pkce' | 'token_hash' | 'ninguno';
type Props = Record<string, string | number | boolean | undefined>;

export interface AuthLanding {
  /** No abrió sesión. `reason` es el código de error de Supabase. */
  readonly failed: (reason: string) => void;
  /** Abrió sesión. */
  readonly completed: (isNewAccount: boolean | null) => void;
  /** Deja en el navegador lo necesario para medir `returned_to_origin`. */
  readonly markDone: (response: NextResponse) => void;
  /** Manda los eventos acumulados. Va en `after()`. */
  readonly flush: () => Promise<void>;
}

/**
 * La medición del aterrizaje del enlace mágico (2026-10-07).
 *
 * ⚠️ SOLO MIDE. No decide a dónde va nadie ni toca la sesión: el callback hace
 * exactamente lo mismo que antes, esto solo cuenta qué pasó.
 *
 * `same_browser` sale de comparar el intento que trae el ENLACE con el que
 * guarda la COOKIE de este navegador:
 *   · iguales      → `true`: lo abrió donde lo pidió.
 *   · distintos o sin cookie → `false`: lo abrió en otro navegador (o borró
 *                    las cookies, que se ve igual desde aquí).
 *   · el enlace no trae intento → `undefined`: enlaces viejos, de antes de
 *                    medir, o los de los e2e.
 *
 * Los eventos van a nombre del `visitor_id` de quien PIDIÓ el enlace (viaja en
 * él), no del que lo abre: así un mismo embudo de Mixpanel une los dos
 * navegadores. Si no viene, se usa el de este navegador.
 */
export function authLanding(request: NextRequest, flow: Flow): AuthLanding {
  const params = request.nextUrl.searchParams;
  const linkAttemptId = safeAttemptId(params.get(ATTEMPT_PARAMS.id));
  const linkTrigger = params.get(ATTEMPT_PARAMS.trigger);
  const cookieAttempt = decodeAttempt(request.cookies.get(AUTH_ATTEMPT_COOKIE)?.value);

  const sameBrowser =
    linkAttemptId === null ? undefined : cookieAttempt?.id === linkAttemptId;

  const attempt =
    linkAttemptId === null
      ? cookieAttempt
      : {
          id: linkAttemptId,
          trigger: isAuthTrigger(linkTrigger) ? linkTrigger : 'app',
          origin: safeOrigin(params.get(ATTEMPT_PARAMS.origin)),
        };

  const distinctId =
    safeAttemptId(params.get(ATTEMPT_PARAMS.visitor)) ?? readVisitorId(request) ?? '';

  const base: Props = {
    ...browserContextOf(request.headers.get('user-agent') ?? ''),
    flow,
    same_browser: sameBrowser,
    intento: attempt?.id,
    trigger: attempt?.trigger,
    origen: attempt?.origin ?? undefined,
  };

  const queue: { readonly event: string; readonly props: Props }[] = [
    { event: ANALYTICS_EVENTS.magicLinkLanded, props: base },
  ];

  return {
    failed: (reason) => {
      queue.push({ event: ANALYTICS_EVENTS.authFailed, props: { ...base, reason } });
    },
    completed: (isNewAccount) => {
      queue.push({
        event: ANALYTICS_EVENTS.authCompleted,
        props: { ...base, cuenta_nueva: isNewAccount ?? undefined },
      });
    },
    markDone: (response) => {
      if (attempt === null) {
        return;
      }
      response.cookies.set(
        AUTH_DONE_COOKIE,
        encodeURIComponent(JSON.stringify({ attempt, sameBrowser: sameBrowser ?? null })),
        { path: '/', maxAge: 30 * 60, sameSite: 'lax', httpOnly: false },
      );
      // El intento ya se cerró: si vuelve a pedir la cuenta, es otro.
      response.cookies.set(AUTH_ATTEMPT_COOKIE, '', { path: '/', maxAge: 0 });
    },
    flush: async () => {
      for (const { event, props } of queue) {
        await trackServer(event, distinctId, props);
      }
    },
  };
}
