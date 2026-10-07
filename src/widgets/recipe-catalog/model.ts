/** Una receta del recetario abierto (Pro, o "Las que te llegaron"). */
export interface CookbookCard {
  readonly slug: string;
  readonly name: string;
  readonly image: string;
  readonly categoryLabel: string;
  readonly category: string;
  readonly origin: string | null;
  readonly hasCourse: boolean;
}

/** Una receta con candado: SIN slug, a propósito (no se puede abrir ni enumerar). */
export interface LockedCard {
  readonly name: string;
  readonly image: string;
  readonly categoryLabel: string;
}
