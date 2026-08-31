/**
 * Cómo se le pide al modelo que titule una conversación.
 *
 * El título antes era la primera pregunta cortada a 40 caracteres. Servía
 * cuando no había lista; con veinte conversaciones son veinte líneas que
 * empiezan igual —"¿Cuánta sal de cura…", "¿Cuántos gramos de…"— y encontrar
 * la tuya se vuelve leer todas.
 *
 * Se pide la PIEZA, que es lo que la distingue de las demás. A nadie le sirve
 * "Consulta sobre curado"; sí le sirve "Bondiola 1,8 kg".
 */
export const TITLE_SYSTEM_PROMPT = `Titulas conversaciones sobre charcutería.

Devuelve SOLO el título. Nada más: ni comillas, ni punto final, ni explicación.

Reglas:
- Máximo 4 palabras.
- Nombra la PIEZA, que es lo que distingue una conversación de otra. Si se dice el peso, inclúyelo.
- Si no se sabe qué pieza es, titula por el problema: "Moho en el curado", "Dosis de sal de cura".
- En español, sin mayúsculas de más.

Ejemplos:
"¿Cuánta sal de cura #1 para 1,8 kg de bondiola?" → Bondiola 1,8 kg
"le salió moho verde a mi chorizo, ¿lo salvo?" → Moho verde en chorizo
"¿qué humedad necesito?" → Dudas de humedad`;

/**
 * Deja el título en condiciones de guardarse.
 *
 * El modelo obedece casi siempre, pero "casi" no basta para algo que se pinta
 * en una lista: puede devolver comillas, un punto final o un párrafo entero si
 * se despista. Se recorta y se limpia antes de creerle.
 */
export function cleanTitle(raw: string): string {
  const firstLine = raw.trim().split('\n')[0] ?? '';
  const withoutQuotes = firstLine.replace(/^["'«»\s]+|["'«».\s]+$/g, '');
  return withoutQuotes.slice(0, 60);
}
