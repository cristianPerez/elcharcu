/**
 * Credenciales de Gemini.
 *
 * ⚠️ SOLO SERVIDOR. Ninguna de estas variables lleva el prefijo `NEXT_PUBLIC_`,
 * así que Next no las manda al navegador. Nunca importes este archivo desde un
 * componente cliente: la clave se cobra por uso y no puede quedar expuesta.
 */
export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY ?? '',
  model: process.env.AI_MODEL ?? 'gemini-3.6-flash',
} as const;

export function isGeminiConfigured(): boolean {
  return geminiConfig.apiKey !== '';
}
