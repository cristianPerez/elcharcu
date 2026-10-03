import {
  isCourseCategory,
  isCourseTechnique,
  type CourseCategory,
  type CourseTechnique,
} from '@/entities/course';

import { appRoutes } from '@/shared/config';

export const COURSE_STATES = [
  { id: 'gratis', label: 'Gratis' },
  { id: 'disponibles', label: 'Disponibles' },
  { id: 'proximos', label: 'Próximos' },
] as const;

export type CourseStateFilter = (typeof COURSE_STATES)[number]['id'];

function isCourseState(value: unknown): value is CourseStateFilter {
  return COURSE_STATES.some((state) => state.id === value);
}

/**
 * Lo que se está buscando. Vive ENTERO en la URL: se comparte por WhatsApp,
 * sobrevive a un recargo y el botón de atrás deshace el último filtro.
 */
export interface CourseQuery {
  readonly q: string;
  readonly categories: readonly CourseCategory[];
  readonly states: readonly CourseStateFilter[];
  readonly techniques: readonly CourseTechnique[];
}

export const EMPTY_QUERY: CourseQuery = {
  q: '',
  categories: [],
  states: [],
  techniques: [],
};

export type RawSearchParams = Readonly<Record<string, string | string[] | undefined>>;

const MAX_Q = 80;

function list(value: string | string[] | undefined): string[] {
  const joined = Array.isArray(value) ? value.join(',') : (value ?? '');
  return joined
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

/**
 * La URL llega de fuera: lo que no se reconoce se descarta en silencio en vez
 * de romper la pantalla. Un `?categoria=jamon` viejo enseña todo, no un error.
 */
export function parseCourseQuery(params: RawSearchParams): CourseQuery {
  const rawQ = params.q;
  const q = (Array.isArray(rawQ) ? (rawQ[0] ?? '') : (rawQ ?? '')).slice(0, MAX_Q);

  return {
    q,
    categories: unique(list(params.categoria).filter(isCourseCategory)),
    states: unique(list(params.estado).filter(isCourseState)),
    techniques: unique(list(params.tecnica).filter(isCourseTechnique)),
  };
}

export function hasFilters(query: CourseQuery): boolean {
  return (
    query.categories.length > 0 || query.states.length > 0 || query.techniques.length > 0
  );
}

/** La URL de una búsqueda. Sin parámetros vacíos: `/cursos/buscar` a secas. */
export function courseSearchHref(query: Partial<CourseQuery>): string {
  const params = new URLSearchParams();
  const q = query.q?.trim() ?? '';

  if (q !== '') {
    params.set('q', q);
  }
  if ((query.categories?.length ?? 0) > 0) {
    params.set('categoria', (query.categories ?? []).join(','));
  }
  if ((query.states?.length ?? 0) > 0) {
    params.set('estado', (query.states ?? []).join(','));
  }
  if ((query.techniques?.length ?? 0) > 0) {
    params.set('tecnica', (query.techniques ?? []).join(','));
  }

  const search = params.toString();
  return search === ''
    ? appRoutes.appCoursesSearch
    : `${appRoutes.appCoursesSearch}?${search}`;
}

/** Quita o pone un valor de una lista: lo que hace un chip o una casilla. */
export function toggleIn<T>(items: readonly T[], value: T): T[] {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}
