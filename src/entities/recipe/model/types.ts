export interface LabelValue {
  readonly label: string;
  readonly value: string;
}

export interface TitleDescription {
  readonly title: string;
  readonly description: string;
}

export interface Ingredient {
  readonly name: string;
  readonly amount: string;
  readonly pct: string;
}

export interface Step {
  readonly n: string;
  readonly text: string;
}

/** Una duda escrita a mano para una receta concreta. Todas son opcionales. */
export interface RecipeDoubtOverride {
  /** Lo que se lee en el botón. */
  readonly label: string;
  /** Lo que se le manda a El Charcu al tocarlo. */
  readonly prompt: string;
}

export interface Recipe {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly tags: readonly string[];
  readonly eyebrow: string;
  readonly subtitle: string;
  readonly intro: string;
  readonly stats: readonly LabelValue[];
  readonly details: readonly TitleDescription[];
  readonly quote: string;
  readonly ingredientsNote: string;
  readonly ingredients: readonly Ingredient[];
  readonly proportionNote: string;
  readonly charcuteroNote: string;
  readonly steps: readonly Step[];
  readonly tips: readonly TitleDescription[];
  readonly cookMethods: readonly TitleDescription[];
  readonly recommendations: readonly string[];
  readonly resultNote: string;
  readonly finalQuote: string;
  readonly finalQuoteCaption: string;
  /**
   * Dudas escritas a mano, que ganan a las que se generan solas.
   *
   * Las cuatro se generan desde los datos de la receta y salen específicas
   * —usan su rendimiento, su sal de cura, sus semanas de curado—, así que esto
   * es para cuando una merezca estar MEJOR escrita, no para rellenar las 45.
   * Se pone solo la que se quiera cambiar; el resto siguen generándose.
   */
  readonly doubts?: {
    readonly onIntro?: RecipeDoubtOverride;
    readonly onIngredients?: RecipeDoubtOverride;
    readonly onProcess?: RecipeDoubtOverride;
    readonly onServing?: RecipeDoubtOverride;
  };
}

/** Subconjunto que necesita la tarjeta de listado (Interface Segregation). */
export type RecipeSummary = Pick<
  Recipe,
  'slug' | 'name' | 'description' | 'image' | 'tags'
>;
