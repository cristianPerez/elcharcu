import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/shared/api/supabase/server';

/**
 * "Las que te llegaron": las recetas que cada quien abrió por su link
 * (diseño final, 2026-10-07). Sin cuenta se guardan a nombre del visitante
 * —la misma cookie del cupo— y al entrar pasan a la cuenta.
 *
 * Con la clave de servicio: la cookie del visitante es httpOnly y solo la lee
 * el servidor. Nada de esto puede tumbar una página: si falla, no se apunta.
 */
export async function recordReceivedRecipe(
  slug: string,
  visitorId: string | null,
  userId: string | null,
): Promise<void> {
  if (!isSupabaseAdminConfigured() || (visitorId === null && userId === null)) {
    return;
  }
  // Con cuenta se guarda a su nombre; el visitante, solo cuando no hay cuenta.
  const args =
    userId !== null
      ? { p_slug: slug, p_user_id: userId }
      : visitorId !== null
        ? { p_slug: slug, p_visitor_id: visitorId }
        : null;
  if (args === null) {
    return;
  }
  await createSupabaseAdminClient().rpc('registrar_receta_recibida', args);
}

/** Al entrar con el enlace del correo: lo abierto de anónimo pasa a su cuenta. */
export async function linkReceivedRecipes(
  visitorId: string,
  userId: string,
): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    return;
  }
  await createSupabaseAdminClient().rpc('link_received_recipes_to_user', {
    p_visitor_id: visitorId,
    p_user_id: userId,
  });
}

/** Los slugs que le llegaron a esta persona (cuenta o visitante), del más nuevo al más viejo. */
export async function receivedRecipeSlugs(
  visitorId: string | null,
  userId: string | null,
): Promise<readonly string[]> {
  if (!isSupabaseAdminConfigured() || (visitorId === null && userId === null)) {
    return [];
  }
  const query = createSupabaseAdminClient()
    .from('recetas_recibidas')
    .select('recipe_slug')
    .order('first_opened_at', { ascending: false });
  const { data } =
    userId === null
      ? await query.eq('visitor_id', visitorId ?? '').is('user_id', null)
      : await query.eq('user_id', userId);
  return (data ?? []).map((row) => row.recipe_slug);
}
