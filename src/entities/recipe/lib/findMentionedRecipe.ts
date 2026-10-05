import { type Recipe } from '../model/types';

/** Palabras que no dicen de qué receta se habla. */
const FILLER = new Set([
  'de',
  'del',
  'la',
  'el',
  'los',
  'las',
  'y',
  'con',
  'a',
  'al',
  'en',
]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^a-z0-9ñ]+/)
    .filter((word) => word !== '' && !FILLER.has(word));
}

/**
 * La receta de la casa que alguien nombra sin tenerla abierta, o `undefined`.
 *
 * ⚠️ POR QUÉ EXISTE (Ana, 2026-10-04). Preguntó por "la receta de jamón de
 * bondiola" desde la app, sin la página de la receta abierta. El asistente no
 * la tenía delante y la confundió con un curado largo para secar. Con el
 * catálogo de una línea no bastó: lo volvió a confundir en la prueba.
 *
 * La regla es deliberadamente estricta, porque meter la receta EQUIVOCADA es
 * peor que no meter ninguna:
 * - tienen que aparecer las DOS primeras palabras del nombre SEGUIDAS ("jamón
 *   de bondiola" para Jamón de Bondiola Ahumado), o la única si solo tiene una.
 *   Seguidas y no sueltas: la pregunta de Ana decía "jamón" al principio y
 *   "curado" más adelante, y eso empataba con el Jamón Curado y Ahumado;
 * - si aun así dos recetas empatan, no se elige ninguna.
 *
 * Lo que se le pasa es solo el TEXTO de quien escribe; lo que sale es una de
 * las recetas del repo, nunca texto libre.
 */
export function findMentionedRecipe(
  text: string,
  recipes: readonly Recipe[],
): Recipe | undefined {
  const sequence = words(text);
  const said = new Set(sequence);
  const pairs = new Set(
    sequence.slice(1).map((word, i) => `${sequence[i] ?? ''} ${word}`),
  );
  let best: Recipe | undefined;
  let bestScore = 0;
  let isTied = false;

  for (const recipe of recipes) {
    const name = words(recipe.name);
    const [first, second] = name;
    const isNamed =
      first !== undefined &&
      (second === undefined ? said.has(first) : pairs.has(`${first} ${second}`));
    if (!isNamed) {
      continue;
    }

    const score = name.filter((word) => said.has(word)).length;
    if (score > bestScore) {
      best = recipe;
      bestScore = score;
      isTied = false;
    } else if (score === bestScore) {
      isTied = true;
    }
  }

  return isTied ? undefined : best;
}
