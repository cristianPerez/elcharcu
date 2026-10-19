import { type SupabaseAdminClient } from '@/shared/api/supabase/server';
import { reportWarning } from '@/shared/lib';

import { periodEnd } from '../lib/periodEnd';
import { type Trace } from '../lib/trace';
import { type CloseEvent, type NormalizedPaymentEvent } from '../model/types';

import { planIdOf } from './lookup';
import { sendWelcome } from './sendWelcome';

/**
 * Un PAGO de una cuenta ya identificada.
 *
 * ⚠️ SI NO SE SABE QUÉ PLAN COMPRÓ, NO SE ADIVINA. Antes un plan de OnePay sin
 * fila en `plan_checkout` se activaba como `pro-mensual`: así quedó el primer
 * aviso de producción (2026-10-19), un plan de prueba de US$ 1. Ahora se guarda
 * el vínculo y el plan de OnePay, sin tocar el acceso, y el evento queda
 * `plan_desconocido` para revisarlo a mano.
 */
export async function applyPaid(
  db: SupabaseAdminClient,
  proveedor: string,
  userId: string,
  event: NormalizedPaymentEvent,
  trace: Trace,
  close: CloseEvent,
): Promise<void> {
  // El vínculo se guarda siempre: el PRÓXIMO evento se encuentra sin depender
  // del correo ni del teléfono.
  const link = {
    user_id: userId,
    provider: proveedor,
    external_subscription_id: event.recursoId,
    external_customer_id: event.clienteId,
    external_plan_id: event.planExternoId,
  };
  const planId = await planIdOf(db, event.planExternoId);

  if (planId === null) {
    // Sin `status` ni `plan_id`: una fila nueva nace `free`, y una que ya
    // existía (una cortesía, un pago anterior) conserva el acceso que tenía.
    await db.from('subscriptions').upsert(link, { onConflict: 'user_id' });
    const plan = event.planExternoId ?? '(sin plan)';
    trace.step('plan desconocido', { plan_externo: plan });
    await close(
      'plan_desconocido',
      `el plan ${plan} de ${proveedor} no está en plan_checkout (suscripción ${event.recursoId})`,
    );
    reportWarning('pagos', 'pago de un plan que no está en plan_checkout', {
      traza: trace.traza,
      proveedor,
      suscripcion: event.recursoId,
      plan_externo: plan,
    });
    return;
  }

  const vence = periodEnd(event.venceEl, event.pagadoEl, planId);
  await db.from('subscriptions').upsert(
    {
      ...link,
      status: 'active',
      plan_id: planId,
      rail: proveedor,
      canceled_at: null,
      // Si no dijo hasta cuándo, se deja la fecha que hubiera: mejor eso que
      // borrarla y dejar a la persona sin acceso.
      ...(vence === null ? {} : { current_period_end: vence }),
    },
    { onConflict: 'user_id' },
  );
  trace.step('suscripcion activada', {
    plan: planId,
    vence: vence ?? 'sin cambio',
  });
  await sendWelcome(db, userId, trace);
  await close('procesado');
}
