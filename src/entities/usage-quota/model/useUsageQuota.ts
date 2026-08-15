'use client';

import { useEffect, useState } from 'react';

import { loadQuota, quotaStatus, subscribeToQuota } from '../lib/quotaStorage';

import { type QuotaStatus, type UsageQuota } from './types';

export interface UsageQuotaController {
  readonly quota: UsageQuota;
  readonly status: QuotaStatus;
  /** `false` hasta que se lee el navegador, para no pintar el muro en el servidor. */
  readonly isReady: boolean;
}

const SERVER_QUOTA: UsageQuota = { questionsUsed: 0, imagesUsed: 0, periodKey: '' };

/**
 * El cupo, ya reactivo. El contador vive en `localStorage`, así que el primer
 * render (servidor e hidratación) usa un cupo vacío y `isReady` en `false`:
 * así el muro nunca aparece por un instante antes de saber la verdad.
 */
export function useUsageQuota(): UsageQuotaController {
  const [quota, setQuota] = useState<UsageQuota>(SERVER_QUOTA);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setQuota(loadQuota());
    setIsReady(true);
    return subscribeToQuota(setQuota);
  }, []);

  return { quota, status: quotaStatus(quota), isReady };
}
