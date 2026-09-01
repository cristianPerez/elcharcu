import { type Recipe } from '../model/types';

/**
 * La receta resumida para que El Charcu la tenga delante mientras contesta.
 *
 * NO es el JSON entero. Una receta completa son ~4.900 caracteres y la mayoría
 * es lo que la hace bonita de leer —el copy del hero, las citas, las
 * recomendaciones de maridaje— y no ayuda nada a responder "¿cuánta sal le
 * pongo a mis tres kilos?". Esta proyección se queda con lo que sí: cantidades,
 * proporciones, pasos y consejos. ~1.700 caracteres de media, ~430 tokens.
 *
 * ⚠️ Los porcentajes van SIEMPRE junto al gramaje. Son lo que deja escalar la
 * receta a los kilos que esa persona tenga delante, que es la pregunta que más
 * se hace. Sin ellos el asistente tendría que deducirlos, y deducir gramos de
 * sal de cura no es algo que deba hacer nadie de memoria.
 */
export function recipeBrief(recipe: Recipe): string {
  const stats = recipe.stats.map((stat) => `${stat.label}: ${stat.value}`).join(' · ');

  const ingredients = recipe.ingredients
    .map((item) => `- ${item.name}: ${item.amount} (${item.pct})`)
    .join('\n');

  const steps = recipe.steps.map((step) => `${step.n}. ${step.text}`).join('\n');

  const tips = recipe.tips.map((tip) => `- ${tip.title}: ${tip.description}`).join('\n');

  return `RECETA: ${recipe.name}
${stats}

INGREDIENTES (para la cantidad base de la receta)
${ingredients}

PROPORCIÓN BASE
${recipe.proportionNote}

NOTA DEL CHARCUTERO
${recipe.charcuteroNote}

PASOS
${steps}

CONSEJOS
${tips}`;
}
