import { createHash } from 'node:crypto';

import { type Json } from '@/shared/api/supabase/database.types';
import { createSupabaseAdminClient } from '@/shared/api/supabase/server';
import { reportWarning } from '@/shared/lib';

import { applyPaymentEvent } from '../api/applyPaymentEvent';
import { recordUnreadable } from '../api/recordUnreadable';
import { providerByName } from '../lib/providers';
import { openTrace } from '../lib/trace';

export interface WebhookResponse {
  readonly status: number;
  readonly body: Readonly<Record<string, string | boolean>>;
}

const ok = (extra: Record<string, boolean> = {}): WebhookResponse => ({
  status: 200,
  body: { ok: true, ...extra },
});

/**
 * La puerta de entrada de los webhooks de CUALQUIER pasarela (copiada de
 * Manos Creadoras, `app/api/webhooks/[proveedor]/route.ts`, 2026-10-17).
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUÉ CASI TODO DEVUELVE 200
 * ════════════════════════════════════════════════════════════════════════════
 * OnePay: «un 4xx de tu lado también dispara reintentos» y «un endpoint que
 * falla de forma sostenida se desactiva solo». Responder 400 a algo que nunca
 * vamos a poder procesar hace que lo reintenten y, si se repite, que APAGUEN
 * EL ENDPOINT: dejaríamos de enterarnos de los pagos buenos. Así que 200 a casi
 * todo, y el problema queda ANOTADO en `webhook_eventos`. Solo una firma mala
 * devuelve 401 (ahí sí queremos que falle), y un fallo NUESTRO al guardar, 500
 * (pasajero: que reintenten).
 * ════════════════════════════════════════════════════════════════════════════
 */
export async function handlePaymentWebhook(
  proveedor: string,
  headers: Headers,
  cuerpoCrudo: string,
): Promise<WebhookResponse> {
  const trace = openTrace(proveedor);
  const provider = providerByName(proveedor);
  if (provider === null) {
    trace.close('proveedor desconocido');
    return { status: 404, body: { error: 'proveedor desconocido' } };
  }
  trace.step('recibido', { bytes: cuerpoCrudo.length });

  // ⚠️ El cuerpo va CRUDO a la verificación: la firma es sobre esos bytes.
  const verification = provider.verificar(headers, cuerpoCrudo);
  if (!verification.valido) {
    reportWarning('pagos', `firma rechazada (${proveedor})`, {
      traza: trace.traza,
      motivo: verification.motivo,
    });
    trace.close('rechazado', { motivo: verification.motivo });
    return { status: 401, body: { error: 'no autorizado' } };
  }
  trace.step('firma correcta');

  let cuerpo: Json;
  try {
    cuerpo = JSON.parse(cuerpoCrudo) as Json;
  } catch {
    await recordUnreadable(
      proveedor,
      'cuerpo que no es JSON',
      cuerpoCrudo,
      null,
      trace.traza,
    );
    trace.close('cuerpo no es JSON');
    return ok();
  }

  const event = provider.leer(cuerpo);
  if (event === null) {
    // Pasó la firma —es suyo— pero no tiene la forma esperada: un cambio en su
    // API. Hay que mirarlo, no descartarlo.
    await recordUnreadable(
      proveedor,
      'cuerpo con forma desconocida',
      cuerpoCrudo,
      cuerpo,
      trace.traza,
    );
    reportWarning('pagos', `cuerpo no reconocido de ${proveedor}`, {
      traza: trace.traza,
    });
    trace.close('forma desconocida');
    return ok();
  }
  trace.step('entendido', {
    evento: event.evento,
    tipo: event.tipo,
    con_correo: event.correo !== null,
  });

  const db = createSupabaseAdminClient();
  const huella = createHash('sha256')
    .update(`${event.evento}:${event.recursoId}:${event.marca ?? ''}`)
    .digest('hex');

  // ⚠️ SE GUARDA ANTES DE PROCESAR y el `insert` decide si seguimos: si ya
  // existía es un reintento (OnePay avisa que es normal) y no se aplica otra
  // vez. La clave única evita la carrera de comprobar-y-luego-insertar.
  const { data: row, error } = await db
    .from('webhook_eventos')
    .insert({
      proveedor,
      evento: event.evento,
      tipo: event.tipo,
      recurso_id: event.recursoId,
      huella,
      cuerpo,
      estado: 'recibido',
      traza: trace.traza,
    })
    .select('id')
    .single();

  if (error !== null) {
    if (error.code === '23505') {
      trace.close('repetido');
      return ok({ repetido: true });
    }
    reportWarning('pagos', 'no se pudo guardar el evento', {
      traza: trace.traza,
      error: error.message,
    });
    trace.close('no se pudo guardar', { error: error.message });
    return { status: 500, body: { error: 'no se pudo guardar' } };
  }

  await applyPaymentEvent(db, proveedor, event, trace, async (estado, nota) => {
    await db
      .from('webhook_eventos')
      .update({ estado, nota: nota ?? null, procesado_en: new Date().toISOString() })
      .eq('id', row.id);
  });

  // ⚠️ La duración va a la fila, no solo al log: el log de Vercel caduca.
  const ms = trace.close('procesado');
  await db.from('webhook_eventos').update({ duracion_ms: ms }).eq('id', row.id);
  return ok();
}
