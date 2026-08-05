// Import entre entidades: el catálogo de productos lo define `curing-profile` y
// aquí se reutiliza en vez de duplicar la unión de tipos. FSD v2 permite estos
// cruces entre entidades; el ESLint de la capa también.
import { type CuringProductId } from '@/entities/curing-profile';

/** Una sesión = una receta que el usuario está haciendo. Puede durar semanas. */
export interface RecipeSession {
  readonly id: string;
  readonly product: CuringProductId;
  /** ISO 8601. */
  readonly startedAt: string;
  /** `true` en la única receta que va por cuenta de la casa. */
  readonly isFree: boolean;
}
