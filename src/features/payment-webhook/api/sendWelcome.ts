import { sendEmail } from '@/shared/api/email';
import { type SupabaseAdminClient } from '@/shared/api/supabase/server';

import { siteOrigin } from '../lib/siteOrigin';
import { type Trace } from '../lib/trace';
import { welcomeEmail } from '../lib/welcomeEmail';

/**
 * El correo de bienvenida del primer pago, UNA sola vez por cuenta.
 *
 * El `update ... where bienvenida_enviada_el is null` decide quién lo manda:
 * dos reintentos simultáneos no mandan dos correos. Si el envío falla, se
 * devuelve a null para que el siguiente aviso lo intente: mejor un correo
 * repetido que alguien que pagó sin su correo para siempre.
 *
 * El botón es un enlace mágico de Supabase que aterriza en NUESTRO
 * `/auth/callback?token_hash=…` (ya lo acepta): así verifica el correo de una
 * cuenta recién creada y abre la sesión.
 */
export async function sendWelcome(
  db: SupabaseAdminClient,
  userId: string,
  trace: Trace,
): Promise<void> {
  const { data: claimed } = await db
    .from('subscriptions')
    .update({ bienvenida_enviada_el: new Date().toISOString() })
    .eq('user_id', userId)
    .is('bienvenida_enviada_el', null)
    .select('user_id');
  if ((claimed ?? []).length === 0) {
    trace.step('sin bienvenida (ya se mandó)');
    return;
  }

  const release = async (motivo: string): Promise<void> => {
    await db
      .from('subscriptions')
      .update({ bienvenida_enviada_el: null })
      .eq('user_id', userId);
    trace.step('bienvenida NO salió', { motivo });
  };

  const { data: user } = await db.auth.admin.getUserById(userId);
  const to = user.user?.email ?? null;
  if (to === null) {
    await release('la cuenta no tiene correo');
    return;
  }
  const { data: link, error } = await db.auth.admin.generateLink({
    type: 'magiclink',
    email: to,
  });
  if (error !== null) {
    await release(`sin enlace: ${error.code ?? error.message}`);
    return;
  }

  const origin = siteOrigin();
  const magicLink =
    `${origin}/auth/callback?token_hash=${encodeURIComponent(link.properties.hashed_token)}` +
    `&type=magiclink&next=${encodeURIComponent('/charcu')}`;
  const result = await sendEmail(
    welcomeEmail({ to, entrarUrl: `${origin}/entrar`, magicLink }),
  );
  if (!result.sent) {
    await release(result.reason);
    return;
  }
  trace.step('bienvenida enviada');
}
