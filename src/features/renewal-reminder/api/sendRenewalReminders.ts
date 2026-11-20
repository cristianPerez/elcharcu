import { sendTemplateEmail } from '@/shared/api/email';
import { type SupabaseAdminClient } from '@/shared/api/supabase/server';

import { TEMPLATE_ALIAS } from '../lib/reminderTemplate';
import { reminderVariables } from '../lib/reminderVariables';
import { type ReminderResult } from '../model/types';

import { collectLearning, endingManualPlans, proCheckoutUrls } from './collectLearning';

export interface ReminderOptions {
  /** Cuentas que PUEDEN recibir el aviso. Vacío = no sale nada. */
  readonly allowedUserIds: readonly string[];
  /** Si viene, el correo va a esta dirección y no a la persona: para aprobarlo antes. */
  readonly testTo?: string;
  readonly checkoutMode: 'produccion' | 'pruebas';
  readonly now?: Date;
}

/**
 * El aviso diario de "tu mes de Pro termina": UN correo por persona y día,
 * desde `DAYS_BEFORE` días antes del corte hasta el último día, para quien
 * pagó por fuera de la pasarela (Nequi, transferencia) o tiene una cortesía.
 * Con OnePay no hace falta: la renovación se cobra sola.
 *
 * ⚠️ Solo a quien esté en `allowedUserIds`: hoy, York. Se amplía a propósito,
 * nunca por defecto. La idempotencia (persona + día, en Resend) evita el
 * segundo correo si el cron se repite el mismo día.
 */
export async function sendRenewalReminders(
  db: SupabaseAdminClient,
  options: ReminderOptions,
): Promise<readonly ReminderResult[]> {
  const now = options.now ?? new Date();
  const rows = await endingManualPlans(db, options.allowedUserIds, now);
  if (rows.length === 0) return [];

  const links = await proCheckoutUrls(db, options.checkoutMode);
  if (links === null) {
    return rows.map((r) => ({
      userId: r.user_id,
      to: '',
      sent: false,
      reason: 'sin enlaces de OnePay',
    }));
  }

  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(
    now,
  );
  const results: ReminderResult[] = [];
  for (const row of rows) {
    const summary = await collectLearning(db, row);
    if (summary === null) {
      results.push({
        userId: row.user_id,
        to: '',
        sent: false,
        reason: 'la cuenta no tiene correo',
      });
      continue;
    }
    const to = options.testTo ?? summary.email;
    const key =
      options.testTo === undefined
        ? `renovacion/${row.user_id}/${day}`
        : `renovacion-prueba/${row.user_id}/${now.getTime()}`;
    const result = await sendTemplateEmail({
      to,
      template: TEMPLATE_ALIAS,
      variables: reminderVariables(summary, links, now),
      idempotencyKey: key,
    });
    results.push(
      result.sent
        ? { userId: row.user_id, to, sent: true }
        : { userId: row.user_id, to, sent: false, reason: result.reason },
    );
  }
  return results;
}
