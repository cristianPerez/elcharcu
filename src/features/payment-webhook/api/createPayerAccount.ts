import { type SupabaseAdminClient } from '@/shared/api/supabase/server';
import { reportWarning } from '@/shared/lib';

import { type Trace } from '../lib/trace';
import { usableEmail } from '../lib/usableEmail';

/**
 * Pagó alguien que no tiene cuenta: se le crea, con el correo que guardó
 * OnePay (2026-10-19, decisión de Cristian).
 *
 * La cuenta nace SIN verificar. La verifica el botón del correo de bienvenida,
 * que es un enlace mágico de Supabase; y si ese enlace se pierde o caduca,
 * entra por `/entrar` con el mismo correo, como cualquiera. El inicio de sesión
 * no cambia: esto solo adelanta la creación de la cuenta.
 */
export async function createPayerAccount(
  db: SupabaseAdminClient,
  correo: string | null,
  trace: Trace,
): Promise<string | null> {
  if (!usableEmail(correo)) {
    trace.step('sin correo para crear cuenta');
    return null;
  }

  const { data, error } = await db.auth.admin.createUser({
    email: correo,
    email_confirm: false,
    user_metadata: { origen: 'pago-onepay' },
  });
  if (error === null) {
    trace.step('cuenta creada', { por: 'pago' });
    return data.user.id;
  }

  // Dos avisos a la vez (o una cuenta creada entre la búsqueda y aquí): la
  // cuenta ya existe y basta con encontrarla.
  const { data: existing } = await db.rpc('user_id_by_email', { p_email: correo });
  if (existing !== null) {
    trace.step('identificada', { por: 'correo, tras crear' });
    return existing;
  }
  reportWarning('pagos', 'no se pudo crear la cuenta de quien pagó', {
    traza: trace.traza,
    error: error.code ?? error.message,
  });
  return null;
}
