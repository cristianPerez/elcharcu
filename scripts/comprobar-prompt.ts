/**
 * Qué contexto recibe el asistente en cada pantalla.
 *
 *     npx tsx scripts/comprobar-prompt.ts
 *
 * ⚠️ POR QUÉ EXISTE. El 2026-09-14 Julieth escribió desde `/charcu` y el
 * asistente no sabía qué estaba haciendo: de los CUATRO sitios donde vive,
 * solo las páginas de receta mandaban contexto. Un fallo así no se ve en los
 * tipos ni en el lint —el prompt se arma y se manda igual—, solo se nota
 * cuando alguien tiene una conversación rara.
 *
 * ⚠️ Y COMPRUEBA QUE LA REGLA DE NO INVENTAR ESTÉ EN LOS TRES CASOS
 * (2026-09-17). El 15 de septiembre el asistente se inventó la pieza, el peso y
 * el método de John —"si tu bondiola pesa 4 kg", más guayabo para un ahumado
 * que nadie mencionó— en el PRIMER mensaje de una conversación nueva. La regla
 * que lo prohibía existía, pero vivía dentro de `conversationAnchor`, que es
 * precisamente el bloque que no se inyecta en el primer mensaje. Estaba escrita
 * en el único sitio donde no servía.
 *
 * Por eso el caso 'primera pregunta, sin título' es el que más importa de los
 * tres: es el mensaje con menos contexto y más riesgo. Si alguien vuelve a
 * mover esa regla a un bloque condicional, este script falla.
 *
 * ⚠️ Y QUE EL CATÁLOGO DE LA CASA ENTRE EN TODOS (2026-10-04). Felipe preguntó
 * por "el curso" y lo mandaron al WhatsApp; Ana preguntó por una receta de la
 * casa que el asistente confundió con otra. Sin el catálogo no puede
 * recomendar nada, así que va en las tres pantallas, como la regla de arriba.
 *
 * ⚠️ LO QUE ESTO NO PRUEBA: que el modelo OBEDEZCA la regla. Aquí solo se
 * comprueba que el texto se le manda. Saber si funciona es mirar en unos días
 * si siguen apareciendo conversaciones donde nombra piezas que nadie mencionó.
 */
import { buildSystemPrompt } from '../src/entities/charcu-assistant';

const RECETA = { name: 'Chistorra', brief: 'Sal de cura #1 — 2,5 g por kilo' };

const CATALOGO = {
  courses: '- Lomo de cerdo curado (GRATIS, solo hay que registrarse): …',
  recipes: '- Jamón de Bondiola Ahumado: Curado en seco, ahumado y cocido',
  subscription: 'El Charcu Pro abre todos los cursos de pago.',
};

const CASOS = [
  {
    etiqueta: 'página de receta',
    recipe: RECETA,
    conversationTitle: 'Glaseado para chorizo',
  },
  {
    etiqueta: 'app / home, con conversación',
    recipe: null,
    conversationTitle: 'Glaseado para chorizo',
  },
  { etiqueta: 'primera pregunta, sin título', recipe: null, conversationTitle: null },
] as const;

let fallos = 0;

for (const caso of CASOS) {
  const prompt = buildSystemPrompt({
    country: 'CO',
    recipe: caso.recipe,
    conversationTitle: caso.conversationTitle,
    catalog: CATALOGO,
    mentionedRecipe: null,
  });
  const receta = prompt.includes('QUÉ ESTÁ LEYENDO AHORA MISMO');
  const titulo = prompt.includes('DE QUÉ VA ESTA CONVERSACIÓN');
  const noInventar = prompt.includes('LO QUE NO SABES DE QUIEN TE ESCRIBE');
  const catalogo = prompt.includes('LO QUE TIENE LA CASA');

  // La receta abierta gana: es contexto de verdad y el rótulo sobra.
  const contexto =
    caso.recipe !== null
      ? receta && !titulo
      : titulo === (caso.conversationTitle !== null);

  // Y esta va en TODOS los casos, sin excepción. Ver abajo por qué.
  const esperado = contexto && noInventar && catalogo;
  if (!esperado) fallos += 1;

  console.log(
    `  ${esperado ? '✓' : '✗'} ${caso.etiqueta.padEnd(30)} receta: ${receta ? 'sí' : 'no'}   título: ${titulo ? 'sí' : 'no'}   no-inventar: ${noInventar ? 'sí' : 'no'}   catálogo: ${catalogo ? 'sí' : 'no'}`,
  );
}

console.log(
  `\n  ${fallos === 0 ? '· todo correcto' : `⚠️ ${String(fallos)} caso(s) mal`}`,
);
process.exit(fallos === 0 ? 0 : 1);
