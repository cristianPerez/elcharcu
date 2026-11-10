/**
 * La plantilla "tu mes de Pro está por terminar", tal como vive en Resend
 * (resend.com/templates, alias `TEMPLATE_ALIAS`). Es para quien pagó por
 * fuera de OnePay (York, por Nequi): su plan no se renueva solo, y el correo
 * lo lleva a renovarlo en línea. Este archivo es la fuente:
 * `scripts/publicar-plantilla-renovacion.ts` la sube y la publica. Si se edita
 * en el panel de Resend, el próximo `publicar` la pisa.
 *
 * Colores de elcharcu.co (`globals.css`): bosque #2d4a3e, brasa #ee8b5d con
 * texto cacao #1e1612 (el botón de "Suscribirme" del sitio), crema #f4f1eb y
 * salvia #7a9e8e. Mismo esqueleto que `welcomeEmail`: tablas y estilos en línea.
 *
 * Las variables van con TRES llaves (`{{{NOMBRE}}}`): Resend no las escapa.
 * Por eso `reminderVariables` solo mete texto plano, nunca HTML del usuario.
 */
export const TEMPLATE_ALIAS = 'pro-renovacion';

export const TEMPLATE_VARIABLES = [
  'NOMBRE',
  'CUANDO',
  'FECHA_FIN',
  'PREGUNTAS',
  'LECCIONES',
  'CONVERSACIONES',
  'TEMAS',
  'CURSO',
  'DATO_TITULO',
  'DATO_TEXTO',
  'LINK_ANUAL',
  'LINK_MENSUAL',
  'PRECIO_ANUAL',
  'PRECIO_MENSUAL',
  'NOTA_WHATSAPP',
] as const;

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];

export const TEMPLATE_SUBJECT =
  '{{{NOMBRE}}}, tu mes de El Charcu Pro termina {{{CUANDO}}}';

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
<title>Tu mes de El Charcu Pro</title></head>
<body style="margin:0;padding:0;width:100%;background-color:#f4f1eb">
<div style="display:none;font-size:1px;color:#f4f1eb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">{{{PREGUNTAS}}} preguntas y {{{LECCIONES}}} lecciones en un mes. Esto es lo que aprendiste.</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f1eb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px">
<tr><td style="background-color:#2d4a3e;border-radius:16px 16px 0 0;padding:28px 32px">
<div style="font-family:${SERIF};font-size:22px;font-weight:700;letter-spacing:0.02em;color:#ffffff">EL CHARCU</div>
<div style="font-family:${FONT};font-size:11px;letter-spacing:0.28em;color:#7a9e8e;padding-top:6px">ARTESANAL</div>
</td></tr>
<tr><td style="${CARD};padding:36px 32px 8px 32px">
<h1 style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.25;font-weight:600;color:#2d4a3e">{{{NOMBRE}}}, mira todo lo que aprendiste este mes</h1>
${body('Tu mes de El Charcu Pro termina <strong>{{{CUANDO}}}</strong> ({{{FECHA_FIN}}}). Antes de renovarlo, un repaso de lo que hiciste:')}
</td></tr>
<tr><td style="${CARD};padding:20px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
${stat('PREGUNTAS', 'preguntas a<br />El Charcu')}${gap}${stat('LECCIONES', 'lecciones<br />en video')}${gap}${stat('CONVERSACIONES', 'recetas y dudas<br />trabajadas')}
</tr></table>
</td></tr>
<tr><td style="${CARD};padding:0 32px 8px 32px">
${heading('LO QUE TRABAJASTE')}
${body('{{{TEMAS}}}')}
${heading('TU CURSO')}
${body('{{{CURSO}}}')}
</td></tr>
<tr><td style="${CARD};padding:24px 32px 8px 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
<td style="background-color:#fdf3ec;border-left:4px solid #ee8b5d;border-radius:8px;padding:18px 20px">
<div style="font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.16em;color:#9c4a22">PARA TU PRÓXIMA TANDA</div>
<div style="font-family:${SERIF};font-size:19px;font-weight:600;color:#1e1612;padding-top:6px">{{{DATO_TITULO}}}</div>
<div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#1e1612;padding-top:6px">{{{DATO_TEXTO}}}</div>
</td></tr></table>
</td></tr>
<tr><td style="${CARD};padding:24px 32px 8px 32px">
<h2 style="margin:0;font-family:${SERIF};font-size:21px;line-height:1.3;font-weight:600;color:#2d4a3e">Renueva tu Pro en línea</h2>
${body('Ya no hace falta transferir: pagas aquí mismo y se renueva solo cada período. Sigues con 200 preguntas al mes, 30 fotos para revisar tus piezas y todos los cursos en video. Si no renuevas, vuelves al plan Aprendiz: 8 preguntas al mes.')}
</td></tr>
<tr><td style="${CARD};padding:20px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" bgcolor="#ee8b5d" style="border-radius:999px">
<a href="{{{LINK_ANUAL}}}" target="_blank" style="display:block;padding:16px 24px;font-family:${FONT};font-size:16px;font-weight:bold;line-height:1.3;color:#1e1612;text-decoration:none;border-radius:999px">Pro anual · {{{PRECIO_ANUAL}}}</a>
</td></tr></table>
</td></tr>
<tr><td style="${CARD};padding:12px 32px 0 32px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="border:2px solid #2d4a3e;border-radius:999px">
<a href="{{{LINK_MENSUAL}}}" target="_blank" style="display:block;padding:14px 24px;font-family:${FONT};font-size:15px;font-weight:bold;line-height:1.3;color:#2d4a3e;text-decoration:none;border-radius:999px">Pro mensual · {{{PRECIO_MENSUAL}}}</a>
</td></tr></table>
</td></tr>
<tr><td style="${CARD};padding:16px 32px 32px 32px">
<p style="margin:16px 0 0 0;padding-top:16px;border-top:1px solid #e8e8e7;font-family:${FONT};font-size:13px;line-height:1.6;color:#5e5753">{{{NOTA_WHATSAPP}}}</p>
<p style="margin:12px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:#5e5753">¿Dudas antes de pagar? <a href="https://wa.me/573003526578?text=Hola%20El%20Charcu%2C%20tengo%20una%20pregunta%20sobre%20el%20Pro" style="color:#9c4a22">Escríbenos por WhatsApp</a>.</p>
</td></tr>
<tr><td style="background-color:#f4f1eb;border:1px solid #e8e8e7;border-top:0;border-radius:0 0 16px 16px;padding:24px 32px">
<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:#787371"><strong style="color:#2d4a3e">El Charcu</strong> &middot; Charcutería artesanal<br />Manizales, Colombia &middot; Sin aditivos, sin atajos</p>
</td></tr>
</table></td></tr></table></body></html>`;

export const TEMPLATE_TEXT = [
  '{{{NOMBRE}}}, tu mes de El Charcu Pro termina {{{CUANDO}}} ({{{FECHA_FIN}}}).',
  '',
  'Este mes: {{{PREGUNTAS}}} preguntas a El Charcu, {{{LECCIONES}}} lecciones en video y {{{CONVERSACIONES}}} recetas y dudas trabajadas.',
  '',
  'Lo que trabajaste: {{{TEMAS}}}',
  'Tu curso: {{{CURSO}}}',
  '',
  'Para tu próxima tanda — {{{DATO_TITULO}}}: {{{DATO_TEXTO}}}',
  '',
  'Renueva tu Pro en línea (se renueva solo cada período, sin transferencias):',
  'Anual ({{{PRECIO_ANUAL}}}): {{{LINK_ANUAL}}}',
  'Mensual ({{{PRECIO_MENSUAL}}}): {{{LINK_MENSUAL}}}',
  '',
  '{{{NOTA_WHATSAPP}}}',
  '',
  'El Charcu · Charcutería artesanal · Manizales, Colombia',
].join('\n');
