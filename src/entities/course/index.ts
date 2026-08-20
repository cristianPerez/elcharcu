/**
 * Puerta pública de los cursos para el NAVEGADOR: solo tipos y reglas.
 * Lo que habla con la base vive en `./server`, que no puede viajar al cliente.
 */
export type {
  Course,
  CourseAccess,
  CourseLevel,
  CourseModule,
  CourseProgress,
  CourseWithModules,
  Lesson,
  LessonKind,
} from './model/course.types';
export { emptyProgress, LESSON_COMPLETE_RATIO } from './model/course.types';
