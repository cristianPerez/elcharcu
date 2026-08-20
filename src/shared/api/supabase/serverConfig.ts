/**
 * Credenciales de Supabase para el SERVIDOR, con red de seguridad.
 *
 * Existe por un fallo real que costó una mañana (QA, 2026-08-19): las variables
 * `NEXT_PUBLIC_*` estaban marcadas como *Sensitive* en Vercel, y las Sensitive
 * NO están disponibles durante la compilación. Como Next sustituye las
 * `NEXT_PUBLIC_*` por su valor literal al compilar —en el bundle del navegador
 * **y en el del servidor**— quedaron vacías en los dos lados. Resultado: el
 * navegador decía "las cuentas no están conectadas" y `/api/cupo` y
 * `/api/receta` devolvían 500 con "Your project's URL and Key are required".
 *
 * Aquí el servidor deja de depender de una variable pública: si la
 * `NEXT_PUBLIC_*` viene vacía, usa la equivalente sin prefijo, que sí se lee al
 * ejecutar. El navegador no tiene arreglo posible —necesita la pública sí o
 * sí—, pero al menos la app deja de caerse entera por una etiqueta mal puesta
 * en un panel.
 *
 * Se leen dentro de funciones y no en una constante de módulo a propósito: así
 * el valor se toma cuando se usa, no cuando se importa.
 */

function firstNonEmpty(...values: readonly (string | undefined)[]): string {
  for (const value of values) {
    if (value !== undefined && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

/** La URL del proyecto. La pública manda; la privada es el respaldo. */
export function serverSupabaseUrl(): string {
  return firstNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL);
}

/**
 * La clave publicable, la que respeta los permisos por fila.
 *
 * `SUPABASE_PUBLISHABLE_KEY` (sin prefijo) es el respaldo. No hace falta
 * tenerla si la pública está bien puesta, pero definirla cuesta nada y evita
 * que el servidor dependa de que alguien marque bien una casilla.
 */
export function serverSupabasePublishableKey(): string {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
  );
}

/** La clave secreta. Nunca lleva prefijo público y nunca viaja al navegador. */
export function serverSupabaseSecretKey(): string {
  return firstNonEmpty(process.env.SUPABASE_SECRET_KEY);
}

export function isServerSupabaseConfigured(): boolean {
  return serverSupabaseUrl() !== '' && serverSupabasePublishableKey() !== '';
}

/**
 * Deja constancia en el log de POR QUÉ no hay Supabase.
 *
 * Sin esto, el único síntoma era una pantalla diciendo "vuelve en un rato" —
 * que además es mentira: sin variables, esto no se arregla solo por esperar.
 * Se avisa una vez por proceso para no ensuciar el log en cada petición.
 */
let alreadyWarned = false;

export function warnIfMisconfigured(where: string): void {
  if (alreadyWarned || isServerSupabaseConfigured()) {
    return;
  }
  alreadyWarned = true;

  const faltaUrl = serverSupabaseUrl() === '';
  const faltaClave = serverSupabasePublishableKey() === '';

  console.error(
    `[supabase] Sin credenciales en ${where}. ` +
      `Falta ${faltaUrl ? 'la URL' : ''}${faltaUrl && faltaClave ? ' y ' : ''}` +
      `${faltaClave ? 'la clave publicable' : ''}. ` +
      'Esto NO es una caída de Supabase: es configuración. Revisa las variables ' +
      'de entorno del despliegue — y si son NEXT_PUBLIC_*, que NO estén marcadas ' +
      'como Sensitive, porque entonces no existen al compilar.',
  );
}
