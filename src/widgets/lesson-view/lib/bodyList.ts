/** Una lista de viñetas dentro del texto de una lección (2026-11-09). */
export interface ListBlock {
  readonly kind: 'list';
  readonly items: readonly string[];
}

/** `- Embute…` → un ítem. Ninguna lección anterior escribe líneas así. */
export const LIST_ITEM = /^\s*-\s+(.*)$/;

/** Líneas seguidas que empiezan por `- ` → lista; `null` si no hay ninguna. */
export function toList(lines: readonly string[]): ListBlock | null {
  if (lines.length === 0) {
    return null;
  }

  return {
    kind: 'list',
    items: lines.map((line) => line.match(LIST_ITEM)?.[1] ?? line),
  };
}
