import { hotjar } from 'react-hotjar';

import { analyticsConfig } from './config';

/** Inicializa Hotjar (mapas de calor + grabación de sesión). Idempotente y solo en cliente. */
export function initHotjar(): void {
  if (
    typeof window === 'undefined' ||
    !analyticsConfig.hotjarId ||
    hotjar.initialized()
  ) {
    return;
  }

  hotjar.initialize({ id: analyticsConfig.hotjarId, sv: analyticsConfig.hotjarVersion });
}
