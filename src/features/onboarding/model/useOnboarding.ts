'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  saveProfile,
  type CountryCode,
  type CuringProductId,
  type CuringProfile,
  type ExperienceLevel,
} from '@/entities/curing-profile';
import { startSession } from '@/entities/recipe-session';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { saveAnswers } from '../lib/saveAnswers';

export type OnboardingStep = 'pais' | 'nivel' | 'producto' | 'listo';

export interface OnboardingController {
  readonly step: OnboardingStep;
  readonly stepIndex: number;
  readonly profile: CuringProfile | null;
  readonly selectCountry: (country: CountryCode) => void;
  readonly selectLevel: (level: ExperienceLevel) => void;
  readonly selectProduct: (product: CuringProductId) => void;
  readonly goBack: () => void;
  readonly canGoBack: boolean;
}

const STEP_INDEX: Record<OnboardingStep, number> = {
  pais: 1,
  nivel: 2,
  producto: 3,
  listo: 3,
};

/**
 * Tres preguntas, una por pantalla. Cada respuesta avanza sola —sin botón de
 * "siguiente"— porque el público es móvil y toda fricción de más cuesta gente.
 *
 * Cada respuesta se guarda en el servidor en el momento (`saveAnswers`) y se
 * apunta en Mixpanel. Guardar solo al final significaba no saber nada de quien
 * abandona, que es justo de quien más hay que aprender.
 */
export function useOnboarding(): OnboardingController {
  const [step, setStep] = useState<OnboardingStep>('pais');
  const [country, setCountry] = useState<CountryCode | null>(null);
  const [level, setLevel] = useState<ExperienceLevel | null>(null);
  const [profile, setProfile] = useState<CuringProfile | null>(null);

  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    track(ANALYTICS_EVENTS.onboardingStarted, {});
  }, []);

  // Un evento por pantalla pintada: así se ve en qué pregunta se cae la gente,
  // que es distinto de en cuál deja de contestar.
  useEffect(() => {
    track(ANALYTICS_EVENTS.onboardingStepViewed, {
      step,
      step_index: STEP_INDEX[step],
    });
  }, [step]);

  const selectCountry = useCallback((value: CountryCode): void => {
    setCountry(value);
    setStep('nivel');
    saveAnswers({ country: value });
    track(ANALYTICS_EVENTS.onboardingAnswered, { step: 'pais', answer: value });
  }, []);

  const selectLevel = useCallback((value: ExperienceLevel): void => {
    setLevel(value);
    setStep('producto');
    saveAnswers({ level: value });
    track(ANALYTICS_EVENTS.onboardingAnswered, { step: 'nivel', answer: value });
  }, []);

  const selectProduct = useCallback(
    (value: CuringProductId): void => {
      if (country === null || level === null) {
        return;
      }

      const nextProfile: CuringProfile = {
        country,
        level,
        freeRecipe: value,
        createdAt: new Date().toISOString(),
      };

      saveProfile(nextProfile);
      startSession(value, true);
      setProfile(nextProfile);
      setStep('listo');

      saveAnswers({ country, level, product: value });
      track(ANALYTICS_EVENTS.onboardingAnswered, { step: 'producto', answer: value });
      track(ANALYTICS_EVENTS.onboardingCompleted, {
        country,
        level,
        free_recipe: value,
        // Cuánto tardó de punta a punta: si sube, el onboarding estorba.
        seconds_taken: Math.round((Date.now() - startedAt.current) / 1000),
      });
    },
    [country, level],
  );

  const goBack = useCallback((): void => {
    setStep((current) => {
      const previous = current === 'producto' ? 'nivel' : 'pais';
      track(ANALYTICS_EVENTS.onboardingWentBack, { from: current, to: previous });
      return previous;
    });
  }, []);

  return {
    step,
    stepIndex: STEP_INDEX[step],
    profile,
    selectCountry,
    selectLevel,
    selectProduct,
    goBack,
    canGoBack: step === 'nivel' || step === 'producto',
  };
}
