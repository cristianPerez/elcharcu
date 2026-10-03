import {
  COURSE_CATEGORIES,
  COURSE_TECHNIQUES,
  type CourseCategory,
  type CourseTechnique,
} from '@/entities/course';

import {
  COURSE_STATES,
  toggleIn,
  type CourseQuery,
  type CourseStateFilter,
} from './searchParams';

export type FilterGroupId = 'categories' | 'states' | 'techniques';

export interface FilterOption {
  readonly group: FilterGroupId;
  readonly id: string;
  readonly label: string;
  readonly active: boolean;
  /** La búsqueda tal como queda si se toca esta opción. */
  readonly next: CourseQuery;
}

export interface FilterGroup {
  readonly id: FilterGroupId;
  readonly label: string;
  readonly options: readonly FilterOption[];
}

/**
 * Los tres grupos de filtros con lo que hace cada opción ya calculado.
 *
 * Lo comparten los chips del celular y las casillas de escritorio: así las dos
 * formas no pueden dejar de coincidir en qué significa tocar algo.
 */
export function filterGroups(query: CourseQuery): readonly FilterGroup[] {
  return [
    {
      id: 'categories',
      label: 'Categoría',
      options: COURSE_CATEGORIES.map((c) => ({
        group: 'categories',
        id: c.id,
        label: c.label,
        active: query.categories.includes(c.id),
        next: { ...query, categories: toggleIn<CourseCategory>(query.categories, c.id) },
      })),
    },
    {
      id: 'states',
      label: 'Estado',
      options: COURSE_STATES.map((st) => ({
        group: 'states',
        id: st.id,
        label: st.label,
        active: query.states.includes(st.id),
        next: { ...query, states: toggleIn<CourseStateFilter>(query.states, st.id) },
      })),
    },
    {
      id: 'techniques',
      label: 'Técnica',
      options: COURSE_TECHNIQUES.map((t) => ({
        group: 'techniques',
        id: t.id,
        label: t.label,
        active: query.techniques.includes(t.id),
        next: { ...query, techniques: toggleIn<CourseTechnique>(query.techniques, t.id) },
      })),
    },
  ];
}

/** Las etiquetas de lo que está activo, para el "en Chorizos" del resumen. */
export function activeLabels(query: CourseQuery): readonly string[] {
  return filterGroups(query).flatMap((group) =>
    group.options.filter((option) => option.active).map((option) => option.label),
  );
}
