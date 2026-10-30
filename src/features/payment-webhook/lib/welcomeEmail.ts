import { type Email } from '@/shared/api/email';

/**
 * El correo de "tu Pro está activo". Mismo esqueleto y colores que las
 * plantillas de Supabase (`supabase/templates/`): tablas, estilos en línea,
 * botón en terracota-dark.
 *
 * Dice tres cosas, en este orden: tu pago entró, entra por aquí, y si el botón
 * ya no sirve, cómo entrar igual. ⚠️ Esa tercera es la red: el enlace mágico
 * caduca y sirve una vez (y algunos filtros de Outlook lo gastan al revisarlo),
 * pero la cuenta es del CORREO, así que `/entrar` con el mismo correo siempre
 * funciona: desde el 2026-10-30 allí se entra con un código de 6 dígitos, que
 * ningún filtro gasta porque el correo de Supabase ya no trae enlace.
 */
interface WelcomeInput {
  readonly to: string;
  readonly entrarUrl: string;
  readonly magicLink: string;
}

const FONT = 'Arial, Helvetica, sans-serif';
const SERIF = "Georgia, 'Times New Roman', serif";

const paragraph = (text: string, size = 16, color = '#1e1612'): string =>
  `<p style="margin:16px 0 0 0;font-family:${FONT};font-size:${size}px;line-height:1.6;color:${color}">${text}</p>`;

export function welcomeEmail({ to, entrarUrl, magicLink }: WelcomeInput): Email {
  const subject = 'Tu suscripción a El Charcu Pro está activa';

  const text = [
    'Tu pago entró. Ya tienes El Charcu Pro: los cursos en video, el recetario completo y El Charcu AI.',
    '',
    `Entra aquí (verifica tu correo y quedas dentro): ${magicLink}`,
    '',
    'El enlace caduca y sirve una sola vez. Si ya no funciona, entra en',
    `${entrarUrl} con este mismo correo (${to}) y te mandamos un código para entrar.`,
    '',
    'El Charcu · Charcutería artesanal · Manizales, Colombia',
  ].join('\n');

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" /><meta name="supported-color-schemes" content="light" />
<title>${subject}</title></head>
<body style="margin:0;padding:0;width:100%;background-color:#f4f1eb">
<div style="display:none;font-size:1px;color:#f4f1eb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">Tu pago entró. Toca el botón para entrar a tu cuenta.</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f1eb"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px">
<tr><td style="background-color:#2d4a3e;border-radius:16px 16px 0 0;padding:28px 32px">
<div style="font-family:${SERIF};font-size:22px;font-weight:700;letter-spacing:0.02em;color:#ffffff">EL CHARCU</div>
<div style="font-family:${FONT};font-size:11px;letter-spacing:0.28em;color:#7a9e8e;padding-top:6px">ARTESANAL</div>
</td></tr>
<tr><td style="background-color:#ffffff;padding:36px 32px 8px 32px;border-left:1px solid #e8e8e7;border-right:1px solid #e8e8e7">
<h1 style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.2;font-weight:600;color:#2d4a3e">Tu pago entró. Ya eres Pro.</h1>
${paragraph('Tienes los cursos maestros en video, el recetario completo y El Charcu AI para revisar tus curados.')}
${paragraph('Toca el botón: verificas tu correo y quedas dentro. No hay contraseña que recordar.')}
</td></tr>
<tr><td style="background-color:#ffffff;padding:24px 32px 8px 32px;border-left:1px solid #e8e8e7;border-right:1px solid #e8e8e7">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#A8664A" style="border-radius:999px">
<a href="${magicLink}" target="_blank" style="display:inline-block;padding:16px 34px;font-family:${FONT};font-size:16px;font-weight:bold;line-height:1;color:#ffffff;text-decoration:none;border-radius:999px">Entrar a El Charcu</a>
</td></tr></table>
</td></tr>
<tr><td style="background-color:#ffffff;padding:16px 32px 32px 32px;border-left:1px solid #e8e8e7;border-right:1px solid #e8e8e7">
<p style="margin:24px 0 0 0;padding-top:20px;border-top:1px solid #e8e8e7;font-family:${FONT};font-size:13px;line-height:1.6;color:#787371">
El botón caduca y sirve una sola vez. Si ya no funciona, entra en <a href="${entrarUrl}" style="color:#a8664a">${entrarUrl.replace(/^https?:\/\//, '')}</a> con este mismo correo (<strong style="color:#2d4a3e">${to}</strong>) y te mandamos un código para entrar.</p>
</td></tr>
<tr><td style="background-color:#f4f1eb;border:1px solid #e8e8e7;border-top:0;border-radius:0 0 16px 16px;padding:24px 32px">
<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:#787371"><strong style="color:#2d4a3e">El Charcu</strong> &middot; Charcutería artesanal<br />Manizales, Colombia &middot; Sin aditivos, sin atajos</p>
</td></tr>
</table></td></tr></table></body></html>`;

  return { to, subject, html, text };
}
