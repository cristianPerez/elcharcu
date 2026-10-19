import { reportWarning } from '@/shared/lib';

export interface Email {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  /** La versión en texto plano. NO es opcional: un correo solo-HTML puntúa peor en spam. */
  readonly text: string;
}

export type SendResult =
  { readonly sent: true } | { readonly sent: false; readonly reason: string };

/**
 * Manda un correo por Resend (copiado de Manos Creadoras, `lib/correo.ts`,
 * 2026-10-19).
 *
 * ⚠️ NUNCA LANZA. Quien llama es el webhook de pagos: si Resend falla y la
 * excepción subiera, la ruta devolvería 500, OnePay reintentaría el pago y un
 * endpoint que falla seguido acaba desactivado. El acceso ya está dado cuando
 * esto corre; el correo es la cortesía.
 */
export async function sendEmail(email: Email): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY ?? '';
  const from = process.env.RESEND_FROM ?? '';
  if (key === '' || from === '') {
    return { sent: false, reason: 'faltan RESEND_API_KEY y/o RESEND_FROM' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      reportWarning('correo', 'Resend rechazó el envío', {
        asunto: email.subject,
        estado: response.status,
        detalle: detail.slice(0, 300),
      });
      return { sent: false, reason: `Resend respondió ${response.status}` };
    }
    return { sent: true };
  } catch (error) {
    reportWarning('correo', 'no se pudo contactar con Resend', {
      asunto: email.subject,
      error: error instanceof Error ? error.message : String(error),
    });
    return { sent: false, reason: 'Resend no respondió' };
  }
}
