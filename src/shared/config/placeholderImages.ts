/**
 * Las fotos PROVISIONALES del diseño final (2026-10-07), en un solo sitio.
 *
 * Vienen de `design-refs/elcharcu-diseno-final/img/` (recortes de la app) y se
 * sirven desde `public/placeholders/`. Cuando lleguen las fotos reales se
 * cambian AQUÍ y ningún componente se entera.
 *
 * Las recetas y los cursos ya tienen su foto real (`image`, `cover_url`): esto
 * es solo para lo que todavía no la tiene.
 */
export const PLACEHOLDER_IMAGES = {
  /** La cabecera de la hoja de crear cuenta cuando lo tocado no tiene foto. */
  signupHeader: '/placeholders/lomo.jpg',
} as const;

/**
 * El video de la portada sin cuenta (Cristian, 2026-10-07). Vertical, como todo
 * el contenido, y arranca solo y sin audio al cargar. Se cambia aquí.
 */
export const HOME_VIDEO_ID = '41f1cc61-c835-4293-be5e-47d0c2f55108';
