import { FREE_TIER_LIMITS, type QuotaStatus, type UsageQuota } from '../model/types';

const STORAGE_KEY = 'elcharcu:usage-quota';

/** El periodo del cupo es el mes natural: `2026-08`. */
function currentPeriodKey(): string {
  const now = new Date();
  return `${String(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function emptyQuota(): UsageQuota {
  return { questionsUsed: 0, imagesUsed: 0, periodKey: currentPeriodKey() };
}

type Listener = (quota: UsageQuota) => void;

const listeners = new Set<Listener>();

function notify(quota: UsageQuota): void {
  for (const listener of listeners) {
    listener(quota);
  }
}

/**
 * Avisa cuando el cupo cambia. El contador vive en `localStorage`, que no
 * dispara re-render por sí solo, así que la pantalla necesita este aviso para
 * levantar el muro en el mismo momento en que se agota.
 */
export function subscribeToQuota(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Lee el cupo del navegador. Si es de otro mes, arranca de cero. */
export function loadQuota(): UsageQuota {
  if (typeof window === 'undefined') {
    return emptyQuota();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return emptyQuota();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'questionsUsed' in parsed &&
      'imagesUsed' in parsed &&
      'periodKey' in parsed &&
      typeof parsed.questionsUsed === 'number' &&
      typeof parsed.imagesUsed === 'number' &&
      typeof parsed.periodKey === 'string'
    ) {
      if (parsed.periodKey !== currentPeriodKey()) {
        return emptyQuota();
      }
      return {
        questionsUsed: parsed.questionsUsed,
        imagesUsed: parsed.imagesUsed,
        periodKey: parsed.periodKey,
      };
    }
  } catch {
    // JSON inválido: se trata como cupo nuevo.
  }

  return emptyQuota();
}

/** Guarda el cupo en el navegador. */
export function saveQuota(quota: UsageQuota): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quota));
  notify(quota);
}

/** Suma una pregunta al contador. */
export function incrementQuestions(): UsageQuota {
  const current = loadQuota();
  const updated: UsageQuota = {
    ...current,
    questionsUsed: current.questionsUsed + 1,
    periodKey: currentPeriodKey(),
  };
  saveQuota(updated);
  return updated;
}

/** Suma una imagen al contador. */
export function incrementImages(): UsageQuota {
  const current = loadQuota();
  const updated: UsageQuota = {
    ...current,
    imagesUsed: current.imagesUsed + 1,
    periodKey: currentPeriodKey(),
  };
  saveQuota(updated);
  return updated;
}

/** Borra el cupo (útil para pruebas o cuando se migre a la base). */
export function clearQuota(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  notify(emptyQuota());
}

/** Traduce los contadores a lo que le queda al visitante del plan gratis. */
export function quotaStatus(quota: UsageQuota): QuotaStatus {
  const questionsLeft = Math.max(
    0,
    FREE_TIER_LIMITS.questionsPerMonth - quota.questionsUsed,
  );
  const imagesLeft = Math.max(0, FREE_TIER_LIMITS.imagesPerMonth - quota.imagesUsed);

  return {
    questionsLeft,
    imagesLeft,
    isExhausted: questionsLeft === 0,
    areImagesExhausted: imagesLeft === 0,
  };
}
