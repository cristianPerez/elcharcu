export interface LabelValue {
  readonly label: string;
  readonly value: string;
}

export interface TitleDescription {
  readonly title: string;
  readonly description: string;
}

export interface TablaIngredient {
  readonly name: string;
  readonly amount: string;
  readonly pct: string;
  readonly note?: string;
}

export interface TablaStep {
  readonly n: string;
  readonly text: string;
  /** Foto opcional que rompe el listado de pasos — el formato editorial de Tablas. */
  readonly image?: string;
}

export interface Tabla {
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
  readonly ingredients: readonly TablaIngredient[];
  readonly proportionNote: string;
  readonly expertNote: string;
  readonly steps: readonly TablaStep[];
  readonly tips: readonly TitleDescription[];
  readonly pairings: readonly TitleDescription[];
  readonly recommendations: readonly string[];
  readonly resultNote: string;
  readonly finalQuote: string;
  readonly finalQuoteCaption: string;
}

/** Subconjunto que necesita la tarjeta de listado (Interface Segregation). */
export type TablaSummary = Pick<
  Tabla,
  'slug' | 'name' | 'description' | 'image' | 'tags'
>;
