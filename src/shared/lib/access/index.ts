/**
 * Las reglas de acceso de la app, en UN sitio y como funciones puras
 * (diseño final, 2026-10-07). Las usan la pantalla y el servidor; RLS hace lo
 * suyo en la base. Nada de dominio: reciben datos simples.
 */
export { DEFAULT_DESTINATION, safeDestination } from './destination';
export {
  ANONYMOUS_QUESTIONS,
  canAskWithoutAccount,
  canOpenCourse,
  canOpenRecipeFromCookbook,
  canSeeFullCookbook,
  canSeeRelatedRecipes,
  isSubscriber,
  viewerPlanOf,
} from './rules';
export type { ViewerPlan } from './rules';
