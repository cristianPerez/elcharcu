/**
 * Limpia el markdown que suelta el modelo aunque se le pida texto llano.
 *
 * No monta un renderizador completo a propósito: en un chat solo aparecen
 * negritas, títulos y viñetas. Quitar la dependencia de una librería entera por
 * tres casos no compensa.
 */
export function tidyMarkdown(text: string): string {
  return text
    .split('\n')
    .map((line) =>
      line
        // "### Título" → "Título"
        .replace(/^\s{0,3}#{1,6}\s+/, '')
        // "*   punto" o "-   punto" → "• punto"
        .replace(/^\s*[*-]\s{1,4}(?=\S)/, '• ')
        // Separadores horizontales sobran en una burbuja de chat.
        .replace(/^\s*[-*_]{3,}\s*$/, ''),
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface TextChunk {
  readonly text: string;
  readonly isBold: boolean;
}

/** Parte el texto en trozos para poder pintar **negritas** de verdad. */
export function splitBold(text: string): readonly TextChunk[] {
  return text
    .split(/(\*\*[^*\n]+\*\*)/g)
    .filter((chunk) => chunk !== '')
    .map((chunk) =>
      chunk.startsWith('**') && chunk.endsWith('**')
        ? { text: chunk.slice(2, -2), isBold: true }
        : { text: chunk, isBold: false },
    );
}
