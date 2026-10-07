/**
 * Las fotos PROVISIONALES del diseño final (2026-10-07), en un solo sitio.
 *
 * Vienen de `design-refs/elcharcu-diseno-final/img/` (recortes de la app) y se
 * sirven desde `public/placeholders/`. Cuando lleguen las fotos reales se
 * cambian AQUÍ y ningún componente se entera.
 *
 * Las recetas y los cursos ya tienen su foto real (`image`, `cover_url`): esto
 * es solo para lo que todavía no la tiene, como el cartel del tráiler.
 */
export const PLACEHOLDER_IMAGES = {
  /** El cartel del tráiler "Así se aprende en El Charcu". */
  trailerPoster: '/placeholders/bondiola.jpg',
  /** La cabecera de la hoja de crear cuenta cuando lo tocado no tiene foto. */
  signupHeader: '/placeholders/lomo.jpg',
} as const;

/**
 * El tráiler de la portada. Por ahora es la bienvenida del curso de lomo
 * curado (decisión de Cristian, 2026-10-07): cuando haya uno propio, se
 * cambia aquí.
 */
export const TRAILER_VIDEO_ID = '2fa024cc-a711-468c-b42a-e370699524bd';
