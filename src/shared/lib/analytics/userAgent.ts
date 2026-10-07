/**
 * Desde qué navegador llega alguien, leído del user agent (2026-10-07).
 *
 * Existe por la fuga del enlace mágico: mucho tráfico entra por los
 * navegadores internos de Instagram, Facebook y TikTok, el correo se abre en
 * otra app y el enlace acaba en un navegador distinto al que lo pidió. Para
 * medir eso hace falta saber, en cada paso, desde dónde se está.
 *
 * Funciona igual en el navegador (`navigator.userAgent`) y en el servidor (la
 * cabecera `user-agent`): son funciones puras sobre un texto.
 *
 * ⚠️ Es una aproximación. Los user agents se pueden cambiar y las apps los
 * cambian entre versiones. Sirve para separar un embudo, no para decidir nada
 * de seguridad.
 */

export type InAppBrowser =
  'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'otro' | 'ninguno';
export type DeviceKind = 'movil' | 'tablet' | 'escritorio';
export type OsKind = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'otro';

/**
 * El navegador interno de una app, o `ninguno` si es un navegador de verdad.
 *
 * El orden importa: Instagram va antes que Facebook porque en algunas
 * versiones su user agent arrastra marcas de Facebook.
 */
export function inAppBrowserOf(userAgent: string): InAppBrowser {
  const ua = userAgent;
  if (/Instagram/i.test(ua)) {
    return 'instagram';
  }
  if (/FBAN|FBAV|FB_IAB|FBIOS|FB4A|\[FB/i.test(ua)) {
    return 'facebook';
  }
  if (/musical_ly|Bytedance|TikTok|trill_/i.test(ua)) {
    return 'tiktok';
  }
  if (/WhatsApp/i.test(ua)) {
    return 'whatsapp';
  }
  // Otras apps conocidas, y las vistas web genéricas: en Android llevan "; wv)";
  // en iOS, un WebKit de iPhone/iPad sin la marca "Safari/".
  if (
    /Line\/|Snapchat|Twitter|LinkedInApp|Pinterest|GSA\/|; wv\)/i.test(ua) ||
    (/iPhone|iPad|iPod/i.test(ua) && /AppleWebKit/i.test(ua) && !/Safari\//i.test(ua))
  ) {
    return 'otro';
  }
  return 'ninguno';
}

export function deviceOf(userAgent: string): DeviceKind {
  // Android sin "Mobile" en NINGUNA parte es tablet. Mirarlo con un lookahead
  // fallaba con Instagram, que repite "Android" al final, después de "Mobile".
  if (
    /iPad|Tablet/i.test(userAgent) ||
    (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))
  ) {
    return 'tablet';
  }
  if (/Mobi|iPhone|iPod|Android/i.test(userAgent)) {
    return 'movil';
  }
  return 'escritorio';
}

export function osOf(userAgent: string): OsKind {
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  }
  if (/Android/i.test(userAgent)) {
    return 'android';
  }
  if (/Windows/i.test(userAgent)) {
    return 'windows';
  }
  if (/Mac OS X|Macintosh/i.test(userAgent)) {
    return 'macos';
  }
  if (/Linux/i.test(userAgent)) {
    return 'linux';
  }
  return 'otro';
}

/** Las tres propiedades juntas, como van en cada evento del embudo de entrada. */
export function browserContextOf(userAgent: string): {
  readonly in_app_browser: InAppBrowser;
  readonly device: DeviceKind;
  readonly os: OsKind;
} {
  return {
    in_app_browser: inAppBrowserOf(userAgent),
    device: deviceOf(userAgent),
    os: osOf(userAgent),
  };
}
