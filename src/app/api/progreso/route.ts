import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { reportError } from '@/shared/lib';

interface ProgressPayload {
  readonly lessonId: string;
  readonly second: number;
  readonly completed: boolean;
}

function parse(value: unknown): ProgressPayload | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const { lessonId, second, completed } = value as Record<string, unknown>;

  if (typeof lessonId !== 'string' || lessonId === '') {
    return null;
  }

  return {
    lessonId,
    second:
      typeof second === 'number' && Number.isFinite(second) ? Math.max(0, second) : 0,
    completed: completed === true,
  };
}

/**
 * Apunta por dónde va alguien en una lección.
 *
 * No escribe en la tabla directamente: llama a `charcu.save_lesson_progress`,
 * que comprueba que esa lección sea suya de ver. Si no, cualquiera marcaría
 * como completado un curso que no compró y el porcentaje dejaría de
 * significar nada.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload: unknown = await request.json().catch(() => null);
  const progress = parse(payload);

  if (progress === null) {
    return NextResponse.json({ error: 'datos-invalidos' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (authData.user === null) {
    return NextResponse.json({ error: 'sin-sesion' }, { status: 401 });
  }

  const { error } = await supabase.rpc('save_lesson_progress', {
    p_lesson_id: progress.lessonId,
    p_second: Math.round(progress.second),
    p_completed: progress.completed,
  });

  if (error !== null) {
    reportError('progreso', 'no se pudo guardar', { detail: error.message });
    return NextResponse.json({ error: 'no-se-pudo-guardar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
