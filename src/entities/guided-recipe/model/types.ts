/** Un paso del curado: lo que se ve, lo que se hace y qué se suele preguntar. */
export interface RecipeStep {
  readonly id: string;
  readonly title: string;
  /** Qué se hace, en dos frases. Nada de párrafos. */
  readonly summary: string;
  /**
   * El video corto del paso.
   *
   * Todavía no existe: hoy se muestra la imagen fija. Cuando los videos estén
   * grabados y subidos a Bunny (D17), este campo apunta al reproductor y la
   * imagen pasa a ser la portada del video.
   */
  readonly video: string | null;
  /** Portada del paso, y lo que se ve mientras no haya video. */
  readonly poster: string;
  /** Cuánto dura de verdad este paso, no el video. */
  readonly duration: string;
  /**
   * La pregunta que casi todo el mundo hace en este punto.
   *
   * Es lo que une el curso con el asistente: en vez de terminar el video y
   * quedarte solo con la duda, la duda ya está escrita y se toca.
   */
  readonly ask: string;
}

export interface GuidedRecipe {
  readonly slug: string;
  readonly name: string;
  readonly summary: string;
  readonly totalTime: string;
  readonly difficulty: string;
  readonly steps: readonly RecipeStep[];
}
