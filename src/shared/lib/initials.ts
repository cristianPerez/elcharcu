/**
 * Las iniciales para el círculo de la cuenta: "Cristian Perez" → "CP".
 * Sin nombre, la primera letra del correo; sin nada, un punto medio.
 */
export function initialsOf(name: string | null, email: string | null): string {
  const words = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => word !== '');

  if (words.length > 0) {
    const first = words[0]?.charAt(0) ?? '';
    const last = words.length > 1 ? (words[words.length - 1]?.charAt(0) ?? '') : '';
    return `${first}${last}`.toUpperCase();
  }

  const fromEmail = (email ?? '').trim().charAt(0);
  return fromEmail === '' ? '·' : fromEmail.toUpperCase();
}
