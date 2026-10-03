/**
 * Puerta pública de los cursos para el NAVEGADOR: solo tipos y reglas.
 * Lo que habla con la base vive en `./server`, que no puede viajar al cliente.
 */
export type {
  Course,
  CourseAccess,
  CourseKind,
  CourseStatus,
  CourseLevel,
  CourseModule,
  CourseProgress,
  CourseWithModules,
  Lesson,
  LessonKind,
} from './model/course.types';
export { emptyProgress, LESSON_COMPLETE_RATIO } from './model/course.types';
export {
  COURSE_CATEGORIES,
  COURSE_TECHNIQUES,
  categoryLabel,
  isCourseCategory,
  isCourseTechnique,
  levelLabel,
  techniqueLabel,
} from './model/catalog';
export type { CourseCategory, CourseTechnique } from './model/catalog';
export {
  capsuleSteps,
  courseCardVariant,
  isFinished,
  isInProgress,
  lessonCountLabel,
} from './lib/courseState';
export type { CapsuleStep, CourseCardVariant } from './lib/courseState';
export { CourseCard } from './ui/CourseCard';
export { CapsuleCard } from './ui/CapsuleCard';
export type { CapsuleState } from './ui/CapsuleCard';
