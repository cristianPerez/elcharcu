import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';

/**
 * Las recetas del asistente: cada conversación gira en torno a UNA pieza.
 * SOLO SERVIDOR.
 *
 * Se llama `recipe-chat` y no `recipe` porque `entities/recipe` ya existe y es
 * otra cosa: el catálogo público de recetas del sitio. Misma palabra, dos
 * conceptos, y mezclarlos sería el clásico lío que después nadie desenreda.
 */

/** Título provisional a partir de la primera pregunta. Luego se puede cambiar. */
export function draftTitle(firstQuestion: string): string {
  const clean = firstQuestion.trim().replace(/\s+/g, ' ');
  if (clean === '') {
    return 'Receta sin nombre';
  }
  return clean.length <= 60 ? clean : `${clean.slice(0, 57)}…`;
}

/**
 * La última receta abierta de este visitante, si tiene alguna.
 *
 * Es lo que impide que una simple recarga rompa la app: el navegador guarda el
 * id de la receta en memoria, así que al recargar se pierde y la siguiente
 * pregunta pediría abrir OTRA receta — que en el plan gratis no cabe. El
 * servidor no puede fiarse de que el navegador recuerde en qué receta iba.
 */
export async function latestOpenRecipe(
  visitorId: string,
  userId: string | null,
): Promise<string | null> {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const query = supabase
    .from('recipes')
    .select('id')
    .eq('status', 'activa')
    .order('last_message_at', { ascending: false })
    .limit(1);

  const { data, error } =
    userId === null
      ? await query.eq('visitor_id', visitorId).maybeSingle()
      : await query.eq('user_id', userId).maybeSingle();

  if (error !== null || data === null) {
    return null;
  }
  return data.id;
}

/** Abre una receta nueva y devuelve su id. `null` si no se pudo. */
export async function createRecipe(
  visitorId: string,
  userId: string | null,
  firstQuestion: string,
): Promise<string | null> {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const { data, error } = await createSupabaseAdminClient()
    .from('recipes')
    .insert({
      visitor_id: visitorId,
      user_id: userId,
      title: draftTitle(firstQuestion),
    })
    .select('id')
    .single();

  if (error !== null) {
    console.error('[receta] no se pudo crear:', error.message);
    return null;
  }

  return data.id;
}

/**
 * Comprueba que la receta existe y es de quien dice.
 *
 * Sin esto, cualquiera podría mandar el id de la receta de otro y colgarle
 * mensajes — y de paso leerse su historial en la respuesta del asistente.
 */
export async function ownsRecipe(
  recipeId: string,
  visitorId: string,
  userId: string | null,
): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) {
    return false;
  }

  const { data, error } = await createSupabaseAdminClient()
    .from('recipes')
    .select('visitor_id, user_id')
    .eq('id', recipeId)
    .maybeSingle();

  if (error !== null || data === null) {
    return false;
  }

  // Vale por cuenta o por navegador: el visitante anónimo solo tiene lo segundo.
  if (userId !== null && data.user_id === userId) {
    return true;
  }
  return data.user_id === null && data.visitor_id === visitorId;
}

/** Marca actividad en la receta, para poder ordenarlas por lo más reciente. */
export async function touchRecipe(recipeId: string): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    return;
  }

  await createSupabaseAdminClient()
    .from('recipes')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', recipeId);
}
