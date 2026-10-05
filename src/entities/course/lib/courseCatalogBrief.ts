import { type AssistantCourse } from '../api/courseApi';

function courseLine(course: AssistantCourse): string {
  const access =
    course.status === 'lista-de-espera'
      ? 'todavía no está grabado: se puede apuntar a la lista de espera'
      : course.access === 'libre'
        ? 'GRATIS, solo hay que registrarse'
        : 'incluido en la suscripción';
  return `- ${course.title} (${access}): ${course.summary}`;
}

/**
 * Los cursos y las cápsulas, en el texto que lee El Charcu.
 *
 * Separados por lo que PROMETEN —una cápsula resuelve una duda, un curso
 * acompaña un proceso— porque así es como se recomiendan: a quien pregunta
 * "¿cómo se brida?" le sirve la cápsula; a quien dice "quiero empezar a curar",
 * el curso.
 */
export function courseCatalogBrief(courses: readonly AssistantCourse[]): string {
  const capsules = courses.filter((course) => course.kind === 'capsula').map(courseLine);
  const fullCourses = courses.filter((course) => course.kind === 'curso').map(courseLine);

  return `CÁPSULAS (resuelven UNA duda, en minutos)
${capsules.join('\n') || '- (ninguna publicada)'}

CURSOS (acompañan un proceso de principio a fin)
${fullCourses.join('\n') || '- (ninguno publicado)'}`;
}
