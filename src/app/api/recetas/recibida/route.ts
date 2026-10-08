import { NextResponse, type NextRequest } from 'next/server';

import { recordReceivedRecipe } from '@/entities/recipe/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

const SLUG = /^[a-z0-9-]{1,80}$/;

/**
 * Apunta que esta persona abrió esta receta por su link, para "Las que te
 * llegaron" (diseño final, 2026-10-07).
 *
 * La llama la página de la receta DESPUÉS de pintarse: la receta es estática
 * y no espera a esto. Sin cuenta se guarda a nombre del visitante (cookie
 * httpOnly, por eso va por aquí y no desde el navegador); al entrar pasa a la
 * cuenta. Un slug que no existe no se apunta (lo comprueba la base).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);
  const payload: unknown = await request.json().catch(() => null);
  const slug =
    typeof payload === 'object' && payload !== null && 'slug' in payload
      ? payload.slug
      : null;

  if (typeof slug !== 'string' || !SLUG.test(slug)) {
    return attachVisitorCookie(
      NextResponse.json({ error: 'slug-invalido' }, { status: 400 }),
      visitorId,
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  await recordReceivedRecipe(slug, visitorId, data.user?.id ?? null).catch(() => {});

  return attachVisitorCookie(new NextResponse(null, { status: 204 }), visitorId);
}
