import { type Course } from '@/entities/course';

import { foldText } from '@/shared/ui';

import { type CourseQuery, type CourseStateFilter } from '../model/searchParams';

function matchesState(course: Course, state: CourseStateFilter): boolean {
  switch (state) {
    case 'gratis':
      return course.access === 'libre' && course.status === 'publicado';
    case 'disponibles':
      return course.status === 'publicado';
    case 'proximos':
      return course.status === 'lista-de-espera';
  }
}

/**
 * El filtro de la búsqueda. Función pura: se prueba sin pantalla.
 *
 * Dentro de un mismo grupo es O (Chorizos o Quesos); entre grupos es Y
 * (Chorizos y Gratis). Es lo que la gente espera de unas casillas.
 *
 * El texto se busca en el título y el resumen, sin tildes ni mayúsculas:
 * "jamon" encuentra "Jamón". Los borradores no salen nunca.
 */
export function filterCourses(
  courses: readonly Course[],
  query: CourseQuery,
): readonly Course[] {
  const needle = foldText(query.q.trim());

  return courses.filter((course) => {
    if (course.status === 'borrador') {
      return false;
    }
    if (
      needle !== '' &&
      !foldText(course.title).includes(needle) &&
      !foldText(course.summary).includes(needle)
    ) {
      return false;
    }
    if (
      query.categories.length > 0 &&
      (course.category === null || !query.categories.includes(course.category))
    ) {
      return false;
    }
    if (
      query.techniques.length > 0 &&
      !query.techniques.some((technique) => course.techniques.includes(technique))
    ) {
      return false;
    }
    if (query.states.length > 0 && !query.states.some((s) => matchesState(course, s))) {
      return false;
    }
    return true;
  });
}
