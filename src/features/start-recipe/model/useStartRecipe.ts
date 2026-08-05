'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { type CuringProductId } from '@/entities/curing-profile';
import { loadSessions, startSession } from '@/entities/recipe-session';
import { loadSubscription } from '@/entities/subscription';

import { appRoutes } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { evaluateGate } from './gate';

export interface StartRecipeController {
  readonly start: (product: CuringProductId) => void;
}

/** Aplica el candado y lleva al usuario a la sesión o al muro, según toque. */
export function useStartRecipe(): StartRecipeController {
  const router = useRouter();

  const start = useCallback(
    (product: CuringProductId): void => {
      const sessions = loadSessions();
      const verdict = evaluateGate(product, sessions, loadSubscription());

      if (verdict.kind === 'wall') {
        track(ANALYTICS_EVENTS.paywallHit, {
          attempted_recipe: product,
          recipes_started: sessions.length,
        });
        router.push(`${appRoutes.subscription}?receta=${product}`);
        return;
      }

      startSession(product, verdict.reason === 'primera-gratis');
      track(ANALYTICS_EVENTS.recipeStarted, {
        recipe: product,
        reason: verdict.reason,
      });
      router.push(appRoutes.session);
    },
    [router],
  );

  return { start };
}
