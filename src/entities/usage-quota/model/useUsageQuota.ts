'use client';

import { useEffect, useState } from 'react';

import { fetchQuota, subscribeToQuota } from '../lib/quotaChannel';

import { useSharedQuota } from './QuotaProvider';
import { EMPTY_QUOTA, quotaStatus, type QuotaSnapshot, type QuotaStatus } from './types';

export interface UsageQuotaController {
  readonly quota: QuotaSnapshot;
  readonly status: QuotaStatus;
  /** `false` hasta que el servidor contesta, para no pintar el muro de más. */
  readonly isReady: boolean;
  /**
   * `true` solo si de verdad SABEMOS cuál es el cupo.
   *
   * No es lo mismo "te quedan cero preguntas" que "no pude preguntar cuántas
   * te quedan". Si se confunden, una caída de red le enseña el muro de pago a
   * alguien que acaba de llegar — que es exactamente lo que pasaba antes de
   * separar estas dos cosas.
   */
  readonly isKnown: boolean;
}

/**
 * El cupo del visitante, preguntado al servidor y mantenido al día.
 *
 * El primer render (servidor e hidratación) va con el cupo vacío y
 * `isReady` en `false`: así el muro nunca parpadea antes de saber la verdad.
 */
export function useUsageQuota(): UsageQuotaController {
  const shared = useSharedQuota();
  const [quota, setQuota] = useState<QuotaSnapshot>(EMPTY_QUOTA);
  const [isReady, setIsReady] = useState(false);
  const [isKnown, setIsKnown] = useState(false);

  // Dentro de la app el cupo ya viene resuelto desde el servidor y compartido
  // por el proveedor: no se pregunta nada. Este efecto es para el sitio
  // público, donde no hay proveedor y hay que ir a buscarlo.
  const hasShared = shared !== null;

  useEffect(() => {
    if (hasShared) {
      return undefined;
    }

    let isMounted = true;

    void fetchQuota().then((snapshot) => {
      if (!isMounted) {
        return;
      }
      if (snapshot !== null) {
        setQuota(snapshot);
        setIsKnown(true);
      }
      setIsReady(true);
    });

    const unsubscribe = subscribeToQuota((snapshot) => {
      if (isMounted) {
        setQuota(snapshot);
        setIsKnown(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [hasShared]);

  if (shared !== null) {
    return {
      quota: shared.quota,
      status: quotaStatus(shared.quota),
      isReady: true,
      isKnown: shared.isKnown,
    };
  }

  return { quota, status: quotaStatus(quota), isReady, isKnown };
}
