/**
 * Cuál es la conversación abierta, y hasta cuándo sigue siéndolo.
 *
 * Vive en `sessionStorage` y no en memoria porque tiene que sobrevivir a una
 * recarga: cuando el id de la receta vivía solo en memoria, recargar era una
 * amnesia y el servidor tenía que adivinar cuál retomar. Ese "adivinar" es
 * justo lo que impedía que existieran chats nuevos.
 *
 * LA REGLA (decisión de Cristian, 2026-08-20). Se empieza en blanco cuando
 * pasa CUALQUIERA de las dos cosas:
 *
 *   1. Una hora sin escribir.
 *   2. Se cierra la pestaña del navegador.
 *
 * Las dos salen de la misma línea de código: `sessionStorage` muere sola al
 * cerrar la pestaña, y la marca de tiempo se encarga de la inactividad. No
 * hace falta escuchar eventos ni preguntarle nada al usuario.
 *
 * Una hora, y no seis: una pregunta de charcutería se resuelve en minutos. Si
 * alguien vuelve al cabo de una hora, casi seguro trae otra duda, y meterla en
 * el hilo anterior ensucia las dos conversaciones. Volver a lo de antes está a
 * un toque en el historial.
 */

const KEY = 'elcharcu:chat-activo';

/** Una hora en milisegundos. */
const SESSION_WINDOW_MS = 60 * 60 * 1000;

interface ActiveChat {
  readonly recipeId: string;
  /** Cuándo se habló por última vez, en milisegundos. */
  readonly at: number;
}

function parse(raw: string | null): ActiveChat | null {
  if (raw === null) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) {
      return null;
    }
    const { recipeId, at } = value as Record<string, unknown>;
    if (typeof recipeId !== 'string' || recipeId === '' || typeof at !== 'number') {
      return null;
    }
    return { recipeId, at };
  } catch {
    return null;
  }
}

/**
 * La conversación que hay que retomar, o `null` para empezar en blanco.
 *
 * Devolver `null` NO es un error: es la respuesta correcta cuando pasó más de
 * una hora o cuando se cerró la pestaña. Quien la llame no debe tratarlo como
 * un fallo.
 */
export function activeRecipeId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = parse(window.sessionStorage.getItem(KEY));
  if (stored === null) {
    return null;
  }

  if (Date.now() - stored.at > SESSION_WINDOW_MS) {
    // Caducó: se limpia para no volver a mirarlo en cada carga.
    window.sessionStorage.removeItem(KEY);
    return null;
  }

  return stored.recipeId;
}

/** Marca cuál es la conversación abierta y reinicia la hora de inactividad. */
export function rememberActiveRecipe(recipeId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  const value: ActiveChat = { recipeId, at: Date.now() };
  window.sessionStorage.setItem(KEY, JSON.stringify(value));
}

/**
 * Suelta la conversación abierta: la siguiente pregunta empezará una nueva.
 *
 * Lo usan el botón de "Nueva receta" y las preguntas que llegan desde una
 * lección, que siempre abren hilo aparte.
 */
export function clearActiveRecipe(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.removeItem(KEY);
}
