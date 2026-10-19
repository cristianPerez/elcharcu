import { type SupabaseAdminClient } from '@/shared/api/supabase/server';
import { reportWarning } from '@/shared/lib';

import { type Trace } from '../lib/trace';
import { type CloseEvent, type NormalizedPaymentEvent } from '../model/types';

import { applyPaid } from './applyPaid';
import { createPayerAccount } from './createPayerAccount';
import { findUser } from './lookup';

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
  close: CloseEvent,
): Promise<void> {
  if (event.tipo === 'desconocido') {
    await close('procesado', 'evento que no nos afecta');
    return;
  }

  // Solo un PAGO crea cuenta: una cancelación de alguien desconocido no.
  const userId =
    (await findUser(db, proveedor, event, trace)) ??
    (event.tipo === 'suscripcion.pagada'
      ? await createPayerAccount(db, event.correo, trace)
      : null);
  if (userId === null) {
    // Del teléfono, solo los últimos 4 dígitos: basta para reconocerlo.
    const phoneTail = event.telefono?.replace(/\D/g, '').slice(-4) ?? null;
    trace.step('huerfano', {
      con_correo: event.correo !== null,
      con_telefono: phoneTail !== null,
    });
    await close(
      'huerfano',
      `nadie con el correo ${event.correo ?? '(sin correo)'} ni el WhatsApp ` +
        `${phoneTail === null ? '(sin teléfono)' : `…${phoneTail}`} ` +
        `(suscripción ${event.recursoId})`,
    );
    reportWarning('pagos', 'pago sin dueño conocido', {
      traza: trace.traza,
      proveedor,
      suscripcion: event.recursoId,
    });
    return;
  }

  if (event.tipo === 'suscripcion.pagada') {
    await applyPaid(db, proveedor, userId, event, trace, close);
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
