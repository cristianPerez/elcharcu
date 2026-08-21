import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import {
  type Course,
  type CourseAccess,
  type CourseLevel,
  type CourseModule,
  type CourseProgress,
  type CourseWithModules,
  type Lesson,
} from '../model/course.types';

/**
 * Los cursos, leídos desde el SERVIDOR con la sesión del usuario.
 *
 * Ojo con esto: se usa el cliente de sesión y NO el de administración, a
 * propósito. Es lo que hace que RLS decida qué se entrega — el curso de pago
 * simplemente no aparece en la respuesta para quien no tiene suscripción. Con
 * la clave de administración se saltaría la puerta y habría que reimplementarla
 * en TypeScript, que es justo lo que D12 quiso evitar.
 */

/** El texto de la base es libre; aquí se estrecha a lo que la app entiende. */
function toLevel(value: string): CourseLevel {
  return value === 'intermedio' || value === 'avanzado' ? value : 'para-empezar';
}

function toAccess(value: string): CourseAccess {
  return value === 'libre' ? 'libre' : 'pago';
}

interface CourseRow {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly cover_url: string | null;
  readonly level: string;
  readonly access: string;
  readonly position: number;
}

function toCourse(row: CourseRow, isLocked = false): Course {
  return {
    isLocked,
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    coverUrl: row.cover_url,
    level: toLevel(row.level),
    access: toAccess(row.access),
    position: row.position,
  };
}

interface LessonRow {
  readonly id: string;
  readonly module_id: string;
  readonly kind: string;
  readonly title: string;
  readonly summary: string;
  readonly position: number;
  readonly duration_s: number | null;
  readonly poster_url: string | null;
  readonly bunny_video_id: string | null;
  readonly file_url: string | null;
  readonly body: string | null;
  readonly ask: string | null;
}

/**
 * Fila → lección del tipo que toque.
 *
 * Devuelve `null` si la fila no cuadra con su propio tipo (un PDF sin archivo).
 * La base ya lo impide con un `check`, pero una fila rota no debería tumbar la
 * pantalla entera de un curso: se cae esa lección y el resto se ve.
 */
function toLesson(row: LessonRow): Lesson | null {
  const base = {
    id: row.id,
    moduleId: row.module_id,
    title: row.title,
    summary: row.summary,
    position: row.position,
    posterUrl: row.poster_url,
    ask: row.ask,
  };

  switch (row.kind) {
    case 'video':
      return {
        ...base,
        kind: 'video',
        bunnyVideoId: row.bunny_video_id,
        durationSeconds: row.duration_s,
        body: row.body,
      };
    case 'pdf':
      return row.file_url === null
        ? null
        : { ...base, kind: 'pdf', fileUrl: row.file_url };
    case 'imagen':
      return row.file_url === null
        ? null
        : { ...base, kind: 'imagen', fileUrl: row.file_url };
    case 'texto':
      return row.body === null ? null : { ...base, kind: 'texto', body: row.body };
    default:
      return null;
  }
}

/**
 * El catálogo entero, en su orden, marcando cuáles están bloqueados.
 *
 * El catálogo es público desde el 2026-08-21: se ven todos los cursos
 * publicados, de pago incluidos. Lo que sigue cerrado es el contenido.
 *
 * Para saber qué está cerrado se le pregunta a la base por los MÓDULOS: esa
 * tabla sí está protegida por RLS, así que solo devuelve los de cursos que
 * esta persona puede abrir. Se usa eso y no `access === 'pago'` porque un
 * suscriptor también tiene cursos de pago y para él no están bloqueados —
 * duplicar aquí la regla de la suscripción sería tener dos verdades.
 *
 * Ojo con la tentación de usar el número de lecciones que devuelve
 * `course_progress`: esa función es `security definer` y cuenta saltándose
 * RLS, así que dice 13 aunque no puedas ver ninguna.
 */
export async function listCourses(): Promise<readonly Course[]> {
  const supabase = await createSupabaseServerClient();

  const [{ data, error }, { data: openModules }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, slug, title, summary, cover_url, level, access, position')
      .order('position'),
    supabase.from('modules').select('course_id'),
  ]);

  if (error !== null || data === null) {
    return [];
  }

  const readable = new Set((openModules ?? []).map((row) => row.course_id));

  return data.map((row) => toCourse(row, !readable.has(row.id)));
}

/**
 * El ÍNDICE de un curso cerrado: títulos y orden, sin nada que se pueda ver.
 *
 * Viene de `charcu.course_outline`, que es `security definer` y devuelve
 * adrede solo lo que se pinta en el acordeón. Ni `bunny_video_id` ni `body`:
 * los enlaces de Bunny no van firmados todavía, así que entregar el id sería
 * entregar el video.
 *
 * Las lecciones que salen de aquí se marcan todas como `kind: 'video'` con las
 * fuentes en `null`. No es una mentira que importe —lo único que se pinta es el
 * título— y evita inventar un `fileUrl` vacío para un PDF que nadie va a abrir.
 */
async function courseOutline(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  slug: string,
): Promise<readonly CourseModule[]> {
  const { data } = await supabase.rpc('course_outline', { p_slug: slug });

  if (data === null || data === undefined) {
    return [];
  }

  const modules = new Map<
    string,
    { title: string; summary: string; position: number; lessons: Lesson[] }
  >();

  for (const row of data) {
    const found = modules.get(row.module_id) ?? {
      title: row.module_title,
      summary: row.module_summary,
      position: row.module_position,
      lessons: [],
    };

    found.lessons.push({
      kind: 'video',
      id: row.lesson_id,
      moduleId: row.module_id,
      title: row.lesson_title,
      summary: row.lesson_summary,
      position: row.lesson_position,
      posterUrl: null,
      ask: null,
      bunnyVideoId: null,
      durationSeconds: null,
      body: null,
    });

    modules.set(row.module_id, found);
  }

  return [...modules].map(([id, m]) => ({ id, ...m }));
}

/** Un curso con sus módulos y lecciones, o `null` si no existe. */
export async function findCourse(slug: string): Promise<CourseWithModules | null> {
  const supabase = await createSupabaseServerClient();

  const { data: courseRow } = await supabase
    .from('courses')
    .select('id, slug, title, summary, cover_url, level, access, position')
    .eq('slug', slug)
    .maybeSingle();

  if (courseRow === null) {
    return null;
  }

  const { data: moduleRows } = await supabase
    .from('modules')
    .select('id, title, summary, position')
    .eq('course_id', courseRow.id)
    .order('position');

  const modules = moduleRows ?? [];

  /*
    Sin módulos por RLS = curso cerrado para esta persona. Se enseña el índice
    igual, que es lo que da ganas de pagar: un candado sin nada detrás no vende.
    El muro aparece al INTENTAR ABRIR una lección, no antes.
  */
  if (modules.length === 0) {
    return {
      ...toCourse(courseRow, true),
      modules: await courseOutline(supabase, slug),
    };
  }

  const moduleIds = modules.map((m) => m.id);

  // Sin guardia de lista vacía: si `modules` estuviera vacío ya se habría
  // devuelto el índice más arriba.
  const { data: lessonRows } = await supabase
    .from('lessons')
    .select(
      'id, module_id, kind, title, summary, position, duration_s, poster_url, bunny_video_id, file_url, body, ask',
    )
    .in('module_id', moduleIds)
    .order('position');

  const lessons = (lessonRows ?? [])
    .map(toLesson)
    .filter((lesson): lesson is Lesson => lesson !== null);

  const withLessons: readonly CourseModule[] = modules.map((m) => ({
    id: m.id,
    title: m.title,
    summary: m.summary,
    position: m.position,
    lessons: lessons.filter((lesson) => lesson.moduleId === m.id),
  }));

  return { ...toCourse(courseRow), modules: withLessons };
}

/**
 * Cuánto lleva esta persona de cada curso.
 *
 * Se devuelve como mapa por `courseId` porque quien lo pide es una LISTA: la
 * pantalla de "Mis cursos" pinta una barra por fila, y hacer una consulta por
 * curso sería una petición por tarjeta.
 */
export async function progressByCourse(
  userId: string,
): Promise<ReadonlyMap<string, CourseProgress>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('course_progress', { p_user_id: userId });

  if (error !== null || data === null) {
    return new Map();
  }

  return new Map(
    data.map((row) => [
      row.course_id,
      {
        courseId: row.course_id,
        totalLessons: row.total_lessons,
        doneLessons: row.done_lessons,
        percent: row.percent,
        nextLessonId: row.next_lesson_id,
      },
    ]),
  );
}

/** Qué lecciones tiene terminadas, para pintar las palomitas del acordeón. */
export async function completedLessonIds(userId: string): Promise<ReadonlySet<string>> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  return new Set((data ?? []).map((row) => row.lesson_id));
}
