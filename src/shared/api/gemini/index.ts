/**
 * ⚠️ SOLO SERVIDOR. Este barril expone la clave de Gemini a través de
 * `geminiConfig`. Importarlo desde un componente cliente filtraría una clave
 * que se cobra por uso.
 */
export { geminiConfig, isGeminiConfigured } from './config';
export { generateAnswer } from './generate';
export type { GeminiTurn, GeminiImage, GeminiResult, GeminiUsage } from './generate';
