/** Una sesión = una receta que el usuario está haciendo. Puede durar semanas. */
export interface RecipeSession {
  /**
   * Qué está curando, en texto libre.
   *
   * Era `CuringProductId`, una unión cerrada que definía `curing-profile`. Se
   * soltó el 2026-08-29 al fundir las preguntas de producto e intereses: la
   * lista cerrada ya no existe, y de paso se va un import entre entidades que
   * FSD tolera pero que nadie echa de menos.
   */
  readonly product: string;
  /** ISO 8601. */
  readonly startedAt: string;
  /** `true` en la única receta que va por cuenta de la casa. */
  readonly isFree: boolean;
  readonly id: string;
}
