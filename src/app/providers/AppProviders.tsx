'use client';

import { type ReactNode, useEffect } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';
import {
  adoptVisitorId,
  attachButtonClickTracking,
  identifyAccount,
  initMixpanel,
} from '@/shared/lib';

interface AppProvidersProps {
  readonly children: ReactNode;
  /**
   * El identificador del visitante, leído de la cookie por el servidor.
   *
   * Viene por props y no por una llamada al arrancar: así la primera medición
   * ya sale con el identificador correcto, en vez de perderse mientras llega
   * la respuesta.
   */
  readonly visitorId: string;
}

/**
 * Punto único para componer todos los providers globales de la app
 * (analítica, theme, query-client, i18n, store, etc.). Mantener este árbol plano.
 */
export function AppProviders({ children, visitorId }: AppProvidersProps): ReactNode {
  useEffect(() => {
    initMixpanel();
    // El orden importa: primero arranca Mixpanel, luego se le dice quién es.
    adoptVisitorId(visitorId);

    // Y si ya tiene cuenta, se enlaza lo que hizo de anónimo con su perfil.
    // Sin esto, el que probó el asistente y el que se registró parecen dos
    // personas distintas y se pierde el dato de conversión que más importa.
    if (isSupabaseConfigured()) {
      void createSupabaseBrowserClient()
        .auth.getUser()
        .then(({ data }) => {
          if (data.user !== null) {
            identifyAccount(data.user.id, data.user.email);
          }
        })
        .catch(() => {
          // Sin sesión no hay nada que enlazar.
        });
    }

    return attachButtonClickTracking();
  }, [visitorId]);

  return children;
}
