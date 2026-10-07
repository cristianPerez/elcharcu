/** A dónde va quien no tiene un destino válido: Cursos, que es el inicio. */
export const DEFAULT_DESTINATION = '/cursos';

const MAX_DESTINATION = 300;

/**
 * El destino tras entrar, solo si es una ruta INTERNA (2026-10-07).
 *
 * Viaja en el enlace del correo, así que cualquiera puede escribir lo que
 * quiera ahí. Se aceptan rutas de esta web y nada más:
 *   · tiene que empezar por una sola `/` (`//otro.co` es otro sitio);
 *   · sin `\` (algunos navegadores leen `/\otro.co` como `//otro.co`);
 *   · sin espacios ni caracteres de control, y con un tope de largo.
 * Todo lo demás vuelve al inicio.
 */
export function safeDestination(value: string | null | undefined): string {
  if (typeof value !== 'string' || value.length > MAX_DESTINATION) {
    return DEFAULT_DESTINATION;
  }
  // eslint-disable-next-line no-control-regex -- se buscan justo los caracteres de control
  if (!/^\/(?!\/)[^\\\s\u0000-\u001f]*$/.test(value)) {
    return DEFAULT_DESTINATION;
  }
  return value;
}
