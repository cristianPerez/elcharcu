/**
 * Puerta pública de las recetas del asistente para el SERVIDOR.
 * Usa la clave secreta de Supabase: no puede viajar al navegador.
 */
export {
  createRecipe,
  latestOpenRecipe,
  ownsRecipe,
  touchRecipe,
  draftTitle,
  saveExchange,
  recipeMessages,
  recipeHeader,
  listRecipes,
  hasSignedInHistory,
  renameRecipe,
} from './api/recipeChatApi';
export type { StoredMessage, RecipeSummary } from './api/recipeChatApi';
