import { type Recipe } from '../model/types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const STRING_FIELDS = [
  'slug',
  'name',
  'description',
  'image',
  'eyebrow',
  'subtitle',
  'intro',
  'quote',
  'ingredientsNote',
  'proportionNote',
  'charcuteroNote',
  'resultNote',
  'finalQuote',
  'finalQuoteCaption',
] as const;

const ARRAY_FIELDS = [
  'tags',
  'stats',
  'details',
  'ingredients',
  'steps',
  'tips',
  'cookMethods',
  'recommendations',
] as const;

/**
 * ¿Es el `content` de `charcu.recetario` una `Recipe`? (2026-10-07)
 *
 * La base guarda el JSON tal como estaba en el repo, pero ya no hay un import
 * tipado que lo compruebe al compilar: lo que llega de Postgres es `Json`. Se
 * comprueban los campos que pintan las páginas y lee El Charcu; los anidados
 * los escribió el mismo generador. Una receta mal guardada se cae ella sola,
 * sin tumbar el recetario.
 */
export function isRecipe(value: unknown): value is Recipe {
  if (!isRecord(value)) {
    return false;
  }
  return (
    STRING_FIELDS.every((field) => typeof value[field] === 'string') &&
    ARRAY_FIELDS.every((field) => Array.isArray(value[field]))
  );
}
