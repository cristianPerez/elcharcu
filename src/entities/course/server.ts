/**
 * Puerta pública de los cursos para el SERVIDOR.
 * Lee con la sesión del usuario, así que es RLS quien decide qué se entrega.
 */
export {
  listCourses,
  findCourse,
  progressByCourse,
  completedLessonIds,
} from './api/courseApi';
