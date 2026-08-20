import { NextResponse, type NextRequest } from 'next/server';

import { listRecipes } from '@/entities/recipe-chat/server';

import { currentUser } from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/**
 * El historial de conversaciones, para el panel de la hamburguesa.
 *
 * Devuelve solo lo que hace falta para pintar la lista —id, título y cuándo
 * fue el último mensaje—, no los mensajes. Un historial de veinte recetas con
 * su conversación entera serían cientos de kilobytes por abrir un panel.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);
  const user = await currentUser();

  const recipes = await listRecipes(visitorId, user?.id ?? null);

  return attachVisitorCookie(NextResponse.json({ recipes }), visitorId);
}
