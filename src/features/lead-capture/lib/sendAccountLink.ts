import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';
import {
  ANALYTICS_EVENTS,
  attemptRedirectParams,
  attemptVisitorId,
  ensureAuthAttempt,
  trackAuthStep,
} from '@/shared/lib/analytics';

/**
 * Manda el enlace de entrada al correo que acaba de dejar.
 *
 * Sí, `features/auth-by-email` hace algo parecido. Se duplica a propósito: son
 * dos features y un import entre ellas sería lateral, que CLAUDE.md prohíbe.
 * La regla del repo es clara — antes duplicar cinco líneas que atar dos
 * features entre sí. Y no son el mismo caso: allí el usuario va a entrar,
 * aquí está a mitad de una conversación y el enlace es para no perderla.
 */
export async function sendAccountLink(email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const supabase = createSupabaseBrowserClient();
    // Ver `useEmailAuth`: el intento viaja en el enlace y no cambia `next`.
    const attempt = ensureAuthAttempt('tercera_pregunta');
    const tracking = attemptRedirectParams(attempt, attemptVisitorId()).toString();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // Cae dentro de la app, en la pestaña de El Charcu. Sin `next` el
      // callback lo mandaba a `/asistente/sesion`, que es del embudo viejo.
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=%2Fcharcu&${tracking}`,
      },
    });
    if (error === null) {
      trackAuthStep(ANALYTICS_EVENTS.magicLinkRequested, attempt);
    }
    return error === null;
  } catch {
    return false;
  }
}
