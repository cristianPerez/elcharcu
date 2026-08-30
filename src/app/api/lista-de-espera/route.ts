import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

/**
 * Apuntarse a la lista de espera de un curso.
 *
 * Usa el cliente CON SESIÓN, no la clave de servicio: `join_waitlist` saca el
 * `auth.uid()` por dentro, así que nadie puede apuntar a otro. Con la clave de
 * servicio habría que fiarse de un `userId` del cuerpo.
 *
 * La función devuelve el contador nuevo, y por eso esta ruta lo devuelve
 * también: la pantalla puede subir la barra sin volver a pedir la página.
 */

/** Los motivos que la base sabe dar, traducidos a algo que se pueda leer. */
const REASONS: Record<string, { status: number; message: string }> = {
  'sin-sesion': { status: 401, message: 'Entra con tu correo para apuntarte.' },
  'curso-no-existe': { status: 404, message: 'Ese curso ya no está.' },
  'curso-no-esta-en-lista-de-espera': {
    status: 409,
    message: 'Este curso ya está abierto. Ábrelo y empieza.',
  },
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload: unknown = await request.json().catch(() => null);

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const { courseId } = payload as Record<string, unknown>;

  if (typeof courseId !== 'string' || courseId === '') {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('join_waitlist', {
    p_course_id: courseId,
  });

  if (error !== null) {
    // El mensaje de Postgres trae el motivo que levantó la función. Se busca
    // por inclusión porque viene envuelto en el texto del error.
    const known = Object.entries(REASONS).find(([reason]) =>
      error.message.includes(reason),
    );

    if (known !== undefined) {
      return NextResponse.json(
        { error: known[0], message: known[1].message },
        { status: known[1].status },
      );
    }

    console.error('[lista-de-espera] no se pudo apuntar:', error.message);
    return NextResponse.json({ error: 'no-se-pudo' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: data ?? 0 });
}
