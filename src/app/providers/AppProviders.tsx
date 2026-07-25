import { type ReactNode } from 'react';

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Punto único para componer todos los providers globales de la app
 * (theme, query-client, i18n, store, etc.). Mantener este árbol plano.
 */
export function AppProviders({ children }: AppProvidersProps): ReactNode {
  return children;
}
