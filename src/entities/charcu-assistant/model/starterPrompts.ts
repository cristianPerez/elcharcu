/**
 * Las preguntas de ejemplo con las que abre el asistente.
 *
 * Es lo que hacen ChatGPT, Claude, Perplexity y Gemini, y no por copiarse: una
 * caja de texto vacía es una hoja en blanco, y ante una hoja en blanco la
 * mayoría se va. Un ejemplo tocable enseña de qué se puede hablar **y** arranca
 * la conversación en un solo gesto — antes había que leer seis líneas que
 * explicaban qué escribir.
 *
 * Las cuatro salen de los miedos documentados en el spec, no de lo que suene
 * bonito: la dosis de sal de cura y el moho son el miedo nº1 (enfermar a la
 * familia); la humedad y el tiempo son donde se arruina la pieza.
 *
 * Cortas a propósito: a 375px una pastilla de más de ~34 caracteres se parte.
 */
export interface StarterPrompt {
  /** Lo que se ve en la pastilla. */
  readonly label: string;
  /** Lo que de verdad se le manda al asistente, ya redactado. */
  readonly prompt: string;
}

export const STARTER_PROMPTS: readonly StarterPrompt[] = [
  {
    label: '¿Cuánta sal de cura para 2 kg?',
    prompt: '¿Cuánta sal de cura #1 le pongo a 2 kilos de carne?',
  },
  {
    label: 'Le salió moho, ¿lo salvo?',
    prompt:
      'A mi pieza le salió moho mientras se curaba. ¿Cómo sé si lo puedo salvar o si toca descartarlo?',
  },
  {
    label: '¿Qué humedad necesito?',
    prompt:
      '¿A qué temperatura y humedad debo colgar mi pieza para curarla, y cómo lo consigo en casa?',
  },
  {
    label: '¿Cuánto tiempo se cura?',
    prompt:
      '¿Cuánto tiempo tarda en curarse una pieza y cómo sé que ya está lista para comer?',
  },
];
