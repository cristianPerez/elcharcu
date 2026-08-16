import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';

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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return error === null;
  } catch {
    return false;
  }
}
