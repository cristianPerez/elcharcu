import { NextResponse, type NextRequest } from 'next/server';

import { isCourseCategory } from '@/entities/course';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { reportError } from '@/shared/lib';

/**
 * Pedir un curso que todavía no existe (0030).
 *
 * Llega UNA de dos cosas: `{ category }` —el voto de "Quiero un curso de
 * quesos"— o `{ body }` —"¿Qué pieza quieres aprender?"—. Se escribe con el
 * cliente CON SESIÓN: la política solo deja insertar como uno mismo, así que
 * nadie puede pedir en nombre de otro.
 *
 * Votar dos veces la misma categoría choca con el índice único y se contesta
 * igual que la primera: para quien toca, ya está pedido.
 */
const MAX_BODY = 280;
const MIN_BODY = 3;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload: unknown = await request.json().catch(() => null);
  const fields =
    typeof payload === 'object' && payload !== null
      ? (payload as Record<string, unknown>)
      : {};

  const category = isCourseCategory(fields.category) ? fields.category : null;
  const body = typeof fields.body === 'string' ? fields.body.trim() : '';

  if (category === null && (body.length < MIN_BODY || body.length > MAX_BODY)) {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('course_requests')
    .insert(category === null ? { body } : { category });

  if (error === null || error.code === '23505') {
    return NextResponse.json({ ok: true });
  }

  if (error.code === '42501') {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401 });
  }

  reportError('pedidos-de-cursos', 'no se pudo guardar', { detail: error.message });
  return NextResponse.json({ error: 'no-se-pudo' }, { status: 500 });
}
