import { type Recipe } from '../model/types';

/**
 * Las recetas de la casa en una línea cada una: nombre y qué tipo de producto es.
 *
 * ⚠️ POR QUÉ EXISTE (Ana, 2026-10-04). Preguntó desde fuera de la página de la
 * receta por qué el Jamón de Bondiola Ahumado se cura en seco y no en
 * salmuera. El asistente no tenía la receta delante y contestó como si fuera
 * un curado largo para secar, cuando es un jamón COCIDO: se cura al vacío, se
 * ahúma y se lleva a 75 °C. La respuesta salió equivocada justo con una persona
 * que sabía de qué hablaba, y no volvió.
 *
 * Con el TIPO basta para no confundir una receta con otra. Las cantidades no
 * van aquí —serían 48 recetas enteras en cada pregunta—: esas entran solo
 * cuando la receta está abierta (`recipeBrief`).
 */
export function recipeCatalogBrief(recipes: readonly Recipe[]): string {
  return recipes
    .map((recipe) => {
      const type = recipe.stats.find((stat) =>
        stat.label.toLowerCase().startsWith('tipo'),
      );
      return type === undefined ? `- ${recipe.name}` : `- ${recipe.name}: ${type.value}`;
    })
    .join('\n');
}
