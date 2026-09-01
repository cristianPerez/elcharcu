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

/**
 * La petición que ya va en camino, si la hay.
 *
 * ⚠️ Sin esto, cada consumidor pregunta por su cuenta y la misma pantalla pide
 * el mismo número varias veces. En una receta eran CUATRO peticiones a
 * `/api/cupo` en el mismo render (medido el 2026-08-31): dos dudas, y cada una
 * preguntando dos veces —la suya y la de `useLeadWall`—.
 *
 * Dentro de la app esto no pasa porque `QuotaProvider` lo resuelve en el
 * servidor y lo reparte; pero las recetas son estáticas, ahí no hay servidor
 * que preguntar en el primer render, y el proveedor no llega.
 *
 * Compartir la promesa es la respuesta correcta y no una caché: son peticiones
 * simultáneas a lo mismo, así que la respuesta es literalmente la misma. Se
 * suelta al terminar, de modo que la siguiente vez se vuelve a preguntar de
 * verdad y nadie se queda con un número viejo.
 */
let inFlight: Promise<QuotaSnapshot | null> | null = null;

/** Pregunta al servidor por el cupo actual. */
export async function fetchQuota(): Promise<QuotaSnapshot | null> {
  inFlight ??= requestQuota().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

async function requestQuota(): Promise<QuotaSnapshot | null> {
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
