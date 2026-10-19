import { type SupabaseAdminClient } from '@/shared/api/supabase/server';

import { type Trace } from '../lib/trace';
import { type NormalizedPaymentEvent } from '../model/types';

/**
 * ¿De quién es este pago? Tres intentos, en este orden:
 *
 *   1. Por la suscripción, si ya la habíamos visto: no cambia aunque la
 *      persona cambie de correo.
 *   2. ⚠️ Por el correo del checkout, el ÚNICO puente la primera vez (el
 *      enlace de cobro es genérico). Si escribió otro distinto al de su cuenta,
 *      queda huérfano: guardado y avisado para activarlo a mano.
 *   3. ⚠️ Por el teléfono, contra el WhatsApp del perfil (últimos 10 dígitos,
 *      y solo si una única cuenta lo tiene). El checkout de OnePay pide
 *      WhatsApp, no correo: llega `hola@onepay.ai`, que nunca coincide.
 */
export async function findUser(
  db: SupabaseAdminClient,
  proveedor: string,
  event: NormalizedPaymentEvent,
  trace: Trace,
): Promise<string | null> {
  const { data: bySubscription } = await db
    .from('subscriptions')
    .select('user_id')
    .eq('provider', proveedor)
    .eq('external_subscription_id', event.recursoId)
    .maybeSingle();
  if (bySubscription !== null) {
    trace.step('identificada', { por: 'suscripcion' });
    return bySubscription.user_id;
  }
  if (event.correo !== null) {
    const { data: byEmail } = await db.rpc('user_id_by_email', { p_email: event.correo });
    trace.step(byEmail === null ? 'correo sin cuenta' : 'identificada', {
      por: 'correo',
    });
    if (byEmail !== null) {
      return byEmail;
    }
  }
  if (event.telefono === null) {
    return null;
  }
  const { data: byPhone } = await db.rpc('user_id_by_phone', { p_phone: event.telefono });
  trace.step(byPhone === null ? 'telefono sin cuenta' : 'identificada', {
    por: 'telefono',
  });
  return byPhone;
}

/** El plan de El Charcu (`pro-mensual`, `pro-anual`) a partir del de OnePay. */
export async function planIdOf(
  db: SupabaseAdminClient,
  externalPlanId: string | null,
): Promise<string | null> {
  if (externalPlanId === null) {
    return null;
  }
  const { data } = await db
    .from('plan_checkout')
    .select('plan_id')
    .eq('external_plan_id', externalPlanId)
    .limit(1)
    .maybeSingle();
  return data?.plan_id ?? null;
}
