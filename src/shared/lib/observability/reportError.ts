/**
 * Un solo sitio por el que sale TODO fallo técnico.
 *
 * Existe antes que Datadog y a propósito: mientras no haya proveedor, esto
 * escribe en `console.error`, que en el servidor ya recoge Vercel. Cuando entre
 * el log drain o el SDK del navegador, se cablea AQUÍ y en ningún otro sitio —
 * en vez de repartir llamadas del proveedor por 17 archivos y tener que
 * desenredarlas si algún día se cambia de herramienta.
 *
 * ⚠️ QUÉ ES UN FALLO TÉCNICO Y QUÉ NO. Aquí van las cosas rotas: la base que no
 * contesta, una excepción sin capturar, un render que revienta. NO van los
 * fallos de NEGOCIO —el asistente sin presupuesto, una dosis peligrosa
 * bloqueada, el cupo agotado—, que son resultados esperados del producto y ya
 * viven en Mixpanel. Mezclarlos hace que ninguna de las dos herramientas cuente
 * la verdad completa.
 */

export type ErrorArea =
  | 'asistente'
  | 'cupo'
  | 'presupuesto'
  | 'receta'
  | 'perfil'
  | 'progreso'
  | 'lista-de-espera'
  | 'config'
  | 'navegador';

export interface ErrorContext {
  /** Datos que ayudan a entenderlo. Ver el aviso de abajo sobre qué NO poner. */
  readonly [key: string]: string | number | boolean | undefined;
}

/**
 * Apunta un fallo técnico.
 *
 * ⚠️ NUNCA se le pasa nada que identifique a una persona ni ningún secreto.
 * Ni correos, ni el texto de las preguntas, ni claves, ni el contenido de una
 * foto. Un `console.error` en el servidor va a acabar saliendo del edificio en
 * cuanto exista el log drain, así que lo que se escriba aquí se manda fuera.
 * Identificadores opacos —`visitor_id`, `recipe_slug`, un código de error— sí,
 * porque sirven para depurar y no dicen quién es nadie.
 *
 * Nunca lanza: un fallo al reportar un fallo no puede tumbar lo que iba bien.
 */
export function reportError(
  area: ErrorArea,
  message: string,
  context: ErrorContext = {},
): void {
  try {
    // JSON en una línea. Un log drain lo convierte en facetas solo; una cadena
    // suelta hay que parsearla después con una regla frágil.
    console.error(
      JSON.stringify({
        level: 'error',
        area,
        message,
        ...context,
      }),
    );
  } catch {
    // Si ni siquiera se pudo serializar, algo muy raro pasa — pero callarse es
    // mejor que reventar el camino de quien está usando la app.
  }
}

/** Lo mismo, para lo que preocupa pero no ha roto nada todavía. */
export function reportWarning(
  area: ErrorArea,
  message: string,
  context: ErrorContext = {},
): void {
  try {
    console.warn(JSON.stringify({ level: 'warn', area, message, ...context }));
  } catch {
    // Igual que arriba.
  }
}
