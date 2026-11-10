import { type SupabaseAdminClient } from '@/shared/api/supabase/server';

import { type CheckoutUrls, type LearningSummary } from '../model/types';

/** Cuántos días antes del corte empieza el aviso diario. */
export const DAYS_BEFORE = 3;

interface ManualPlanRow {
  readonly user_id: string;
  readonly current_period_end: string;
}

/**
 * Planes activos SIN pasarela (`provider` null: Nequi, transferencia,
 * cortesía) que terminan en los próximos `DAYS_BEFORE` días, solo de `allowed`.
 */
export async function endingManualPlans(
  db: SupabaseAdminClient,
  allowed: readonly string[],
  now: Date,
): Promise<readonly ManualPlanRow[]> {
  if (allowed.length === 0) return [];
  const until = new Date(now.getTime() + DAYS_BEFORE * 24 * 60 * 60 * 1000);
  const { data } = await db
    .from('subscriptions')
    .select('user_id, current_period_end')
    .is('provider', null)
    .eq('status', 'active')
    .in('user_id', [...allowed])
    .gt('current_period_end', now.toISOString())
    .lte('current_period_end', until.toISOString());
  return (data ?? []).filter((r): r is ManualPlanRow => r.current_period_end !== null);
}

/** Lo que la persona hizo en su período: preguntas, lecciones, conversaciones y su curso más avanzado. */
export async function collectLearning(
  db: SupabaseAdminClient,
  row: ManualPlanRow,
): Promise<LearningSummary | null> {
  const { data: auth } = await db.auth.admin.getUserById(row.user_id);
  const email = auth.user?.email ?? null;
  if (email === null) return null;

  const [profile, questions, conversations, progress] = await Promise.all([
    db.from('profiles').select('full_name, whatsapp').eq('id', row.user_id).maybeSingle(),
    db
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', row.user_id)
      .eq('role', 'user'),
    db.from('recipes').select('title').eq('user_id', row.user_id).order('started_at'),
    db
      .from('lesson_progress')
      .select('completed_at, lessons(module_id, modules(course_id, courses(title)))')
      .eq('user_id', row.user_id)
      .not('completed_at', 'is', null),
  ]);

  const done = new Map<string, { title: string; done: number }>();
  for (const p of progress.data ?? []) {
    const course = p.lessons?.modules;
    if (course?.courses == null) continue;
    const prev = done.get(course.course_id) ?? { title: course.courses.title, done: 0 };
    done.set(course.course_id, { ...prev, done: prev.done + 1 });
  }
  const best = [...done.entries()].sort((a, b) => b[1].done - a[1].done)[0];
  let course: LearningSummary['course'] = null;
  if (best !== undefined) {
    const { count } = await db
      .from('lessons')
      .select('id, modules!inner(course_id)', { count: 'exact', head: true })
      .eq('modules.course_id', best[0]);
    course = { title: best[1].title, done: best[1].done, total: count ?? best[1].done };
  }

  const whatsapp = (profile.data?.whatsapp ?? '').replace(/\D/g, '');
  return {
    userId: row.user_id,
    email,
    name: profile.data?.full_name ?? '',
    whatsappTail: whatsapp.length >= 4 ? whatsapp.slice(-4) : null,
    periodEnd: new Date(row.current_period_end),
    questions: questions.count ?? 0,
    lessonsCompleted: (progress.data ?? []).length,
    topics: (conversations.data ?? []).map((c) => c.title ?? '').filter((t) => t !== ''),
    course,
  };
}

/** Los enlaces del Pro en OnePay del modo indicado (`charcu.plan_checkout`). */
export async function proCheckoutUrls(
  db: SupabaseAdminClient,
  modo: 'produccion' | 'pruebas',
): Promise<CheckoutUrls | null> {
  const { data } = await db
    .from('plan_checkout')
    .select('plan_id, url')
    .eq('modo', modo)
    .in('plan_id', ['pro-anual', 'pro-mensual']);
  const url = (id: string): string | undefined =>
    data?.find((r) => r.plan_id === id)?.url;
  const anual = url('pro-anual');
  const mensual = url('pro-mensual');
  return anual === undefined || mensual === undefined ? null : { anual, mensual };
}
