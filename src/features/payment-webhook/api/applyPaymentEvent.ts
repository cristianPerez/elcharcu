import { type SupabaseAdminClient } from '@/shared/api/supabase/server';
import { reportWarning } from '@/shared/lib';

import { type Trace } from '../lib/trace';
import { type NormalizedPaymentEvent } from '../model/types';

import { findUser, planIdOf } from './lookup';

/** El plan si la pasarela no dice cuál: el que se vende. */
const FALLBACK_PLAN = 'pro-mensual';

type Close = (estado: 'procesado' | 'huerfano', nota?: string) => Promise<void>;

/**
 * Lleva el evento a la suscripción. `has_active_subscription` solo cuenta
 * `status = 'active'` con el período vigente, así que de esas dos columnas
 * depende el acceso.
 */
export async function applyPaymentEvent(
  db: SupabaseAdminClient,
  proveedor: string,
  event: NormalizedPaymentEvent,
  trace: Trace,
  close: Close,
): Promise<void> {
  if (event.tipo === 'desconocido') {
    await close('procesado', 'evento que no nos afecta');
    return;
  }

  const userId = await findUser(db, proveedor, event, trace);
  if (userId === null) {
    trace.step('huerfano', {
      motivo: event.correo === null ? 'sin correo' : 'correo desconocido',
    });
    await close(
      'huerfano',
      event.correo === null
        ? `la pasarela no mandó correo (suscripción ${event.recursoId})`
        : `nadie con el correo ${event.correo} (suscripción ${event.recursoId})`,
    );
    reportWarning('pagos', 'pago sin dueño conocido', {
      traza: trace.traza,
      proveedor,
      suscripcion: event.recursoId,
    });
    return;
  }

  if (event.tipo === 'suscripcion.pagada') {
    const planId = (await planIdOf(db, event.planExternoId)) ?? FALLBACK_PLAN;
    // `upsert`: la primera vez puede no haber fila. Y se guarda el id de la
    // suscripción: el PRÓXIMO evento se encuentra sin depender del correo.
    await db.from('subscriptions').upsert(
      {
        user_id: userId,
        status: 'active',
        plan_id: planId,
        rail: proveedor,
        provider: proveedor,
        external_subscription_id: event.recursoId,
        external_customer_id: event.clienteId,
        canceled_at: null,
        // Si no dijo hasta cuándo, se deja la fecha que hubiera: mejor eso que
        // borrarla y dejar a la persona sin acceso.
        ...(event.venceEl === null ? {} : { current_period_end: event.venceEl }),
      },
      { onConflict: 'user_id' },
    );
    trace.step('suscripcion activada', {
      plan: planId,
      vence: event.venceEl ?? 'sin cambio',
    });
    await close('procesado');
    return;
  }

  const { data: current } = await db
    .from('subscriptions')
    .select('current_period_end')
    .eq('user_id', userId)
    .maybeSingle();
  const end = current?.current_period_end ?? null;
  const stillPaid = end !== null && new Date(end).getTime() > Date.now();

  if (event.tipo === 'suscripcion.cancelada') {
    // ⚠️ CANCELAR NO ES CORTAR: quien canceló ya pagó el período y lo
    // conserva hasta el final. Solo si no hay fecha de fin se corta ya (si no,
    // `has_active_subscription` lo dejaría activo para siempre).
    await db
      .from('subscriptions')
      .update({
        canceled_at: new Date().toISOString(),
        ...(end === null ? { status: 'canceled' } : {}),
      })
      .eq('user_id', userId);
    trace.step('cancelada', { conserva_hasta: end ?? 'sin fecha: cortada' });
    await close('procesado');
    return;
  }

  // Cobro fallido o vencida. ⚠️ No de golpe: si quedan días pagados, los
  // conserva; si no, deja de estar activa. Y se avisa: casi siempre es una
  // tarjeta caducada, y un mensaje a tiempo recupera la suscripción.
  if (!stillPaid) {
    await db.from('subscriptions').update({ status: 'past_due' }).eq('user_id', userId);
  }
  trace.step('cobro fallido o vencida', { conserva_dias: stillPaid });
  await close('procesado', 'cobro fallido o suscripción vencida');
  reportWarning('pagos', 'a una cuenta le falló el cobro', {
    traza: trace.traza,
    proveedor,
    suscripcion: event.recursoId,
  });
}
