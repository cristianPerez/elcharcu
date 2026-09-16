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
 */
import { buildSystemPrompt } from '../src/entities/charcu-assistant';

const RECETA = { name: 'Chistorra', brief: 'Sal de cura #1 — 2,5 g por kilo' };

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
  });
  const receta = prompt.includes('QUÉ ESTÁ LEYENDO AHORA MISMO');
  const titulo = prompt.includes('DE QUÉ VA ESTA CONVERSACIÓN');

  // La receta abierta gana: es contexto de verdad y el rótulo sobra.
  const esperado =
    caso.recipe !== null
      ? receta && !titulo
      : titulo === (caso.conversationTitle !== null);
  if (!esperado) fallos += 1;

  console.log(
    `  ${esperado ? '✓' : '✗'} ${caso.etiqueta.padEnd(30)} receta: ${receta ? 'sí' : 'no'}   título: ${titulo ? 'sí' : 'no'}`,
  );
}

console.log(
  `\n  ${fallos === 0 ? '· todo correcto' : `⚠️ ${String(fallos)} caso(s) mal`}`,
);
process.exit(fallos === 0 ? 0 : 1);
