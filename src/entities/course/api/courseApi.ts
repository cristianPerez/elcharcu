import { cache } from 'react';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';

import {
  type Course,
  type CourseAccess,
  type CourseKind,
  type CourseLevel,
  type CourseStatus,
  type CourseModule,
  type CourseProgress,
  type CourseWithModules,
  type Lesson,
} from '../model/course.types';

/**
 * Los cursos, leídos desde el SERVIDOR con la sesión del usuario.
 *
 * ⚠️ TODO LO QUE LEE VA ENVUELTO EN `cache()` de React, y no es un adorno.
 *
 * `cache()` no guarda nada entre peticiones: deduplica dentro de la MISMA. Y
 * hacía falta porque la página de una lección pedía el curso DOS veces —una en
 * `generateMetadata` y otra al pintar— y cada `findCourse` son tres consultas
 * en cadena (curso → módulos → lecciones). Seis viajes a Supabase para
 * responder tres veces lo mismo, en cada toque de "siguiente lección".
 *
 * Es el mismo arreglo que ya se le hizo a `currentUser()` el 2026-08-19, por
 * el mismo motivo: el dato no estaba mal, se pedía de más.
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

function toKind(value: string): CourseKind {
  return value === 'capsula' ? 'capsula' : 'curso';
}

function toStatus(value: string): CourseStatus {
  return value === 'lista-de-espera' || value === 'publicado' ? value : 'borrador';
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
  readonly kind: string;
  readonly status: string;
  readonly waitlist_goal: number | null;
}

/** Las columnas que pide toda consulta de curso. En un sitio, no en cuatro. */
const COURSE_COLUMNS =
  'id, slug, title, summary, cover_url, level, access, position, kind, status, waitlist_goal';

/**
 * El curso con sus módulos y lecciones dentro, en UNA consulta.
 *
 * PostgREST resuelve el anidado en Postgres y devuelve JSON ya armado. Lo
 * importante: **RLS se sigue aplicando a cada tabla embebida**. Comprobado
 * contra la base — un curso en lista de espera pedido por un anónimo devuelve
 * `"modules": []`, y el libre devuelve los tres módulos con sus videos. Así que
 * `modules` vacío sigue significando "cerrado para esta persona", que es la
 * misma señal que usaba la versión de tres consultas.
 */
const COURSE_TREE_COLUMNS = `${COURSE_COLUMNS}, modules(id, title, summary, position, lessons(id, module_id, kind, title, summary, position, duration_s, poster_url, bunny_video_id, file_url, body, ask))`;

interface WaitlistInfo {
  readonly count: number;
  readonly isIn: boolean;
}

function toCourse(
  row: CourseRow,
  isLocked = false,
  waitlist: WaitlistInfo = { count: 0, isIn: false },
): Course {
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
    kind: toKind(row.kind),
    status: toStatus(row.status),
    waitlistGoal: row.waitlist_goal,
    waitlistCount: waitlist.count,
    isInWaitlist: waitlist.isIn,
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
export const listCourses = cache(async (): Promise<readonly Course[]> => {
  const supabase = await createSupabaseServerClient();

  const [{ data, error }, { data: openModules }] = await Promise.all([
    supabase.from('courses').select(COURSE_COLUMNS).order('position'),
    supabase.from('modules').select('course_id'),
  ]);

  if (error !== null || data === null) {
    return [];
  }

  const readable = new Set((openModules ?? []).map((row) => row.course_id));

  const waiting = data.filter((row) => row.status === 'lista-de-espera');
  const waitlist = await waitlistInfo(
    supabase,
    waiting.map((row) => row.id),
  );

  return data.map((row) =>
    toCourse(
      row,
      !readable.has(row.id),
      waitlist.get(row.id) ?? { count: 0, isIn: false },
    ),
  );
});

/**
 * Cuánta gente espera cada curso, y si quien mira ya se apuntó.
 *
 * DOS consultas para todos los cursos, no dos por curso (2026-08-29). Antes
 * esto llamaba a `course_waitlist_count()` una vez por curso en espera; con
 * cuatro no se notaba, pero crecía con el catálogo y lo pagaba justo la
 * pantalla que abre la app.
 *
 * El CONTADOR sale de `course_waitlist_totals()`, que agrega en Postgres y
 * devuelve solo `course_id` y `total`. Es `security definer` a propósito: si
 * respetara RLS contaría únicamente las filas propias y la barra diría siempre
 * 0 o 1 en vez de "18 de 30". Y es segura porque `user_id` no está entre lo que
 * devuelve — quién se apuntó a qué no sale de la base.
 *
 * Si YO estoy dentro se pregunta aparte, contra `course_waitlist`, donde RLS
 * solo entrega mis propias filas.
 */
async function waitlistInfo(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  courseIds: readonly string[],
): Promise<ReadonlyMap<string, WaitlistInfo>> {
  if (courseIds.length === 0) {
    return new Map();
  }

  const ids = [...courseIds];

  const [{ data: totals }, { data: mine }] = await Promise.all([
    supabase.rpc('course_waitlist_totals', { p_course_ids: ids }),
    supabase.from('course_waitlist').select('course_id').in('course_id', ids),
  ]);

  const counts = new Map<string, number>(
    (totals ?? []).map((row) => [row.course_id, row.total]),
  );
  const joined = new Set((mine ?? []).map((row) => row.course_id));

  // Un curso sin nadie esperando no devuelve fila —`group by` no inventa
  // ceros— así que el mapa se arma desde los ids pedidos y no desde lo que
  // contestó Postgres. Si no, esos cursos se quedarían sin barra.
  return new Map(
    ids.map((id) => [id, { count: counts.get(id) ?? 0, isIn: joined.has(id) }]),
  );
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

/**
 * Un curso con sus módulos y lecciones, o `null` si no existe.
 *
 * UNA consulta, no tres (2026-08-29). Antes eran curso → módulos → lecciones en
 * cadena, y la página de una lección llamaba a esto dos veces: seis viajes a
 * Supabase. El `cache()` quitó la duplicación; el anidado quita la cadena.
 *
 * Se hizo con un select anidado y NO con una vista de Postgres a propósito. Una
 * vista habría necesitado migración, habría devuelto filas planas que hay que
 * agrupar a mano, y —lo serio— habría que acordarse de `security_invoker = on`:
 * sin eso corre con los permisos de su dueño, se salta RLS y entrega el
 * `bunny_video_id` de todos los cursos de pago. Sin avisar, porque todo
 * "funciona". El embed no tiene ese interruptor que olvidar.
 */
export const findCourse = cache(
  async (slug: string): Promise<CourseWithModules | null> => {
    const supabase = await createSupabaseServerClient();

    const { data: row } = await supabase
      .from('courses')
      .select(COURSE_TREE_COLUMNS)
      .eq('slug', slug)
      .order('position', { referencedTable: 'modules' })
      .order('position', { referencedTable: 'modules.lessons' })
      .maybeSingle();

    if (row === null) {
      return null;
    }

    const modules = row.modules;

    /*
      Sin módulos por RLS = curso cerrado para esta persona. Se enseña el índice
      igual, que es lo que da ganas de pagar: un candado sin nada detrás no
      vende. El muro aparece al INTENTAR ABRIR una lección, no antes.
    */
    if (modules.length === 0) {
      return {
        ...toCourse(row, true),
        modules: await courseOutline(supabase, slug),
      };
    }

    const withLessons: readonly CourseModule[] = modules.map((m) => ({
      id: m.id,
      title: m.title,
      summary: m.summary,
      position: m.position,
      // `toLesson` descarta la fila que no cuadre con su propio tipo (un PDF
      // sin archivo). La base ya lo impide con un `check`, pero una fila rota
      // no debería tumbar la pantalla entera del curso.
      lessons: m.lessons
        .map(toLesson)
        .filter((lesson): lesson is Lesson => lesson !== null),
    }));

    return { ...toCourse(row), modules: withLessons };
  },
);

/**
 * Cuánto lleva esta persona de cada curso.
 *
 * Se devuelve como mapa por `courseId` porque quien lo pide es una LISTA: la
 * pantalla de "Mis cursos" pinta una barra por fila, y hacer una consulta por
 * curso sería una petición por tarjeta.
 */
export const progressByCourse = cache(
  async (userId: string): Promise<ReadonlyMap<string, CourseProgress>> => {
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
  },
);

/** Qué lecciones tiene terminadas, para pintar las palomitas del acordeón. */
export const completedLessonIds = cache(
  async (userId: string): Promise<ReadonlySet<string>> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    return new Set((data ?? []).map((row) => row.lesson_id));
  },
);
