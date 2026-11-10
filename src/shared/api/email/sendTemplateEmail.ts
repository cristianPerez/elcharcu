import { reportWarning } from '@/shared/lib';

import { type SendResult } from './sendEmail';

export interface TemplateEmail {
  readonly to: string;
  /** El id o el alias de una plantilla PUBLICADA en Resend. */
  readonly template: string;
  readonly variables: Readonly<Record<string, string | number>>;
  /**
   * Resend no repite un envío con la misma clave durante 24 h. Con una clave
   * por persona y día, el aviso diario sale una vez aunque el cron se repita.
   */
  readonly idempotencyKey: string;
}

/**
 * Manda un correo con una plantilla de Resend (resend.com/templates). El
 * asunto y el remitente salen de la plantilla; el remitente se fuerza con
 * `RESEND_FROM` para que siempre sea el dominio verificado.
 *
 * ⚠️ NUNCA LANZA, como `sendEmail`: quien llama decide qué hacer si no salió.
 */
export async function sendTemplateEmail(email: TemplateEmail): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY ?? '';
  const from = process.env.RESEND_FROM ?? '';
  if (key === '' || from === '') {
    return { sent: false, reason: 'faltan RESEND_API_KEY y/o RESEND_FROM' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': email.idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: email.to,
        template: { id: email.template, variables: email.variables },
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      reportWarning('correo', 'Resend rechazó el envío con plantilla', {
        plantilla: email.template,
        estado: response.status,
        detalle: detail.slice(0, 300),
      });
      return {
        sent: false,
        reason: `Resend respondió ${response.status}: ${detail.slice(0, 200)}`,
      };
    }
    return { sent: true };
  } catch (error) {
    reportWarning('correo', 'no se pudo contactar con Resend', {
      plantilla: email.template,
      error: error instanceof Error ? error.message : String(error),
    });
    return { sent: false, reason: 'Resend no respondió' };
  }
}
