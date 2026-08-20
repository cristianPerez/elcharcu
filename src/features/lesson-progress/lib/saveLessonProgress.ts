interface ProgressInput {
  readonly lessonId: string;
  readonly second: number;
  readonly completed: boolean;
}

/**
 * Apunta por dónde va en una lección.
 *
 * Devuelve si se pudo guardar, pero quien la llama casi nunca debería frenar
 * por un `false`: perder un guardado de progreso es molesto, no grave, y
 * bloquear el avance del curso por eso sí lo sería.
 */
export async function saveLessonProgress(input: ProgressInput): Promise<boolean> {
  try {
    const response = await fetch('/api/progreso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return response.ok;
  } catch {
    return false;
  }
}
