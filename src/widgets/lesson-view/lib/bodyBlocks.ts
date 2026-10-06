/** Un trozo del texto de una lección: prosa tal cual, o una tabla. */
export type BodyBlock =
  | { readonly kind: 'text'; readonly text: string }
  | {
      readonly kind: 'table';
      readonly header: readonly string[];
      readonly rows: readonly (readonly string[])[];
      /** Por columna: `true` si va alineada a la derecha (`---:`). */
      readonly alignRight: readonly boolean[];
    };

/** Un trozo de texto, con o sin negrita. */
export interface InlineChunk {
  readonly text: string;
  readonly isBold: boolean;
}

const SEPARATOR_CELL = /^:?-{3,}:?$/;

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function toTable(lines: readonly string[]): BodyBlock | null {
  const [headerLine, separatorLine, ...rowLines] = lines;
  if (headerLine === undefined || separatorLine === undefined) {
    return null;
  }

  const separator = cells(separatorLine);
  if (!separator.every((cell) => SEPARATOR_CELL.test(cell))) {
    return null;
  }

  return {
    kind: 'table',
    header: cells(headerLine),
    rows: rowLines.map(cells),
    alignRight: separator.map((cell) => cell.endsWith(':')),
  };
}

/**
 * El texto de una lección, partido en prosa y tablas (2026-10-06).
 *
 * ⚠️ NO ES MARKDOWN, y no se pretende. El texto de las lecciones se escribe en
 * las migraciones y se pinta tal cual, con sus saltos de línea. Lo único que
 * se entiende aparte son las líneas seguidas que empiezan por `|` —una tabla
 * con su fila de `---`—, porque una lista de ingredientes con dos columnas de
 * gramos no se lee en texto corrido (Cristian, curso del jamón de bondiola).
 *
 * Si las líneas con `|` no traen la fila de `---`, no son tabla: se quedan
 * como texto. Así un texto viejo nunca cambia de aspecto por accidente.
 */
export function bodyBlocks(body: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let prose: string[] = [];
  let tableLines: string[] = [];

  const flushProse = (): void => {
    const text = prose.join('\n').trim();
    if (text !== '') {
      blocks.push({ kind: 'text', text });
    }
    prose = [];
  };

  const flushTable = (): void => {
    if (tableLines.length === 0) {
      return;
    }
    const table = toTable(tableLines);
    if (table === null) {
      prose.push(...tableLines);
    } else {
      flushProse();
      blocks.push(table);
    }
    tableLines = [];
  };

  for (const line of body.split('\n')) {
    if (line.trim().startsWith('|')) {
      tableLines.push(line);
    } else {
      flushTable();
      prose.push(line);
    }
  }
  flushTable();
  flushProse();

  return blocks;
}

/** `**así**` → negrita. Lo demás, tal cual. */
export function inlineChunks(text: string): InlineChunk[] {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter((part) => part !== '')
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? { text: part.slice(2, -2), isBold: true }
        : { text: part, isBold: false },
    );
}
