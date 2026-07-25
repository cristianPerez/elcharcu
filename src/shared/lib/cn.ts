/**
 * Une clases condicionales de Tailwind de forma segura y tipada.
 * Sustituir por `clsx` + `tailwind-merge` cuando se instalen.
 */
export function cn(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter((value): value is string => Boolean(value)).join(' ');
}
