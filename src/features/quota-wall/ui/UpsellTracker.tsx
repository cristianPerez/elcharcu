'use client';

import { useEffect, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

interface UpsellTrackerProps {
  /** De dónde llegó: `muro`, `menu`, `directo`… */
  readonly source: string;
}

/**
 * Apunta que alguien VIO la página de upsell.
 *
 * Es una página propia y no un modal justamente por esto: un modal se mide a
 * medias, una URL se mide sola y se puede mandar por WhatsApp, poner en la bio
 * o usar como destino de un anuncio.
 */
export function UpsellTracker({ source }: UpsellTrackerProps): ReactNode {
  useEffect(() => {
    track(ANALYTICS_EVENTS.upsellViewed, { source });
  }, [source]);

  return null;
}
