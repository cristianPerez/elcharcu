import { isCuringProductId, type CuringProductId } from '@/entities/curing-profile';

import { type RecipeSession } from '../model/session.types';

/**
 * Las recetas que el usuario ha empezado.
 *
 * ⚠️ TEMPORAL: hoy vive en el navegador. Mientras siga aquí, el límite de una
 * sola receta gratis se puede saltar borrando los datos del navegador. Pasa a
 * ser un límite real cuando esto se mueva a Supabase; solo cambia este archivo.
 */
const STORAGE_KEY = 'elcharcu:recipe-sessions';

function parseSession(value: unknown): RecipeSession | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate: Record<string, unknown> = { ...value };
  const { id, product, startedAt, isFree } = candidate;

  if (
    typeof id !== 'string' ||
    !isCuringProductId(product) ||
    typeof startedAt !== 'string' ||
    typeof isFree !== 'boolean'
  ) {
    return null;
  }

  return { id, product, startedAt, isFree };
}

export function loadSessions(): readonly RecipeSession[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Descartamos en silencio lo que venga corrupto en vez de romper la app.
    return parsed
      .map((item: unknown) => parseSession(item))
      .filter((session): session is RecipeSession => session !== null);
  } catch {
    return [];
  }
}

function persist(sessions: readonly RecipeSession[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sesion-${String(Date.now())}`;
}

/**
 * Abre una receta. Si esa misma receta ya estaba abierta devuelve la existente,
 * para que volver a ella nunca cuente como empezar una nueva.
 */
export function startSession(product: CuringProductId, isFree: boolean): RecipeSession {
  const sessions = loadSessions();
  const existing = sessions.find((session) => session.product === product);

  if (existing !== undefined) {
    return existing;
  }

  const session: RecipeSession = {
    id: createId(),
    product,
    startedAt: new Date().toISOString(),
    isFree,
  };

  persist([...sessions, session]);
  return session;
}

export function findSessionByProduct(product: CuringProductId): RecipeSession | null {
  return loadSessions().find((session) => session.product === product) ?? null;
}
