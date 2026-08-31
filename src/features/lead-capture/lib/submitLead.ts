import type { LeadData } from '../model/types';

interface SubmitResult {
  readonly ok: boolean;
  readonly error?: string;
}

/**
 * Manda los datos del lead al servidor.
 *
 * Antes se insertaba directo en Supabase desde el navegador. Ahora pasa por
 * `/api/lead` porque hay dos cosas que el navegador no puede saber: el
 * `visitor_id` (vive en una cookie httpOnly) y cuántas preguntas lleva de
 * verdad este visitante, que solo la base conoce. Que el propio formulario
 * dijera cuánto había usado era pedirle la verdad a la parte interesada.
 */
export async function submitLead(data: LeadData): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { ok: false, error: 'No pudimos guardar tus datos. Inténtalo otra vez.' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Se cayó la conexión. Inténtalo otra vez.' };
  }
}
