/**
 * Puerta pública de los cursos para el SERVIDOR.
 * Lee con la sesión del usuario, así que es RLS quien decide qué se entrega.
 */
export {
  listCourses,
  publishedCourseSlugs,
  findCourse,
  progressByCourse,
  completedLessonIds,
  recentCourseIds,
  requestedCategories,
  lessonNumberIn,
  assistantCourseCatalog,
  courseKindBySlug,
  publicCatalog,
} from './api/courseApi';
export type { AssistantCourse, PublicCatalog } from './api/courseApi';
export { courseCatalogBrief } from './lib/courseCatalogBrief';
