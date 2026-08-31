import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';

import { type QuotaDeniedBy, type QuotaSnapshot } from '../model/types';

/**
 * El cupo, contado en Postgres. SOLO SERVIDOR.
 *
 * Usa la clave de servicio porque el visitante anónimo no tiene sesión y no
 * podría tocar sus propios contadores: la tabla `usage_counters` no tiene
 * ninguna política de RLS a propósito. Nada de esto puede llamarse desde el
 * navegador — si se pudiera, el cupo volvería a ser una sugerencia.
 */

interface QuotaRow {
  readonly plan: string;
  readonly questions_used: number;
  readonly images_used: number;
  readonly recipes_used: number;
  readonly questions_limit: number;
  readonly images_limit: number;
  /** `null` = recetas ilimitadas. */
  readonly recipes_limit: number | null;
}

interface ConsumeRow extends QuotaRow {
  readonly allowed: boolean;
  /** Cuál de los tres topes cerró la puerta: `preguntas`, `fotos` o `recetas`. */
  readonly denied_by: string | null;
}

function toSnapshot(row: QuotaRow): QuotaSnapshot {
  return {
    plan: row.plan,
    questionsUsed: row.questions_used,
    imagesUsed: row.images_used,
    recipesUsed: row.recipes_used,
    questionsLimit: row.questions_limit,
    imagesLimit: row.images_limit,
    recipesLimit: row.recipes_limit,
  };
}

export interface ConsumeResult {
  /** `false` = se acabó el cupo y NO se consumió nada. */
  readonly allowed: boolean;
  /** Qué tope cerró la puerta. Sirve para enseñar el muro correcto. */
  readonly deniedBy: QuotaDeniedBy | null;
  readonly snapshot: QuotaSnapshot;
}

function toDeniedBy(value: string | null): QuotaDeniedBy | null {
  return value === 'preguntas' || value === 'fotos' || value === 'recetas' ? value : null;
}

/**
 * Gasta una pregunta (y las imágenes que traiga) antes de llamar a Gemini.
 *
 * Si Supabase no responde se deja pasar, igual que con el tope de gasto: una
 * caída de la base no debería dejar mudo al asistente. El freno de verdad
 * contra una factura desbocada es `AI_DAILY_BUDGET_USD`, que es global.
 */
export async function consumeQuota(
  visitorId: string,
  userId: string | null,
  images: number,
  isNewRecipe: boolean,
): Promise<ConsumeResult | null> {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('consume_quota', {
    p_visitor_id: visitorId,
    p_user_id: userId as string,
    p_images: images,
    p_new_recipe: isNewRecipe,
  });

  if (error !== null) {
    console.error('[cupo] no se pudo consumir:', error.message);
    return null;
  }

  const row = (data as readonly ConsumeRow[] | null)?.[0];
  if (row === undefined) {
    return null;
  }

  return {
    allowed: row.allowed,
    deniedBy: toDeniedBy(row.denied_by),
    snapshot: toSnapshot(row),
  };
}

/**
 * Devuelve el cupo cobrado cuando la respuesta nunca llegó.
 *
 * Se cobra antes de llamar a Gemini para que dos pestañas a la vez no se
 * cuelen. El precio de hacerlo así es este: si Gemini falla, hay que deshacer
 * el cobro. No cobramos por un error nuestro.
 */
export async function refundQuota(
  visitorId: string,
  userId: string | null,
  images: number,
  isNewRecipe: boolean,
): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc('refund_quota', {
    p_visitor_id: visitorId,
    p_user_id: userId as string,
    p_images: images,
    p_new_recipe: isNewRecipe,
  });

  if (error !== null) {
    console.error('[cupo] no se pudo devolver la pregunta:', error.message);
  }
}

/** Consulta el cupo sin gastarlo. */
export async function readQuota(
  visitorId: string,
  userId: string | null,
): Promise<QuotaSnapshot | null> {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('quota_status', {
    p_visitor_id: visitorId,
    p_user_id: userId as string,
  });

  if (error !== null) {
    console.error('[cupo] no se pudo leer:', error.message);
    return null;
  }

  const row = (data as readonly QuotaRow[] | null)?.[0];
  return row === undefined ? null : toSnapshot(row);
}

/**
 * Ata los contadores de este navegador a la cuenta, al entrar por primera vez.
 * Desde ese momento el cupo se cuenta por cuenta y no por navegador, así que
 * borrar cookies deja de regalar preguntas.
 */
export async function linkVisitorToUser(
  visitorId: string,
  userId: string,
): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc('link_visitor_to_user', {
    p_visitor_id: visitorId,
    p_user_id: userId,
  });

  if (error !== null) {
    console.error('[cupo] no se pudo atar el visitante a la cuenta:', error.message);
  }
}
