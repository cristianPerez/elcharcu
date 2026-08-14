export const FACETS = ['origen', 'tecnica', 'sabor', 'ingrediente'] as const;

export type FacetKey = (typeof FACETS)[number];

export const FACET_LABELS: Record<FacetKey, string> = {
  origen: 'Origen',
  tecnica: 'Técnica',
  sabor: 'Sabor',
  ingrediente: 'Ingrediente',
};

/** Categoriza cada tag conocida en su faceta. Nuevas tags: añadir una línea aquí. */
const TAG_FACET_LOOKUP: Record<string, FacetKey> = {
  España: 'origen',
  Italia: 'origen',
  Alemania: 'origen',
  Argentina: 'origen',
  Brasil: 'origen',
  México: 'origen',
  Colombia: 'origen',
  Andes: 'origen',
  Europa: 'origen',
  Filipinas: 'origen',
  Francia: 'origen',
  Grecia: 'origen',
  Magreb: 'origen',
  Portugal: 'origen',
  'R. Dominicana': 'origen',
  Rusia: 'origen',
  Sudáfrica: 'origen',
  Suiza: 'origen',
  Turquía: 'origen',
  Venezuela: 'origen',
  'EE. UU.': 'origen',
  Ahumado: 'tecnica',
  Curado: 'tecnica',
  Semicurado: 'tecnica',
  Fresco: 'tecnica',
  Parrillero: 'tecnica',
  Untable: 'tecnica',
  Dulce: 'sabor',
  Especiado: 'sabor',
  Picante: 'sabor',
  Pollo: 'ingrediente',
  Queso: 'ingrediente',
};

export function getTagFacet(tag: string): FacetKey | undefined {
  return TAG_FACET_LOOKUP[tag];
}
