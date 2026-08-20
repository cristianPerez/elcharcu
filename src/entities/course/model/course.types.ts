/** Para quién es el curso. Coincide con el `check` de `charcu.courses.level`. */
export type CourseLevel = 'para-empezar' | 'intermedio' | 'avanzado';

/** La puerta. Quien la vigila de verdad es RLS, no la pantalla (D12). */
export type CourseAccess = 'libre' | 'pago';

/**
 * De qué está hecha una lección.
 *
 * La tabla se llama `lessons` y no `videos` a propósito: un curso no es solo
 * video —hay tablas de dosis en PDF, fotos de moho para comparar y pasos que
 * se leen— y una tabla llamada `videos` llena de cosas que no son videos hace
 * mentir a todo el código que la lee.
 */
export type LessonKind = 'video' | 'pdf' | 'imagen' | 'texto';

/** Lo común a toda lección, sea del tipo que sea. */
interface LessonBase {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly summary: string;
  readonly position: number;
  readonly posterUrl: string | null;
  /**
   * La duda que casi todo el mundo tiene justo aquí, ya escrita.
   * Es lo que une el curso con el asistente: la pregunta es el siguiente botón.
   */
  readonly ask: string | null;
}

/**
 * La lección, según de qué esté hecha.
 *
 * Es una unión discriminada por `kind` y no un objeto con todo opcional: así
 * el compilador obliga a mirar el tipo antes de tocar la fuente, y no hace
 * falta ni un `any` ni un `!` para leer el video de un video.
 */
export type Lesson =
  | (LessonBase & {
      readonly kind: 'video';
      readonly bunnyVideoId: string | null;
      /** Segundos. Solo el video dura algo medible. */
      readonly durationSeconds: number | null;
    })
  | (LessonBase & { readonly kind: 'pdf'; readonly fileUrl: string })
  | (LessonBase & { readonly kind: 'imagen'; readonly fileUrl: string })
  | (LessonBase & { readonly kind: 'texto'; readonly body: string });

export interface CourseModule {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly position: number;
  readonly lessons: readonly Lesson[];
}

export interface Course {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly coverUrl: string | null;
  readonly level: CourseLevel;
  readonly access: CourseAccess;
  readonly position: number;
}

/** El curso con todo lo que cuelga de él, para la pantalla del curso. */
export interface CourseWithModules extends Course {
  readonly modules: readonly CourseModule[];
}

/**
 * Cuánto lleva alguien de un curso.
 *
 * Sale de `charcu.course_progress`, que lo CALCULA contando lecciones. Nunca
 * se guarda un porcentaje: si el curso pasa de 10 a 12 lecciones, quien iba al
 * 100% bajaría al 83% y creería que perdió algo.
 */
export interface CourseProgress {
  readonly courseId: string;
  readonly totalLessons: number;
  readonly doneLessons: number;
  readonly percent: number;
  /** La primera sin terminar. `null` cuando ya se acabó el curso. */
  readonly nextLessonId: string | null;
}

/** Progreso vacío, para un curso que todavía no ha empezado. */
export function emptyProgress(courseId: string, totalLessons: number): CourseProgress {
  return {
    courseId,
    totalLessons,
    doneLessons: 0,
    percent: 0,
    nextLessonId: null,
  };
}

/**
 * A partir de qué punto se da una lección por vista.
 *
 * 90% y no 100% porque nadie se ve los créditos: exigir el final entero deja a
 * medio mundo con el curso "sin terminar" habiéndolo visto todo.
 */
export const LESSON_COMPLETE_RATIO = 0.9;
