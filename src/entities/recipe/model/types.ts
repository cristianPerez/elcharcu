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
}

/** Subconjunto que necesita la tarjeta de listado (Interface Segregation). */
export type RecipeSummary = Pick<
  Recipe,
  'slug' | 'name' | 'description' | 'image' | 'tags'
>;
