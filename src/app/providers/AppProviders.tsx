'use client';

import { type ReactNode, useEffect } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';
import {
  adoptVisitorId,
  ANALYTICS_EVENTS,
  attachButtonClickTracking,
  identifyAccount,
  initMixpanel,
  watchBrowserErrors,
  track,
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
  /*
    Si viene de abrir el enlace del correo, el servidor dejó dicho en la URL si
    la cuenta acaba de nacer o si es alguien que vuelve. Se cuenta aquí y el
    parámetro se BORRA en el acto.

    ⚠️ Borrarlo no es limpieza estética. Mientras siga en la dirección, cada
    recarga —y cada vez que alguien comparta ese enlace— vuelve a contar una
    cuenta nueva que no lo es. Es el mismo fallo que dejó tres recetas idénticas
    con `?pregunta` en agosto.
  */
  useEffect(() => {
    const url = new URL(window.location.href);
    const entrada = url.searchParams.get('entrada');
    if (entrada !== 'nueva' && entrada !== 'vuelve') {
      return;
    }

    track(
      entrada === 'nueva'
        ? ANALYTICS_EVENTS.accountCreated
        : ANALYTICS_EVENTS.accountSignedIn,
      { landing: url.pathname },
    );

    url.searchParams.delete('entrada');
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);
  }, []);

  // Lo que revienta fuera de React. Se engancha lo primero: un fallo mientras
  // arranca lo demás también tiene que quedar apuntado.
  useEffect(() => watchBrowserErrors(), []);

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
