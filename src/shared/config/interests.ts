/**
 * Las categorías de interés que se preguntan en el onboarding.
 *
 * Viven en `shared` porque las necesitan tres sitios que no pueden verse entre
 * sí: la pantalla que las pinta, la ruta que las valida y —más adelante— el
 * prompt del asistente. Si cada uno tuviera su lista, el día que se agregue una
 * categoría habría que acordarse de tres archivos, y el olvido se notaría solo
 * cuando un usuario elija algo que el servidor rechaza en silencio.
 *
 * El `id` es lo que se guarda en `charcu.profiles.interests`. NO se cambia una
 * vez publicado: hay filas con ese texto y renombrarlo las deja huérfanas.
 */

export const INTERESTS = [
  { id: 'quesos', label: 'Quesos' },
  { id: 'jamones-cocidos', label: 'Jamones cocidos' },
  { id: 'jamones-curados', label: 'Jamones curados' },
  { id: 'chacinados', label: 'Chacinados' },
  { id: 'chorizos', label: 'Chorizos' },
  { id: 'embutidos-frescos', label: 'Embutidos frescos' },
  { id: 'ahumados', label: 'Ahumados' },
  { id: 'sal-de-cura', label: 'Sal de cura y seguridad' },
] as const;

export type InterestId = (typeof INTERESTS)[number]['id'];

const INTEREST_IDS: ReadonlySet<string> = new Set(INTERESTS.map((i) => i.id));

/** Cuántos puede elegir. Ocho es todo: elegirlo todo es no elegir nada. */
export const MAX_INTERESTS = 5;

/**
 * Deja pasar solo los identificadores que existen, sin repetir y con tope.
 *
 * El cuerpo de la petición llega de fuera, así que se valida aquí y no se
 * confía en la pantalla: un `text[]` en Postgres acepta cualquier cadena, y
 * basta una petición a mano para llenar el perfil de basura que después
 * ensucia el prompt del asistente.
 */
export function parseInterests(value: unknown): InterestId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item === 'string' && INTEREST_IDS.has(item)) {
      seen.add(item);
    }
  }

  return [...seen].slice(0, MAX_INTERESTS) as InterestId[];
}
