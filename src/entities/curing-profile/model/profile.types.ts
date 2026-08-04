import { type CountryCode, type CuringProductId, type ExperienceLevel } from './options';

/**
 * Lo que sabemos del usuario antes de que empiece a curar.
 * Es lo mínimo para que el asistente le hable a su nivel, ajuste por su clima
 * y sepa cuál es su receta gratis.
 */
export interface CuringProfile {
  readonly country: CountryCode;
  readonly level: ExperienceLevel;
  /** El producto que eligió: también es su ÚNICA receta gratis. */
  readonly freeRecipe: CuringProductId;
  /** ISO 8601. */
  readonly createdAt: string;
}
