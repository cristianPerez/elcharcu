import mixpanel from 'mixpanel-browser';

import { analyticsConfig } from './config';

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

let isReady = false;

/** Inicializa Mixpanel (autocapture + grabación de sesión). Idempotente y solo en cliente. */
export function initMixpanel(): void {
  if (isReady || typeof window === 'undefined' || !analyticsConfig.mixpanelToken) {
    return;
  }

  // eslint-disable-next-line import/no-named-as-default-member -- intentional: default Mixpanel instance API, not the named module-level export
  mixpanel.init(analyticsConfig.mixpanelToken, {
    autocapture: true,
    record_sessions_percent: 100,
    track_pageview: true,
  });

  isReady = true;
}

/** Envía un evento a Mixpanel. No-op si Mixpanel no se ha inicializado (token ausente). */
export function track(event: string, properties?: AnalyticsProperties): void {
  if (!isReady) {
    return;
  }
  // eslint-disable-next-line import/no-named-as-default-member -- intentional: default Mixpanel instance API, not the named module-level export
  mixpanel.track(event, properties);
}

function resolveButtonLabel(element: HTMLElement): string {
  const text = element.textContent?.trim();
  const ariaLabel = element.getAttribute('aria-label');
  return text || ariaLabel || 'unknown';
}

/**
 * Autocaptura genérica de clics en botones y enlaces (evento `button_clicked`).
 * Complementa el autocapture nativo de Mixpanel con un evento propio, fácil de
 * filtrar en el dashboard. Devuelve la función de limpieza del listener.
 */
export function attachButtonClickTracking(): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const handleClick = (event: MouseEvent): void => {
    const { target } = event;
    if (!(target instanceof Element)) {
      return;
    }

    const clickable = target.closest('button, a');
    if (!(clickable instanceof HTMLElement)) {
      return;
    }

    const label = resolveButtonLabel(clickable);
    track('button_clicked', {
      button_name: label.toLowerCase().replace(/\s+/g, '_'),
      label,
      tag: clickable.tagName.toLowerCase(),
      href: clickable instanceof HTMLAnchorElement ? clickable.href : undefined,
    });
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}
