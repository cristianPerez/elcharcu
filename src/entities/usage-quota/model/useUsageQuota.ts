'use client';

import { useEffect, useState } from 'react';

import { fetchQuota, subscribeToQuota } from '../lib/quotaChannel';

import { EMPTY_QUOTA, quotaStatus, type QuotaSnapshot, type QuotaStatus } from './types';

export interface UsageQuotaController {
  readonly quota: QuotaSnapshot;
  readonly status: QuotaStatus;
  /** `false` hasta que el servidor contesta, para no pintar el muro de más. */
  readonly isReady: boolean;
}

/**
 * El cupo del visitante, preguntado al servidor y mantenido al día.
 *
 * El primer render (servidor e hidratación) va con el cupo vacío y
 * `isReady` en `false`: así el muro nunca parpadea antes de saber la verdad.
 */
export function useUsageQuota(): UsageQuotaController {
  const [quota, setQuota] = useState<QuotaSnapshot>(EMPTY_QUOTA);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void fetchQuota().then((snapshot) => {
      if (!isMounted) {
        return;
      }
      if (snapshot !== null) {
        setQuota(snapshot);
      }
      setIsReady(true);
    });

    const unsubscribe = subscribeToQuota((snapshot) => {
      if (isMounted) {
        setQuota(snapshot);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { quota, status: quotaStatus(quota), isReady };
}
