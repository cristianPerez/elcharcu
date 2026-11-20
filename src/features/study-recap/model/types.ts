/** Un curso con el avance de la persona dentro de él. */
export interface CourseAdvance {
  readonly title: string;
  readonly done: number;
  readonly total: number;
}

/** Un estreno con fecha firme (`charcu.courses.releases_on`). */
export interface Release {
  readonly title: string;
  /** `AAAA-MM-DD`, sin hora: es un día, no un instante. */
  readonly releasesOn: string;
}

/**
 * Lo que la persona lleva estudiado. `sessions`, `totalMinutes` y
 * `avgMinutes` NO salen de Supabase: la base solo guarda marcas de actividad
 * (lección completada, mensaje enviado), que subestiman el tiempo real. Vienen
 * de las sesiones de Mixpanel (`$session_end` / `$duration_s`) y quien llama
 * los pasa; por eso son opcionales.
 */
export interface StudyRecap {
  readonly name: string;
  readonly since: Date;
  readonly lastStudyDay: Date;
  readonly lessonsCompleted: number;
  readonly courses: readonly CourseAdvance[];
  readonly sessions: number | null;
  readonly totalMinutes: number | null;
  readonly avgMinutes: number | null;
  /** El curso que se corrigió: al que apunta el botón del correo. */
  readonly fixedCourse: CourseAdvance;
  readonly fixedCourseUrl: string;
  /**
   * La portada del curso, servida por la página de producción. Absoluta y con
   * `www`: así la pide el sitio sin redirección, y muchos clientes de correo
   * no siguen un 308 para cargar una imagen.
   */
  readonly fixedCourseImage: string;
  readonly releases: readonly Release[];
}
