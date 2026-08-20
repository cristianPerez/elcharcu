import { type ChatMessage } from '@/entities/charcu-assistant';

export interface OpenChat {
  readonly recipeId: string | null;
  readonly title: string | null;
  readonly messages: readonly ChatMessage[];
}

/**
 * La conversación abierta, recordada mientras dure la visita.
 *
 * Vive en una variable de módulo —no en `localStorage`, no en una librería de
 * estado— porque solo tiene que sobrevivir a algo muy concreto: cambiar de
 * pestaña y volver. Cada vez que se volvía al asistente se montaba el chat de
 * cero y salía otra petición a `/api/receta` para traer la misma conversación
 * que el usuario acababa de tener delante.
 *
 * Se pierde al recargar, y está bien: recargar es justo cuando SÍ hay que
 * preguntarle a la base, porque puede haber respondido desde otro dispositivo.
 *
 * ⚠️ Es memoria del navegador, no una copia de seguridad. La conversación de
 * verdad vive en `charcu.chat_messages`; esto es solo para no ir a buscarla
 * dos veces en el mismo minuto.
 */
let openChat: OpenChat | null = null;

export function rememberChat(chat: OpenChat): void {
  openChat = chat;
}

export function recallChat(): OpenChat | null {
  return openChat;
}

/**
 * No hace falta un `forgetChat()`: al cerrar sesión se recarga la página
 * entera (ver `SignOutButton`), y con la recarga esto se va solo. Una función
 * de limpieza obligaría a `auth-by-email` a importar de esta feature, que es
 * un import lateral de los que CLAUDE.md prohíbe.
 */
