import { type CourseAdvance, type StudyRecap } from '../model/types';

import { type TemplateVariable } from './recapTemplate';

const ZONE = 'America/Bogota';

const longDate = (date: Date): string =>
  new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
    .format(date)
    .replace(',', '');

/**
 * "miércoles 18 de noviembre" a partir de `AAAA-MM-DD`. Es el mismo cálculo
 * que `entities/course/lib/releaseDate`, repetido aquí a propósito: la puerta
 * pública de `course` arrastra componentes de React y este código corre en un
 * script de Node sin JSX. Duplicar tres líneas es mejor que romper eso.
 */
const releaseDateLong = (isoDate: string): string =>
  longDate(new Date(`${isoDate}T12:00:00-05:00`)).replace(',', '');

/** Texto plano (la plantilla no escapa): quita lo que pueda abrir una etiqueta. */
const plain = (text: string): string => text.replace(/[<>]/g, '').trim();

/** "1 h 53 min", "22 min". Redondea: nadie quiere leer decimales de su propio tiempo. */
export function minutesText(minutes: number): string {
  const whole = Math.round(minutes);
  if (whole < 60) return `${whole} min`;
  const rest = whole % 60;
  return rest === 0
    ? `${Math.floor(whole / 60)} h`
    : `${Math.floor(whole / 60)} h ${rest} min`;
}

const finished = (c: CourseAdvance): boolean => c.done >= c.total;

function courseLine(c: CourseAdvance): string {
  const title = plain(c.title);
  if (finished(c)) return `${title}: completo`;
  return `${title}: ${c.done} de ${c.total}`;
}

function missingText(course: CourseAdvance): string {
  const missing = course.total - course.done;
  if (missing <= 0)
    return 'Ya lo tienes completo: entra a repasar la lección que quieras.';
  if (missing === 1) return 'Te queda una sola lección para terminarlo.';
  return `Te quedan ${missing} lecciones para terminarlo.`;
}

/**
 * El calendario, en HTML propio (no lleva nada escrito por el usuario: los
 * títulos salen de `charcu.courses` y se limpian con `plain`).
 */
function calendarHtml(releases: StudyRecap['releases']): string {
  if (releases.length === 0) {
    return '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#5e5753">Este mes no queda ningún estreno: el próximo ya viene en camino.</p>';
  }
  const rows = releases
    .map(
      (r) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e8e8e7">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:0.08em;color:#7a9e8e;text-transform:uppercase">${releaseDateLong(r.releasesOn)}</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:600;color:#1e1612;padding-top:2px">${plain(r.title)}</div>
</td></tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows}</table>`;
}

const calendarText = (releases: StudyRecap['releases']): string =>
  releases.length === 0
    ? 'Este mes no queda ningún estreno.'
    : releases
        .map((r) => `- ${releaseDateLong(r.releasesOn)}: ${plain(r.title)}`)
        .join('\n');

/**
 * Si uno de los estrenos del mes es un curso que la persona YA terminó, el
 * correo tiene que decirlo: lo que vio llevaba videos de relleno y vuelve con
 * los de verdad. Sin esta nota el correo se contradice — "completo" arriba y
 * "se estrena el 18" abajo.
 */
function releaseNote(recap: StudyRecap): string {
  const titles = new Set(recap.courses.filter(finished).map((c) => plain(c.title)));
  const already = recap.releases.filter((r) => titles.has(plain(r.title)));
  if (already.length === 0) return '';
  const names = already.map((r) => plain(r.title)).join(' y ');
  const one = already.length === 1;
  return `Una aclaración sobre ${names}: ${one ? 'ya lo terminaste' : 'ya los terminaste'}, pero ${one ? 'iba' : 'iban'} con videos provisionales mientras grabábamos los definitivos. Por eso ${one ? 'vuelve' : 'vuelven'} a aparecer en el calendario: el día del estreno ${one ? 'lo verás' : 'los verás'} con el material final, y tu avance se mantiene tal cual lo dejaste.`;
}

export function recapVariables(recap: StudyRecap): Record<TemplateVariable, string> {
  const done = recap.courses.filter(finished);
  const pace =
    recap.avgMinutes === null
      ? 'un buen rato'
      : `unos ${minutesText(recap.avgMinutes)} seguidos`;

  return {
    NOMBRE: plain(recap.name).split(' ')[0] ?? '',
    LECCIONES: String(recap.lessonsCompleted),
    CURSOS_TERMINADOS: String(done.length),
    TIEMPO: recap.totalMinutes === null ? '—' : minutesText(recap.totalMinutes),
    PROMEDIO: pace,
    ULTIMO_DIA: longDate(recap.lastStudyDay),
    DESDE: longDate(recap.since),
    AVANCE: recap.courses.map(courseLine).join(' · '),
    CURSO_ARREGLADO: `Los videos de este curso se habían grabado con otra receta y el texto no correspondía. Gracias a tu reporte ya quedó corregido: el curso enseña exactamente lo que se ve en cada video, lección por lección, y tu avance se conservó completo.`,
    TITULO_CURSO: plain(recap.fixedCourse.title),
    IMAGEN_CURSO: recap.fixedCourseImage,
    LINK_CURSO: recap.fixedCourseUrl,
    FALTA_CURSO: missingText(recap.fixedCourse),
    NOTA_ESTRENOS: releaseNote(recap),
    CALENDARIO_HTML: calendarHtml(recap.releases),
    CALENDARIO_TEXTO: calendarText(recap.releases),
    LINK_CURSOS: 'https://www.elcharcu.co/cursos',
  };
}
