import { NextResponse, type NextRequest } from 'next/server';

import { ownsRecipe, recipeHeader, recipeMessages } from '@/entities/recipe-chat/server';

import { currentUser } from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

const VACIA = { recipeId: null, title: null, messages: [] };

/**
 * Una conversación concreta, pedida por su id.
 *
 * ⚠️ Cambió el 2026-08-20. Antes, sin id, devolvía "la última receta abierta"
 * — y ese rescate automático es justo lo que impedía que existieran chats
 * nuevos: daba igual lo que quisiera el navegador, el servidor lo devolvía
 * siempre a la conversación anterior.
 *
 * Ahora manda el navegador, que es quien sabe si esta es una sesión nueva (ver
 * la regla de las 6 horas en `features/assistant-chat/lib/activeChat.ts`). Sin
 * `id`, se contesta vacío: empezar en blanco es una respuesta válida, no un
 * error.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);
  const recipeId = new URL(request.url).searchParams.get('id');

  if (recipeId === null || recipeId === '') {
    return attachVisitorCookie(NextResponse.json(VACIA), visitorId);
  }

  const user = await currentUser();

  // Que la receta sea suya no es un detalle: sin esto, cambiar un id en la URL
  // enseñaría la conversación de otra persona.
  const isOwn = await ownsRecipe(recipeId, visitorId, user?.id ?? null);
  if (!isOwn) {
    return attachVisitorCookie(NextResponse.json(VACIA), visitorId);
  }

  const [header, messages] = await Promise.all([
    recipeHeader(recipeId),
    recipeMessages(recipeId),
  ]);

  return attachVisitorCookie(
    NextResponse.json({ recipeId, title: header?.title ?? null, messages }),
    visitorId,
  );
}
