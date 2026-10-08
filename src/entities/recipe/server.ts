/**
 * Puerta pública de las recetas para el SERVIDOR (2026-10-07).
 *
 * Desde que el recetario vive en la base (`charcu.recetario`), leerlo es una
 * consulta con la clave de servicio: no puede viajar al navegador. Las
 * funciones puras (`recipeBrief`, `findMentionedRecipe`…) y los tipos siguen
 * en `./index`.
 */
export {
  getRecetario,
  getRecetarioEntry,
  getRecipes,
  getRecipeBySlug,
  getRecipeSummaries,
  getRecipeTeasers,
  recetarioOrLastGood,
  RECETARIO_CACHE_TAG,
  staticRecipeSlugs,
} from './api/recipeApi';
export {
  linkReceivedRecipes,
  receivedRecipeSlugs,
  recordReceivedRecipe,
} from './api/receivedApi';
