import { NextResponse, type NextRequest } from 'next/server';

import {
  latestOpenRecipe,
  recipeHeader,
  recipeMessages,
} from '@/entities/recipe-chat/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/**
 * La receta abierta y su conversación.
 *
 * El chat la pide al cargar, y por eso una recarga deja de ser una amnesia: el
 * usuario ve lo que ya había hablado y el modelo recupera el contexto — los
 * kilos, la humedad, qué pieza es — en vez de volver a preguntarlo todo.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const recipeId = await latestOpenRecipe(visitorId, userId);

  if (recipeId === null) {
    return attachVisitorCookie(
      NextResponse.json({ recipeId: null, title: null, messages: [] }),
      visitorId,
    );
  }

  const [header, messages] = await Promise.all([
    recipeHeader(recipeId),
    recipeMessages(recipeId),
  ]);

  return attachVisitorCookie(
    NextResponse.json({
      recipeId,
      title: header?.title ?? null,
      messages,
    }),
    visitorId,
  );
}
