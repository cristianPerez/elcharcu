/**
 * La fecha de estreno de un curso, en palabras (2026-11-10).
 *
 * La columna es un `date` sin hora (`AAAA-MM-DD`). `new Date('2026-11-18')` lo
 * leería como medianoche UTC, que en Bogotá es el 17 a las 7 pm: el curso
 * "saldría" un día antes. Por eso se fija el mediodía de Bogotá antes de
 * formatear.
 */
const BOGOTA = 'America/Bogota';

function atNoonInBogota(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00-05:00`);
}

/** "miércoles 18 de noviembre" — para la ficha del curso. */
export function releaseDateLong(isoDate: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: BOGOTA,
  })
    .format(atNoonInBogota(isoDate))
    .replace(',', '');
}

/** "18 de nov" — para las listas, donde no cabe más. */
export function releaseDateShort(isoDate: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    timeZone: BOGOTA,
  })
    .format(atNoonInBogota(isoDate))
    .replace('.', '');
}

/** Los cursos con fecha, del que sale antes al que sale después; los sin fecha, al final. */
export function byReleaseDate(
  a: { readonly releasesOn: string | null },
  b: { readonly releasesOn: string | null },
): number {
  return (a.releasesOn ?? '9999-12-31').localeCompare(b.releasesOn ?? '9999-12-31');
}
