import { createClient } from '@supabase/supabase-js';

import { type Database } from '@/shared/api/supabase/database.types';

/**
 * Acceso de administración a QA para preparar y leer datos en los tests.
 * Solo QA: si `.env.local` apunta a otra base, se niega.
 */
const QA_REF = 'lcvmsbfnnpviumsqcxip';

export type AdminClient = ReturnType<typeof createClient<Database, 'charcu'>>;

let client: AdminClient | null = null;

export function admin(): AdminClient {
  if (client !== null) {
    return client;
  }
  process.loadEnvFile('.env.local');
  const url = process.env.SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SECRET_KEY ?? '';
  if (!url.includes(QA_REF) || key === '') {
    throw new Error('Los e2e solo corren contra la base de QA.');
  }
  client = createClient<Database, 'charcu'>(url, key, {
    db: { schema: 'charcu' },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function userIdOf(email: string): Promise<string> {
  const { data } = await admin().auth.admin.listUsers({ perPage: 1000 });
  const user = data.users.find((u) => u.email === email);
  if (user === undefined) {
    throw new Error(`No existe ${email}`);
  }
  return user.id;
}

/** Las lecciones de un curso, en el orden en que se ven. */
export async function lessonIdsOf(slug: string): Promise<string[]> {
  const { data } = await admin()
    .from('courses')
    .select('modules(position, lessons(id, position))')
    .eq('slug', slug)
    .single();

  return [...(data?.modules ?? [])]
    .sort((a, b) => a.position - b.position)
    .flatMap((m) => [...m.lessons].sort((a, b) => a.position - b.position))
    .map((l) => l.id);
}

/** Borra todo el progreso de una cuenta: el test arranca desde cero. */
export async function resetProgress(userId: string): Promise<void> {
  await admin().from('lesson_progress').delete().eq('user_id', userId);
}

/** La siguiente lección pendiente según la base (`course_progress`). */
export async function nextLessonOf(userId: string, slug: string): Promise<string | null> {
  const { data: course } = await admin()
    .from('courses')
    .select('id')
    .eq('slug', slug)
    .single();
  const { data } = await admin().rpc('course_progress', { p_user_id: userId });
  return (data ?? []).find((row) => row.course_id === course?.id)?.next_lesson_id ?? null;
}
