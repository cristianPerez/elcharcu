/**
 * La plantilla "ya está tu curso nuevo", tal como vive en Resend
 * (resend.com/templates, alias `TEMPLATE_ALIAS`).
 *
 * Es el correo de cada estreno del calendario de la 0059: un curso nuevo cada
 * miércoles, diez en total, del chorizo santarrosano (18 nov 2026) al chorizo
 * de ajo (20 ene 2027). Por eso es una plantilla con variables y no un HTML
 * suelto como los envíos de captación de `scripts/lanzamientos/`: se va a
 * mandar diez veces con el mismo esqueleto.
 *
 * A quién se le manda: a quien aceptó `notify_new_courses` en su perfil
 * (`charcu.curing_profiles`), que es el aviso de cursos nuevos —no
 * `notify_news`, que es otra cosa y casi nadie aceptó—. Y a quien se apuntó a
 * la lista de espera de ESE curso (`charcu.waitlist`, el botón "Avísame cuando
 * salga"): esa gente pidió este correo por su nombre.
 *
 * Mismo esqueleto y colores que `reminderTemplate` y `recapTemplate`: bosque
 * #2d4a3e, brasa #ee8b5d sobre cacao #1e1612, crema #f4f1eb y salvia #7a9e8e.
 * Tablas y estilos en línea, que es lo único que entienden todos los clientes
 * de correo.
 *
 * Las variables van con TRES llaves (`{{{NOMBRE}}}`): Resend no las escapa. Por
 * eso quien las rellene mete solo texto plano, nunca HTML del usuario. Las dos
 * excepciones son `LECCIONES_HTML` y `CIERRE_HTML`, que son HTML de la casa.
 */
export const TEMPLATE_ALIAS = 'curso-nuevo';

export const TEMPLATE_VARIABLES = [
  /** Nombre de pila, o "charcu" si no lo tenemos. */
  'NOMBRE',
  /** "Chorizo Santarrosano". */
  'TITULO_CURSO',
  /** Una línea: qué es y por qué vale la pena. */
  'RESUMEN_CURSO',
  /** "CHORIZOS · PARA EMPEZAR". */
  'CATEGORIA_CURSO',
  /** "7 lecciones en video · 13 minutos". */
  'DATOS_CURSO',
  /** La portada, 600 px de ancho. */
  'IMAGEN_CURSO',
  /** Link al curso, con `utm_source=correo`. */
  'LINK_CURSO',
  /** Las lecciones, una por fila (`leccionesHtml`). */
  'LECCIONES_HTML',
  /** Lo mismo en texto plano, para la versión sin HTML. */
  'LECCIONES_TEXTO',
  /** Las tres o cuatro cosas que se aprenden, en una frase cada una. */
  'QUE_APRENDES',
  /** El siguiente estreno: "El 25 de noviembre: Salchichón Cervecero". */
  'PROXIMO_ESTRENO',
  /** Link al recetario del curso, para quien quiera leer antes de ver. */
  'LINK_RECETA',
  /** Link a todos los cursos. */
  'LINK_CURSOS',
  /** El cierre: distinto para suscriptor y para quien no paga (`cierreHtml`). */
  'CIERRE_HTML',
  /** Lo mismo en texto plano. */
  'CIERRE_TEXTO',
] as const;

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];

export const TEMPLATE_SUBJECT = 'Ya está: {{{TITULO_CURSO}}}, en video y paso a paso';

export const TEMPLATE_PREHEADER =
  '{{{DATOS_CURSO}}}. Grabado completo, de la carne a la parrilla.';

const FONT = 'Arial, Helvetica, sans-serif';
const SERIF = "Georgia, 'Times New Roman', serif";
const CARD =
  'background-color:#ffffff;border-left:1px solid #e8e8e7;border-right:1px solid #e8e8e7';

const kicker = (text: string): string =>
  `<p style="margin:28px 0 0 0;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#7a9e8e">${text}</p>`;

const body = (text: string): string =>
  `<p style="margin:12px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.65;color:#1e1612">${text}</p>`;

/**
 * Una fila del temario: el número en bosque, el título, y la duración a la
 * derecha. `duracion` vacía para las lecciones de lectura.
 */
export function leccionesHtml(
  lecciones: readonly { readonly titulo: string; readonly duracion: string }[],
): string {
  const row = (
    l: { readonly titulo: string; readonly duracion: string },
    index: number,
  ): string =>
    `<tr><td style="padding:3px 0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f1eb;border-radius:10px">
<tr><td width="34" valign="top" style="padding:11px 0 11px 14px;font-family:${SERIF};font-size:15px;font-weight:700;line-height:1.4;color:#7a9e8e">${index + 1}</td>
<td valign="top" style="padding:11px 8px 11px 0;font-family:${FONT};font-size:15px;line-height:1.45;color:#1e1612">${l.titulo}</td>
<td width="56" align="right" valign="top" style="padding:11px 14px 11px 0;font-family:${FONT};font-size:13px;line-height:1.5;color:#5e5753">${l.duracion}</td>
</tr></table></td></tr>`;

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px">${lecciones.map(row).join('')}</table>`;
}

/**
 * El cierre, que es lo único que cambia según quién lo recibe.
 *
 * `suscriptor`: el curso ya es suyo, así que el cierre es un recordatorio de
 * que puede preguntarle a El Charcu mientras cocina. Nada de vender.
 *
 * `sin-plan`: el curso es de pago, así que el cierre dice qué incluye el Pro y
 * lleva al plan. Sin precios en el HTML —se desactualizan— sino al sitio.
 */
export function cierreHtml(
  quien: 'suscriptor' | 'sin-plan',
  { linkCurso, linkPlanes }: { readonly linkCurso: string; readonly linkPlanes: string },
): string {
  if (quien === 'suscriptor') {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px"><tr>
<td style="background-color:#fdf3ec;border-left:4px solid #ee8b5d;border-radius:8px;padding:18px 20px">
<div style="font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#9c4a22">YA ES TUYO</div>
<div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#1e1612;padding-top:8px">Entra en tu plan Pro, sin pagar nada más. Y si te atascas a mitad del lote, pregúntale a El Charcu desde la misma lección: le puedes mandar una foto de cómo va.</div>
<div style="padding-top:12px"><a href="${linkCurso}" target="_blank" style="font-family:${FONT};font-size:15px;font-weight:bold;color:#9c4a22;text-decoration:underline">Empezar el curso</a></div>
</td></tr></table>`;
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px"><tr>
<td style="background-color:#fdf3ec;border-left:4px solid #ee8b5d;border-radius:8px;padding:18px 20px">
<div style="font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#9c4a22">CÓMO VERLO</div>
<div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#1e1612;padding-top:8px">Los cursos maestros van con <strong>El Charcu Pro</strong>: todos los cursos en video, el recetario completo y El Charcu contestándote mientras cocinas. Un plan, todo adentro — también los nueve estrenos que vienen.</div>
<div style="padding-top:12px"><a href="${linkPlanes}" target="_blank" style="font-family:${FONT};font-size:15px;font-weight:bold;color:#9c4a22;text-decoration:underline">Ver los planes</a></div>
</td></tr></table>`;
}

export const TEMPLATE_HTML = `<!doctype html><html lang="es"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" /><meta name="supported-color-schemes" content="light" />
<title>${TEMPLATE_SUBJECT}</title></head>
<body style="margin:0;padding:0;width:100%;background-color:#f4f1eb">
<div style="display:none;font-size:1px;color:#f4f1eb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${TEMPLATE_PREHEADER}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f1eb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px">

<tr><td style="background-color:#2d4a3e;border-radius:16px 16px 0 0;padding:28px 32px">
<div style="font-family:${SERIF};font-size:22px;font-weight:700;letter-spacing:0.02em;color:#ffffff">EL CHARCU</div>
<div style="font-family:${FONT};font-size:11px;letter-spacing:0.28em;color:#7a9e8e;padding-top:6px">ARTESANAL</div>
</td></tr>

<tr><td style="${CARD};padding:0">
<a href="{{{LINK_CURSO}}}" target="_blank"><img src="{{{IMAGEN_CURSO}}}" width="600" alt="{{{TITULO_CURSO}}}" style="display:block;width:100%;max-width:600px;height:auto;border:0" /></a>
</td></tr>

<tr><td style="${CARD};padding:30px 32px 0 32px">
<p style="margin:0;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#9c4a22">CURSO NUEVO &middot; {{{CATEGORIA_CURSO}}}</p>
<h1 style="margin:10px 0 0 0;font-family:${SERIF};font-size:27px;line-height:1.25;font-weight:600;color:#2d4a3e">{{{TITULO_CURSO}}}</h1>
<p style="margin:10px 0 0 0;font-family:${FONT};font-size:13px;font-weight:bold;line-height:1.5;color:#5e5753">{{{DATOS_CURSO}}}</p>
${body('Hola {{{NOMBRE}}}, ya está publicado.')}
${body('{{{RESUMEN_CURSO}}}')}
</td></tr>

<tr><td style="${CARD};padding:4px 32px 0 32px">
${kicker('QUÉ VAS A APRENDER')}
${body('{{{QUE_APRENDES}}}')}
</td></tr>

<tr><td style="${CARD};padding:4px 32px 0 32px">
${kicker('EL TEMARIO')}
</td></tr>
<tr><td style="${CARD};padding:0 32px">
{{{LECCIONES_HTML}}}
</td></tr>

<tr><td style="${CARD};padding:22px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr><td align="center" bgcolor="#ee8b5d" style="border-radius:999px">
<a href="{{{LINK_CURSO}}}" target="_blank" style="display:block;padding:16px 24px;font-family:${FONT};font-size:16px;font-weight:bold;line-height:1.3;color:#1e1612;text-decoration:none;border-radius:999px">Ver el curso</a>
</td></tr>
<tr><td style="height:12px;font-size:0">&nbsp;</td></tr>
<tr><td align="center" style="border:2px solid #2d4a3e;border-radius:999px">
<a href="{{{LINK_RECETA}}}" target="_blank" style="display:block;padding:14px 24px;font-family:${FONT};font-size:15px;font-weight:bold;line-height:1.3;color:#2d4a3e;text-decoration:none;border-radius:999px">Leer la receta primero</a>
</td></tr></table>
</td></tr>

<tr><td style="${CARD};padding:0 32px">
{{{CIERRE_HTML}}}
</td></tr>

<tr><td style="${CARD};padding:4px 32px 0 32px">
${kicker('LO QUE VIENE')}
${body('{{{PROXIMO_ESTRENO}}}')}
${body('Un curso nuevo cada miércoles. <a href="{{{LINK_CURSOS}}}" style="color:#9c4a22">Mira el calendario completo</a>.')}
</td></tr>

<tr><td style="${CARD};padding:16px 32px 32px 32px">
<p style="margin:20px 0 0 0;padding-top:18px;border-top:1px solid #e8e8e7;font-family:${FONT};font-size:13px;line-height:1.6;color:#5e5753">Si haces el lote, mándanos una foto: nos gusta verlas, y si algo no cuadra lo corregimos. Responde este correo o <a href="https://wa.me/573003526578?text=Hola%20El%20Charcu" style="color:#9c4a22">escríbenos por WhatsApp</a>.</p>
</td></tr>

<tr><td style="background-color:#f4f1eb;border:1px solid #e8e8e7;border-top:0;border-radius:0 0 16px 16px;padding:24px 32px">
<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:#787371"><strong style="color:#2d4a3e">El Charcu</strong> &middot; Charcutería artesanal<br />Manizales, Colombia &middot; Sin aditivos, sin atajos</p>
<p style="margin:12px 0 0 0;font-family:${FONT};font-size:11px;line-height:1.6;color:#9b9693">Recibes este correo porque pediste que te avisáramos de los cursos nuevos. Puedes dejar de recibirlos desde <a href="https://www.elcharcu.co/app/perfil" style="color:#787371">tu perfil</a>.</p>
</td></tr>

</table></td></tr></table></body></html>`;

export const TEMPLATE_TEXT = [
  'CURSO NUEVO · {{{CATEGORIA_CURSO}}}',
  '{{{TITULO_CURSO}}}',
  '{{{DATOS_CURSO}}}',
  '',
  'Hola {{{NOMBRE}}}, ya está publicado.',
  '',
  '{{{RESUMEN_CURSO}}}',
  '',
  'QUÉ VAS A APRENDER',
  '{{{QUE_APRENDES}}}',
  '',
  'EL TEMARIO',
  '{{{LECCIONES_TEXTO}}}',
  '',
  'Ver el curso: {{{LINK_CURSO}}}',
  'Leer la receta primero: {{{LINK_RECETA}}}',
  '',
  '{{{CIERRE_TEXTO}}}',
  '',
  'LO QUE VIENE',
  '{{{PROXIMO_ESTRENO}}}',
  'Un curso nuevo cada miércoles. El calendario completo: {{{LINK_CURSOS}}}',
  '',
  'Si haces el lote, mándanos una foto. Responde este correo o escríbenos por WhatsApp: https://wa.me/573003526578',
  '',
  'El Charcu · Charcutería artesanal · Manizales, Colombia',
  'Recibes este correo porque pediste que te avisáramos de los cursos nuevos.',
  'Puedes dejar de recibirlos desde tu perfil: https://www.elcharcu.co/app/perfil',
].join('\n');
