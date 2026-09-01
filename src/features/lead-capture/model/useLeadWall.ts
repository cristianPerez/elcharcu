'use client';

import { useEffect, useRef, useState } from 'react';

import { QUESTIONS_BEFORE_LEAD, useUsageQuota } from '@/entities/usage-quota';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

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
   * Lo cierra sin dejar el correo.
   *
   * ⚠️ Cerrarlo NO da más preguntas: `needsAccount` sigue en `true` y el muro
   * vuelve en cuanto intente preguntar otra vez. Lo único que se recupera es la
   * PÁGINA — poder seguir leyendo la receta sin un formulario encima.
   */
  readonly close: () => void;
  /**
   * Abre el muro a propósito, sin que haya una pregunta escrita.
   *
   * Lo necesita quien manda la pregunta por su cuenta en vez de por la caja de
   * escribir: las dudas de una receta se envían solas, así que ahí el freno hay
   * que ponerlo ANTES, al tocar la duda.
   */
  readonly open: () => void;
  /** De dónde salió este muro. Viaja hasta el evento de captura. */
  readonly source: LeadWallSource;
}

export interface LeadWallSource {
  /** Dónde se pidió el correo: `portada`, `receta`… */
  readonly place: string;
  /** La receta abierta, si la hay. Es lo que dice CUÁL convierte. */
  readonly recipeSlug?: string | undefined;
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
export function useLeadWall(source: LeadWallSource): LeadWallController {
  const { quota, isKnown } = useUsageQuota();
  const { isSignedIn, isReady: isSessionReady } = useAccountSession();
  const [isOpen, setIsOpen] = useState(false);

  /*
    El evento se manda UNA vez por apertura, no en cada render.

    Sin este freno, cada re-render con el muro abierto contaría otra vez y el
    denominador de la conversión saldría inflado — que es la peor forma de
    romper una métrica, porque el número sigue pareciendo razonable.
  */
  const yaContado = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      yaContado.current = false;
      return;
    }
    if (yaContado.current) {
      return;
    }
    yaContado.current = true;
    track(ANALYTICS_EVENTS.leadWallShown, {
      place: source.place,
      recipe_slug: source.recipeSlug ?? '',
    });
  }, [isOpen, source.place, source.recipeSlug]);

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

  /*
    ⚠️ EL MURO SE PUEDE CERRAR (2026-09-01, pedido de Cristian).

    Hasta hoy no tenía salida: se abría encima de la receta y ahí se quedaba.
    Quien no quisiera dejar su correo se encontraba con que tampoco podía
    seguir LEYENDO — y en una página a la que se llega desde Google, eso no
    convence a nadie, solo hace que se vaya y no vuelva.

    Lo que se recupera al cerrar es la página, no el cupo: sin cuenta sigue sin
    poder preguntar. El correo se pide, no se cobra.
  */
  const close = (): void => {
    setIsOpen(false);
  };

  return { needsAccount, isOpen, block, open, close, source };
}
