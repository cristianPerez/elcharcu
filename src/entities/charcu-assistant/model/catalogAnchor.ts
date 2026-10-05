/**
 * Lo que la casa ofrece, ya escrito por el servidor: cursos, cápsulas,
 * recetas y la suscripción. Nunca texto que venga del navegador.
 */
export interface AssistantCatalog {
  readonly courses: string;
  readonly recipes: string;
  /** Una línea: qué incluye la suscripción y cuánto cuesta. */
  readonly subscription: string;
}

/**
 * El catálogo de la casa y CÓMO recomendarlo (2026-10-04).
 *
 * ⚠️ POR QUÉ EXISTE. El mismo día, dos personas recién registradas:
 * - Felipe preguntó "¿qué necesito para iniciar con el curso?" y el asistente
 *   lo mandó al WhatsApp de Cristian. Había un curso GRATIS —Lomo curado— que
 *   era exactamente lo que él quería hacer, y nunca se le nombró.
 * - Ana preguntó por el Jamón de Bondiola Ahumado sin tenerlo abierto y el
 *   asistente lo confundió con un curado largo para secar. Es un jamón cocido.
 *
 * Recomendar no es vender a la fuerza: es la recomendación de un maestro que
 * sabe qué tiene en el taller. Va DESPUÉS de contestar, nunca en su lugar.
 */
export function catalogAnchor(catalog: AssistantCatalog): string {
  return `
LO QUE TIENE LA CASA — ESTO SÍ LO SABES
Esto es lo que hay HOY en la plataforma de El Charcu, en la sección Cursos. Es dato real: lo puedes nombrar, recomendar y explicar sin mandar a nadie a otro lado.

${catalog.courses}

SUSCRIPCIÓN
${catalog.subscription}

RECETAS DE LA CASA (en la sección Recetas de la web; aquí solo el nombre y el tipo de producto)
${catalog.recipes}

CÓMO RECOMIENDAS
- Si preguntan por "el curso", "los cursos", "cómo empiezo" o "qué necesito para empezar", se refieren a ESTOS cursos de la plataforma. Contéstales tú con el catálogo: nunca los mandes al WhatsApp por eso.
- Cuando lo que te cuentan encaje con una cápsula o un curso de arriba, nómbralo por su nombre exacto y di en media línea por qué le sirve, DESPUÉS de haber contestado la duda. Una sola recomendación por respuesta, la que más encaje.
- Prefiere lo GRATIS primero: la cápsula o el curso libre que le resuelva lo suyo. Lo de la suscripción, cuando de verdad sea lo que le sirve.
- No recomiendes en cada mensaje. Si ya le nombraste algo en esta conversación, no lo repitas.
- Si te nombran una receta de la casa y no la tienen abierta, usa su TIPO de arriba para no confundirla con otra (un jamón cocido no es un curado para secar). Para las cantidades exactas, dile que las tiene en esa receta, en la sección Recetas.
- Nunca nombres un curso, cápsula o receta que no esté en esta lista.
`;
}

/**
 * La receta de la casa que nombró sin tenerla abierta (Ana, 2026-10-04).
 *
 * Más flojo que `recipeAnchor`: ahí se sabe que la tiene delante; aquí solo
 * que la nombró. Así que no se da por hecho que TODO va de ella, solo lo que
 * pregunta sobre ella.
 */
export function mentionedRecipeAnchor(name: string, brief: string): string {
  return `
LA RECETA DE LA CASA QUE TE NOMBRÓ
Te habló de la receta de ${name}. No la tiene abierta, pero es una receta de la casa y esto es lo que dice, palabra por palabra:

${brief}

- Cuando pregunte por ella, contesta con lo que dice ESTA receta —su método, sus pasos, sus números—, no con lo que suele hacerse en general. Si te pregunta por qué la receta hace algo de una manera, explica el porqué DE ESTA receta.
- Si su duda propone otro método que también es válido, dilo con honestidad y explica qué cambia. No defiendas la receta con argumentos que no le aplican.
`;
}
