'use client';

import { useCallback, useState } from 'react';

import {
  saveProfile,
  type CountryCode,
  type CuringProductId,
  type CuringProfile,
  type ExperienceLevel,
} from '@/entities/curing-profile';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

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
 */
export function useOnboarding(): OnboardingController {
  const [step, setStep] = useState<OnboardingStep>('pais');
  const [country, setCountry] = useState<CountryCode | null>(null);
  const [level, setLevel] = useState<ExperienceLevel | null>(null);
  const [profile, setProfile] = useState<CuringProfile | null>(null);

  const selectCountry = useCallback((value: CountryCode): void => {
    setCountry(value);
    setStep('nivel');
  }, []);

  const selectLevel = useCallback((value: ExperienceLevel): void => {
    setLevel(value);
    setStep('producto');
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
      setProfile(nextProfile);
      setStep('listo');

      track(ANALYTICS_EVENTS.onboardingCompleted, {
        country,
        level,
        free_recipe: value,
      });
    },
    [country, level],
  );

  const goBack = useCallback((): void => {
    setStep((current) => (current === 'producto' ? 'nivel' : 'pais'));
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
