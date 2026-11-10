/**
 * La plantilla "esto es lo que llevas estudiado", tal como vive en Resend
 * (resend.com/templates, alias `TEMPLATE_ALIAS`). Es para quien ya paga: le
 * muestra su avance, le agradece lo que reportó y le deja el calendario de
 * estrenos del mes. Este archivo es la fuente:
 * `scripts/publicar-plantilla-avance.ts` la sube y la publica. Si se edita en
 * el panel de Resend, el próximo `publicar` la pisa.
 *
 * Mismo esqueleto y colores que `reminderTemplate`: bosque #2d4a3e, brasa
 * #ee8b5d sobre cacao #1e1612, crema #f4f1eb y salvia #7a9e8e. Tablas y
 * estilos en línea, que es lo único que entienden todos los clientes de correo.
 *
 * Las variables van con TRES llaves (`{{{NOMBRE}}}`): Resend no las escapa.
 * Por eso `recapVariables` solo mete texto plano, nunca HTML del usuario.
 */
export const TEMPLATE_ALIAS = 'avance-del-mes';

export const TEMPLATE_VARIABLES = [
  'NOMBRE',
  'LECCIONES',
  'CURSOS_TERMINADOS',
  'TIEMPO',
  'PROMEDIO',
  'ULTIMO_DIA',
  'DESDE',
  'AVANCE',
  'CURSO_ARREGLADO',
  'TITULO_CURSO',
  'IMAGEN_CURSO',
  'LINK_CURSO',
  'FALTA_CURSO',
  'NOTA_ESTRENOS',
  'CALENDARIO_HTML',
  'CALENDARIO_TEXTO',
  'LINK_CURSOS',
] as const;

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];

export const TEMPLATE_SUBJECT =
  '{{{NOMBRE}}}, ya llevas {{{LECCIONES}}} lecciones (y corregimos lo que nos reportaste)';

const FONT = 'Arial, Helvetica, sans-serif';
const SERIF = "Georgia, 'Times New Roman', serif";
const CARD =
  'background-color:#ffffff;border-left:1px solid #e8e8e7;border-right:1px solid #e8e8e7';

const stat = (value: string, label: string): string =>
  `<td width="33%" align="center" style="padding:16px 6px;background-color:#f4f1eb;border-radius:12px">
<div style="font-family:${SERIF};font-size:30px;font-weight:700;color:#2d4a3e">{{{${value}}}}</div>
<div style="font-family:${FONT};font-size:12px;line-height:1.4;color:#5e5753;padding-top:4px">${label}</div></td>`;

const gap = '<td width="8" style="font-size:0">&nbsp;</td>';

const heading = (text: string): string =>
  `<p style="margin:28px 0 0 0;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#7a9e8e">${text}</p>`;

const body = (text: string): string =>
  `<p style="margin:8px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.6;color:#1e1612">${text}</p>`;

export const TEMPLATE_HTML = `<!doctype html><html lang="es"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" /><meta name="supported-color-schemes" content="light" />
<title>Tu avance en El Charcu</title></head>
<body style="margin:0;padding:0;width:100%;background-color:#f4f1eb">
<div style="display:none;font-size:1px;color:#f4f1eb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">{{{LECCIONES}}} lecciones y {{{TIEMPO}}} de estudio. Y el curso que nos reportaste ya quedó corregido.</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f1eb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px">
<tr><td style="background-color:#2d4a3e;border-radius:16px 16px 0 0;padding:28px 32px">
<div style="font-family:${SERIF};font-size:22px;font-weight:700;letter-spacing:0.02em;color:#ffffff">EL CHARCU</div>
<div style="font-family:${FONT};font-size:11px;letter-spacing:0.28em;color:#7a9e8e;padding-top:6px">ARTESANAL</div>
</td></tr>
<tr><td style="${CARD};padding:36px 32px 8px 32px">
<h1 style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.25;font-weight:600;color:#2d4a3e">Hola {{{NOMBRE}}}, mira lo que has avanzado</h1>
${body('Desde que te uniste, el {{{DESDE}}}, no has parado. Este es el resumen de tu avance:')}
</td></tr>
<tr><td style="${CARD};padding:20px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
${stat('LECCIONES', 'lecciones<br />en video')}${gap}${stat('CURSOS_TERMINADOS', 'cursos<br />terminados')}${gap}${stat('TIEMPO', 'de estudio<br />en total')}
</tr></table>
</td></tr>
<tr><td style="${CARD};padding:0 32px 8px 32px">
${heading('TU RITMO DE ESTUDIO')}
${body('Cada vez que entras te quedas <strong>{{{PROMEDIO}}}</strong>, y la última vez fue el <strong>{{{ULTIMO_DIA}}}</strong>. Nada de por encimita: son jornadas completas, de las que de verdad dejan oficio.')}
${heading('CURSO POR CURSO')}
${body('{{{AVANCE}}}')}
</td></tr>
<tr><td style="${CARD};padding:24px 32px 8px 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td style="background-color:#fdf3ec;border-left:4px solid #ee8b5d;border-radius:8px;padding:18px 20px">
<div style="font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#9c4a22">GRACIAS POR REPORTARLO</div>
<div style="font-family:${SERIF};font-size:19px;font-weight:600;color:#1e1612;padding-top:6px">Tenías toda la razón: el video no correspondía a la receta</div>
<div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#1e1612;padding-top:6px">{{{CURSO_ARREGLADO}}}</div>
</td></tr></table>
</td></tr>
<tr><td style="${CARD};padding:22px 32px 0 32px">
<a href="{{{LINK_CURSO}}}" target="_blank" style="text-decoration:none">
<img src="{{{IMAGEN_CURSO}}}" width="536" alt="{{{TITULO_CURSO}}}" style="display:block;width:100%;max-width:536px;height:auto;border:0;border-radius:12px" />
</a>
<p style="margin:10px 0 0 0;font-family:${SERIF};font-size:17px;line-height:1.35;font-weight:600;color:#2d4a3e">{{{TITULO_CURSO}}}</p>
</td></tr>
<tr><td style="${CARD};padding:16px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" bgcolor="#ee8b5d" style="border-radius:999px">
<a href="{{{LINK_CURSO}}}" target="_blank" style="display:block;padding:16px 24px;font-family:${FONT};font-size:16px;font-weight:bold;line-height:1.3;color:#1e1612;text-decoration:none;border-radius:999px">Continuar el curso corregido</a>
</td></tr></table>
</td></tr>
<tr><td style="${CARD};padding:10px 32px 0 32px">
<p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.6;color:#5e5753;text-align:center">{{{FALTA_CURSO}}}</p>
</td></tr>
<tr><td style="${CARD};padding:24px 32px 8px 32px">
<h2 style="margin:0;font-family:${SERIF};font-size:21px;line-height:1.3;font-weight:600;color:#2d4a3e">Lo que se estrena este mes</h2>
${body('De ahora en adelante estrenamos un curso nuevo cada miércoles, con fecha firme y con los videos definitivos ya grabados. Estos son los de este mes:')}
${body('{{{NOTA_ESTRENOS}}}')}
</td></tr>
<tr><td style="${CARD};padding:12px 32px 0 32px">
{{{CALENDARIO_HTML}}}
</td></tr>
<tr><td style="${CARD};padding:20px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="border:2px solid #2d4a3e;border-radius:999px">
<a href="{{{LINK_CURSOS}}}" target="_blank" style="display:block;padding:14px 24px;font-family:${FONT};font-size:15px;font-weight:bold;line-height:1.3;color:#2d4a3e;text-decoration:none;border-radius:999px">Ver todos los cursos</a>
</td></tr></table>
</td></tr>
<tr><td style="${CARD};padding:16px 32px 32px 32px">
<p style="margin:16px 0 0 0;padding-top:16px;border-top:1px solid #e8e8e7;font-family:${FONT};font-size:13px;line-height:1.6;color:#5e5753">Si vuelves a notar algo que no cuadre —un video que no corresponde, una cantidad que no suena— cuéntanos, tal como lo hiciste esta vez. Nos sirve y lo corregimos.</p>
<p style="margin:12px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:#5e5753">Cualquier inquietud, <a href="https://wa.me/573003526578?text=Hola%20El%20Charcu" style="color:#9c4a22">escríbenos por WhatsApp</a> o responde este correo.</p>
</td></tr>
<tr><td style="background-color:#f4f1eb;border:1px solid #e8e8e7;border-top:0;border-radius:0 0 16px 16px;padding:24px 32px">
<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:#787371"><strong style="color:#2d4a3e">El Charcu</strong> &middot; Charcutería artesanal<br />Manizales, Colombia &middot; Sin aditivos, sin atajos</p>
</td></tr>
</table></td></tr></table></body></html>`;

export const TEMPLATE_TEXT = [
  'Hola {{{NOMBRE}}}, mira lo que has avanzado.',
  '',
  'Desde el {{{DESDE}}}: {{{LECCIONES}}} lecciones en video, {{{CURSOS_TERMINADOS}}} cursos terminados y {{{TIEMPO}}} de estudio en total.',
  'Cada vez que entras te quedas {{{PROMEDIO}}}. La última vez fue el {{{ULTIMO_DIA}}}.',
  '',
  'Curso por curso: {{{AVANCE}}}',
  '',
  'GRACIAS POR REPORTARLO — {{{CURSO_ARREGLADO}}}',
  'Continuar {{{TITULO_CURSO}}}: {{{LINK_CURSO}}}',
  '{{{FALTA_CURSO}}}',
  '',
  'Lo que se estrena este mes (un curso nuevo cada miércoles):',
  '{{{NOTA_ESTRENOS}}}',
  '{{{CALENDARIO_TEXTO}}}',
  'Todos los cursos: {{{LINK_CURSOS}}}',
  '',
  'Si vuelves a notar algo que no cuadre, cuéntanos tal como lo hiciste esta vez. Nos sirve y lo corregimos.',
  '',
  'El Charcu · Charcutería artesanal · Manizales, Colombia',
].join('\n');
