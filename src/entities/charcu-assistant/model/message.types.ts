export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  readonly content: string;
  /** Imagen adjunta como data URL, cuando el usuario manda una foto. */
  readonly imageDataUrl?: string | undefined;
  /**
   * `true` cuando el código de seguridad tuvo que bloquear la respuesta del
   * modelo por proponer una dosis por encima del tope legal.
   */
  readonly wasBlocked?: boolean | undefined;
}
