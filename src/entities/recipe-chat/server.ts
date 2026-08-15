/**
 * Puerta pública de las recetas del asistente para el SERVIDOR.
 * Usa la clave secreta de Supabase: no puede viajar al navegador.
 */
export { createRecipe, ownsRecipe, touchRecipe, draftTitle } from './api/recipeChatApi';
