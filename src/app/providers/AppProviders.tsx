'use client';

import { type ReactNode, useEffect } from 'react';

import { attachButtonClickTracking, initHotjar, initMixpanel } from '@/shared/lib';

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Punto único para componer todos los providers globales de la app
 * (analítica, theme, query-client, i18n, store, etc.). Mantener este árbol plano.
 */
export function AppProviders({ children }: AppProvidersProps): ReactNode {
  useEffect(() => {
    initMixpanel();
    initHotjar();
    return attachButtonClickTracking();
  }, []);

  return children;
}
