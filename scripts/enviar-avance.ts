/**
 * El correo "esto es lo que llevas estudiado" de UNA cuenta: lo dibuja en un
 * archivo para revisarlo, o lo manda a la dirección que se le diga.
 *
 *     # 1. verlo sin mandar nada (escribe el HTML y lo abre quien quiera)
 *     npx tsx scripts/enviar-avance.ts .env.prod <user_id> --vista-previa /tmp/avance.html
 *
 *     # 2. mandarlo a una dirección concreta (la de prueba, o la de la persona)
 *     npx tsx scripts/enviar-avance.ts .env.prod <user_id> correo@destino.com
 *
 * NUNCA adivina el destinatario: o es `--vista-previa`, o es el correo que se
 * escribe a mano. Lee la base en SOLO LECTURA.
 *
 * `--sesiones` y `--minutos` son los de Mixpanel (`$session_end`,
 * `$duration_s`): Supabase solo guarda marcas de actividad y subestima el
 * tiempo real, así que el tiempo se pasa a mano. Sin ellos el correo sale sin
 * las cifras de tiempo.
 */
import { readFileSync, writeFileSync } from 'node:fs';

import { createClient } from '@supabase/supabase-js';

import {
  recapVariables,
  TEMPLATE_ALIAS,
  TEMPLATE_HTML,
  TEMPLATE_SUBJECT,
  type CourseAdvance,
  type Release,
} from '../src/features/study-recap';
import { type Database } from '../src/shared/api/supabase/database.types';

/** El curso que se corrigió y al que apunta el botón. */
const FIXED_SLUG = 'chorizos-picantes-jalapeno-queso-cheddar';

/**
 * De dónde salen la portada y los enlaces: la propia página de producción.
 * Con `www` porque `elcharcu.co` redirige ahí con un 308 y varios clientes de
 * correo no siguen la redirección al cargar una imagen.
 */
const SITE = 'https://www.elcharcu.co';

function loadEnv(path: string): void {
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = /^([A-Z_]+)=(.*)$/.exec(line);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

function flag(name: string): number | null {
  const i = process.argv.indexOf(`--${name}`);
  const raw = i === -1 ? undefined : process.argv[i + 1];
  const value = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(value) ? value : null;
}

/** Los estrenos del mes en curso (Bogotá), de `charcu.courses.releases_on`. */
function thisMonth(
  rows: readonly { title: string; releases_on: string | null }[],
  now: Date,
): Release[] {
  const prefix = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
  })
    .format(now)
    .slice(0, 7);
  return rows
    .filter(
      (r): r is { title: string; releases_on: string } =>
        r.releases_on?.startsWith(prefix) === true,
    )
    .sort((a, b) => a.releases_on.localeCompare(b.releases_on))
    .map((r) => ({ title: r.title, releasesOn: r.releases_on }));
}

async function main(): Promise<void> {
  const [envPath, userId, target] = process.argv.slice(2);
  if (envPath === undefined || userId === undefined || target === undefined) {
    console.error(
      'uso: enviar-avance.ts <.env> <user_id> <correo | --vista-previa archivo.html>',
    );
    process.exit(1);
  }
  loadEnv(envPath);
  const db = createClient<Database, 'charcu'>(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_SECRET_KEY ?? '',
    {
      db: { schema: 'charcu' },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const [profile, progress, courseRows, lessonRows] = await Promise.all([
    db.from('profiles').select('full_name, created_at').eq('id', userId).maybeSingle(),
    db
      .from('lesson_progress')
      .select('completed_at, lessons(module_id)')
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    db.from('courses').select('id, slug, title, releases_on, cover_url'),
    db.from('lessons').select('id, module_id, modules(course_id)'),
  ]);

  const courseOf = new Map<string, string>();
  for (const l of lessonRows.data ?? []) {
    if (l.modules?.course_id != null) courseOf.set(l.module_id, l.modules.course_id);
  }
  const totals = new Map<string, number>();
  for (const l of lessonRows.data ?? []) {
    const id = courseOf.get(l.module_id);
    if (id !== undefined) totals.set(id, (totals.get(id) ?? 0) + 1);
  }
  const done = new Map<string, number>();
  let last = new Date(0);
  for (const p of progress.data ?? []) {
    const id =
      p.lessons?.module_id === undefined ? undefined : courseOf.get(p.lessons.module_id);
    if (id !== undefined) done.set(id, (done.get(id) ?? 0) + 1);
    const at = new Date(p.completed_at ?? 0);
    if (at > last) last = at;
  }

  const byId = new Map((courseRows.data ?? []).map((c) => [c.id, c]));
  const courses: CourseAdvance[] = [...done.entries()]
    .map(([id, n]) => ({
      title: byId.get(id)?.title ?? '',
      done: n,
      total: totals.get(id) ?? n,
    }))
    .filter((c) => c.title !== '')
    .sort((a, b) => b.done - a.done);

  const fixedRow = (courseRows.data ?? []).find((c) => c.slug === FIXED_SLUG);
  const fixed = courses.find((c) => c.title === fixedRow?.title);
  if (fixedRow === undefined || fixed === undefined) {
    console.error(`esa cuenta no tiene progreso en ${FIXED_SLUG}`);
    process.exit(1);
  }
  const cover = fixedRow.cover_url ?? '';
  if (cover === '') {
    console.error(`${FIXED_SLUG} no tiene cover_url: el correo iría sin imagen`);
    process.exit(1);
  }

  const sessions = flag('sesiones');
  const totalMinutes = flag('minutos');
  const variables = recapVariables({
    name: profile.data?.full_name ?? '',
    since: new Date(profile.data?.created_at ?? Date.now()),
    lastStudyDay: last,
    lessonsCompleted: (progress.data ?? []).length,
    courses,
    sessions,
    totalMinutes,
    avgMinutes:
      sessions === null || totalMinutes === null ? null : totalMinutes / sessions,
    fixedCourse: fixed,
    fixedCourseUrl: `${SITE}/cursos/${FIXED_SLUG}`,
    fixedCourseImage: cover.startsWith('http') ? cover : `${SITE}${cover}`,
    releases: thisMonth(courseRows.data ?? [], new Date()),
  });

  if (target === '--vista-previa') {
    const out = process.argv[5] ?? '/tmp/avance.html';
    const html = Object.entries(variables).reduce(
      (acc, [k, v]) => acc.replaceAll(`{{{${k}}}}`, v),
      TEMPLATE_HTML,
    );
    writeFileSync(out, html);
    console.log(
      'asunto:',
      Object.entries(variables).reduce(
        (a, [k, v]) => a.replaceAll(`{{{${k}}}}`, v),
        TEMPLATE_SUBJECT,
      ),
    );
    console.log('escrito en', out, '— no se mandó nada');
    return;
  }

  const { sendTemplateEmail } = await import('../src/shared/api/email');
  const result = await sendTemplateEmail({
    to: target,
    template: TEMPLATE_ALIAS,
    variables,
    idempotencyKey: `avance-${userId}-${new Date().toISOString().slice(0, 10)}-${target}`,
  });
  console.log(result.sent ? `enviado a ${target}` : `NO se envió: ${result.reason}`);
}

void main();
