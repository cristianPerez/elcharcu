import { parseQuotaSnapshot, type QuotaSnapshot } from '../model/types';

/**
 * Un canal en memoria para repartir el cupo por la pantalla.
 *
 * El cupo lo devuelve el servidor en cada respuesta del asistente. Quien lo
 * recibe es el chat, pero quien tiene que reaccionar es la portada, que está
 * en otra rama del árbol. En vez de subir estado por props hasta arriba, el
 * chat publica aquí y quien quiera se suscribe.
 *
 * Se pierde al recargar, y está bien: al recargar se vuelve a preguntar.
 */

type Listener = (snapshot: QuotaSnapshot) => void;

const listeners = new Set<Listener>();

export function publishQuota(snapshot: QuotaSnapshot): void {
  for (const listener of listeners) {
    listener(snapshot);
  }
}

export function subscribeToQuota(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Publica lo que venga de una respuesta del servidor, si es un cupo válido. */
export function publishQuotaFrom(value: unknown): void {
  const snapshot = parseQuotaSnapshot(value);
  if (snapshot !== null) {
    publishQuota(snapshot);
  }
}

/** Pregunta al servidor por el cupo actual. */
export async function fetchQuota(): Promise<QuotaSnapshot | null> {
  try {
    const response = await fetch('/api/cupo', { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    const payload: unknown = await response.json();
    return parseQuotaSnapshot(payload);
  } catch {
    return null;
  }
}
