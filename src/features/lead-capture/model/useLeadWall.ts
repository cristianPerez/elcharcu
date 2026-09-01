'use client';

import { useEffect, useState } from 'react';

import { QUESTIONS_BEFORE_LEAD, useUsageQuota } from '@/entities/usage-quota';

import { useAccountSession } from './useAccountSession';

export interface LeadWallController {
  /** Ya gastó la demostración y no tiene sesión: de aquí no pasa sin correo. */
  readonly needsAccount: boolean;
  /** `true` mientras el muro está pintado. */
  readonly isOpen: boolean;
  /**
   * La puerta, pensada para `onBeforeSend`.
   *
   * Devuelve `true` cuando la pregunta NO debe salir —y de paso abre el muro—.
   * `false` cuando puede pasar.
   */
  readonly block: () => boolean;
  /**
   * Abre el muro a propósito, sin que haya una pregunta escrita.
   *
   * Lo necesita quien manda la pregunta por su cuenta en vez de por la caja de
   * escribir: las dudas de una receta se envían solas, así que ahí el freno hay
   * que ponerlo ANTES, al tocar la duda.
   */
  readonly open: () => void;
}

/**
 * La regla del muro blando, en un solo sitio.
 *
 * Estaba escrita a mano dentro de `assistant-hero`. Con el asistente saliendo
 * también en las recetas, la misma regla la necesitaban dos widgets — y una
 * regla de negocio copiada en dos sitios es una regla que en un mes dice dos
 * cosas distintas. Vive aquí, en la feature que es dueña del muro.
 *
 * Lo que decide es la SESIÓN, no una marca en `localStorage`: quien vuelve por
 * el enlace del correo llega con sesión y el muro se retira solo.
 */
export function useLeadWall(): LeadWallController {
  const { quota, isKnown } = useUsageQuota();
  const { isSignedIn, isReady: isSessionReady } = useAccountSession();
  const [isOpen, setIsOpen] = useState(false);

  const needsAccount =
    isKnown &&
    isSessionReady &&
    !isSignedIn &&
    quota.questionsUsed >= QUESTIONS_BEFORE_LEAD;

  // Si entra con su cuenta desde otra pestaña, el muro se retira solo.
  useEffect(() => {
    if (!needsAccount) {
      setIsOpen(false);
    }
  }, [needsAccount]);

  const block = (): boolean => {
    if (!needsAccount) {
      return false;
    }
    setIsOpen(true);
    return true;
  };

  const open = (): void => {
    setIsOpen(true);
  };

  return { needsAccount, isOpen, block, open };
}
