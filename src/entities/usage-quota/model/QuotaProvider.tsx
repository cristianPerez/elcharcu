'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { subscribeToQuota } from '../lib/quotaChannel';

import { type QuotaSnapshot } from './types';

interface QuotaStore {
  readonly quota: QuotaSnapshot;
  readonly isKnown: boolean;
}

const QuotaContext = createContext<QuotaStore | null>(null);

interface QuotaProviderProps {
  /**
   * El cupo tal como lo leyó el SERVIDOR al pintar la pantalla.
   *
   * Que venga ya resuelto es la mitad del arreglo: sin esto, cada pestaña
   * montaba su propio `useUsageQuota` y salía otra petición a `/api/cupo`
   * —1,4 s medidos— para traer un número que el servidor acababa de tener en
   * la mano.
   */
  readonly initial: QuotaSnapshot | null;
  readonly children: ReactNode;
}

/**
 * El cupo, una sola vez y para toda la app.
 *
 * No hace falta ninguna librería de estado para esto: son dos valores que
 * cambian poco y que solo escribe el servidor. Un contexto de React más el
 * canal que ya existía llega y sobra — y no suma una dependencia que después
 * hay que mantener.
 *
 * Se actualiza sin volver a preguntar: cada respuesta del asistente trae el
 * cupo nuevo y lo publica en `quotaChannel`. La red solo se toca cuando algo
 * cambia de verdad.
 */
export function QuotaProvider({ initial, children }: QuotaProviderProps): ReactNode {
  const [quota, setQuota] = useState<QuotaSnapshot | null>(initial);

  useEffect(() => {
    return subscribeToQuota(setQuota);
  }, []);

  // Si el servidor lo trae en el primer render, `isKnown` es `true` desde el
  // primer píxel: ni parpadeo de "—" ni muro que aparece de la nada.
  const store: QuotaStore | null = quota === null ? null : { quota, isKnown: true };

  return <QuotaContext.Provider value={store}>{children}</QuotaContext.Provider>;
}

/**
 * El cupo compartido, si esta pantalla está dentro del proveedor.
 *
 * Devuelve `null` fuera de él —en el sitio público no hay proveedor— y ahí
 * `useUsageQuota` se las arregla preguntando por su cuenta, como siempre.
 */
export function useSharedQuota(): QuotaStore | null {
  return useContext(QuotaContext);
}
