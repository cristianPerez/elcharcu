import { createSupabaseBrowserClient } from '@/shared/api/supabase';

import type { LeadData } from '../model/types';

interface SubmitResult {
  readonly ok: boolean;
  readonly error?: string;
}

/**
 * Guarda los datos del lead en Supabase.
 * También guarda cuántas preguntas e imágenes había usado al momento de captura.
 */
export async function submitLead(
  data: LeadData,
  questionsUsed: number,
  imagesUsed: number,
): Promise<SubmitResult> {
  try {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.from('leads').insert({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      questions_used: questionsUsed,
      images_used: imagesUsed,
    });

    if (error) {
      console.error('[lead-capture] error al guardar:', error);
      return { ok: false, error: 'No pudimos guardar tus datos. Inténtalo otra vez.' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[lead-capture] error inesperado:', err);
    return { ok: false, error: 'Algo salió mal. Inténtalo otra vez.' };
  }
}
