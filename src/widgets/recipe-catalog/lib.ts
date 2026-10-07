/** "Jamón" encuentra "jamon" y al revés: sin tildes ni mayúsculas. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function matches(name: string, query: string): boolean {
  const q = normalize(query.trim());
  return q === '' || normalize(name).includes(q);
}
