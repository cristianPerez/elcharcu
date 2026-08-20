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

function toCourse(row: CourseRow): Course {
  return {
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

/** Los cursos que esta persona puede ver, en su orden. */
export async function listCourses(): Promise<readonly Course[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('courses')
    .select('id, slug, title, summary, cover_url, level, access, position')
    .order('position');

  if (error !== null || data === null) {
    return [];
  }

  return data.map(toCourse);
}

/** Un curso con sus módulos y lecciones, o `null` si no existe o no le toca. */
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
  const moduleIds = modules.map((m) => m.id);

  const { data: lessonRows } =
    moduleIds.length === 0
      ? { data: [] }
      : await supabase
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
