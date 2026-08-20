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
  return clean.length <= 40 ? clean : `${clean.slice(0, 37)}…`;
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

/** Un turno de la conversación tal como se guarda y se devuelve. */
export interface StoredMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

/**
 * Guarda la pregunta y la respuesta en `charcu.chat_messages`.
 *
 * Sin esto, retomar una receta no sirve de nada: el usuario ve un chat vacío
 * y —peor— el modelo pierde el contexto de lo que estaba curando, así que
 * vuelve a preguntar los kilos y la humedad que ya le habían dicho.
 *
 * ⚠️ La FOTO no se guarda todavía. Guardar imágenes de la cocina de alguien es
 * dato personal, cuesta almacenamiento y hay que decidir cuánto tiempo se
 * conservan — está pendiente de que Cristian lo decida. Por ahora se apunta que
 * hubo foto, no la foto.
 */
export async function saveExchange(params: {
  readonly recipeId: string;
  readonly visitorId: string;
  readonly userId: string | null;
  readonly question: string;
  readonly answer: string;
}): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const { error } = await createSupabaseAdminClient()
    .from('chat_messages')
    .insert([
      {
        recipe_id: params.recipeId,
        visitor_id: params.visitorId,
        user_id: params.userId,
        role: 'user',
        content: params.question,
      },
      {
        recipe_id: params.recipeId,
        visitor_id: params.visitorId,
        user_id: params.userId,
        role: 'assistant',
        content: params.answer,
      },
    ]);

  if (error !== null) {
    console.error('[receta] no se pudo guardar la conversación:', error.message);
  }
}

/** El historial de una receta, en orden. Vacío si no hay o no se pudo leer. */
export async function recipeMessages(
  recipeId: string,
): Promise<readonly StoredMessage[]> {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const { data, error } = await createSupabaseAdminClient()
    .from('chat_messages')
    .select('id, role, content')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true })
    .limit(60);

  if (error !== null || data === null) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    role: row.role === 'user' ? ('user' as const) : ('assistant' as const),
    content: row.content,
  }));
}

/** Título y estado de una receta, para la cabecera del chat. */
export async function recipeHeader(
  recipeId: string,
): Promise<{ readonly title: string } | null> {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const { data, error } = await createSupabaseAdminClient()
    .from('recipes')
    .select('title')
    .eq('id', recipeId)
    .maybeSingle();

  return error !== null || data === null ? null : { title: data.title };
}

/** Una conversación en la lista del historial. */
export interface RecipeSummary {
  readonly id: string;
  readonly title: string;
  /** ISO 8601. La lista se ordena por esto, no por cuándo se creó. */
  readonly lastMessageAt: string;
}

/**
 * Las conversaciones de este visitante o de esta cuenta, de la más reciente a
 * la más vieja.
 *
 * Se ordena por `last_message_at` y no por `started_at` a propósito: quien
 * abre el historial busca "en qué estaba", y eso es lo último que tocó, no lo
 * último que empezó.
 *
 * El tope de 50 es para que la primera versión no traiga un año de historial a
 * un celular. Cuando alguien lo roce, tocará paginar.
 */
export async function listRecipes(
  visitorId: string,
  userId: string | null,
): Promise<readonly RecipeSummary[]> {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const query = createSupabaseAdminClient()
    .from('recipes')
    .select('id, title, last_message_at')
    .neq('status', 'descartada')
    .order('last_message_at', { ascending: false })
    .limit(50);

  // Con cuenta se listan las de la cuenta; sin cuenta, las de este navegador.
  const { data, error } =
    userId === null
      ? await query.eq('visitor_id', visitorId)
      : await query.eq('user_id', userId);

  if (error !== null || data === null) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    lastMessageAt: row.last_message_at,
  }));
}

/**
 * Le pone nombre a una receta.
 *
 * Lo llama el titulador automático después de la primera respuesta. Es un
 * `update` a secas: quien decide que la receta es suya es quien llama.
 */
export async function renameRecipe(recipeId: string, title: string): Promise<void> {
  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const clean = title.trim().slice(0, 60);
  if (clean === '') {
    return;
  }

  const { error } = await createSupabaseAdminClient()
    .from('recipes')
    .update({ title: clean })
    .eq('id', recipeId);

  if (error !== null) {
    console.error('[receta] no se pudo renombrar:', error.message);
  }
}
