import { type InterestId } from '@/shared/config';

/**
 * Lo que sabemos del usuario antes de que empiece a curar.
 *
 * ⚠️ Aquí había `country`, `level` y `freeRecipe`. Los tres se fueron el
 * 2026-08-29 y ninguno se echa de menos:
 *
 * - `country`: el asistente lo saca ahora de la cabecera de Vercel, y la
 *   analítica de Mixpanel. Un dato que llega solo no se pregunta.
 * - `level`: dejó de existir. Todos son charcus.
 * - `freeRecipe`: era la unidad del modelo viejo —una receta gratis— que
 *   jubilaron D15 y D20. La pregunta que lo llenaba ("¿qué vas a hacer
 *   ahora?") se parecía tanto a la de intereses que Cristian pidió fundirlas:
 *   preguntar dos veces casi lo mismo, seguido, es la clase de cosa que hace
 *   abandonar un onboarding.
 *
 * Queda una sola cosa, que es la que de verdad manda: qué quiere aprender.
 */
export interface CuringProfile {
  /** Lo que eligió aprender. El primero manda cuando hay que elegir uno. */
  readonly interests: readonly InterestId[];
  /** ISO 8601. */
  readonly createdAt: string;
}
