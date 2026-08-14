import type { UsageQuota } from '../model/types';

const STORAGE_KEY = 'elcharcu:usage-quota';

function isToday(dateStr: string): boolean {
  const lastUsed = new Date(dateStr);
  const today = new Date();
  return (
    lastUsed.getFullYear() === today.getFullYear() &&
    lastUsed.getMonth() === today.getMonth() &&
    lastUsed.getDate() === today.getDate()
  );
}

function emptyQuota(): UsageQuota {
  return {
    questionsUsed: 0,
    imagesUsed: 0,
    lastUsedAt: new Date().toISOString(),
  };
}

/** Lee el cupo del navegador. Si es de otro día, lo resetea. */
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
      'lastUsedAt' in parsed &&
      typeof parsed.questionsUsed === 'number' &&
      typeof parsed.imagesUsed === 'number' &&
      typeof parsed.lastUsedAt === 'string'
    ) {
      // Si es de otro día, resetear
      if (!isToday(parsed.lastUsedAt)) {
        return emptyQuota();
      }
      return {
        questionsUsed: parsed.questionsUsed,
        imagesUsed: parsed.imagesUsed,
        lastUsedAt: parsed.lastUsedAt,
      };
    }
  } catch {
    // JSON inválido
  }

  return emptyQuota();
}

/** Guarda el cupo en el navegador. */
export function saveQuota(quota: UsageQuota): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quota));
}

/** Suma una pregunta al contador. */
export function incrementQuestions(): UsageQuota {
  const current = loadQuota();
  const updated: UsageQuota = {
    ...current,
    questionsUsed: current.questionsUsed + 1,
    lastUsedAt: new Date().toISOString(),
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
    lastUsedAt: new Date().toISOString(),
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
}
