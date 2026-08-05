'use client';

import { type ReactNode } from 'react';

import { COUNTRIES, CURING_PRODUCTS, EXPERIENCE_LEVELS } from '@/entities/curing-profile';

import { OptionTile } from '@/shared/ui';

import { useOnboarding } from '../model/useOnboarding';

import { DoneStep } from './DoneStep';
import { StepShell } from './StepShell';

/** Las tres preguntas del arranque. Cada respuesta avanza sola. */
export function OnboardingFlow(): ReactNode {
  const {
    step,
    stepIndex,
    profile,
    selectCountry,
    selectLevel,
    selectProduct,
    goBack,
    canGoBack,
  } = useOnboarding();

  if (step === 'listo' && profile !== null) {
    return <DoneStep profile={profile} />;
  }

  const onBack = canGoBack ? goBack : null;

  if (step === 'nivel') {
    return (
      <StepShell
        stepIndex={stepIndex}
        title="¿Qué tanto has curado?"
        why="Para saber cuánto explicarte. A un curioso le explico el porqué de cada paso; a un avanzado no le hago perder el tiempo."
        onBack={onBack}
      >
        {EXPERIENCE_LEVELS.map((level) => (
          <OptionTile
            key={level.id}
            label={level.name}
            description={level.description}
            onSelect={() => {
              selectLevel(level.id);
            }}
          />
        ))}
      </StepShell>
    );
  }

  if (step === 'producto') {
    return (
      <StepShell
        stepIndex={stepIndex}
        title="¿Qué vas a hacer ahora?"
        why="Esta es la receta que te llevas gratis, completa. Elige la que de verdad vas a preparar."
        onBack={onBack}
      >
        {CURING_PRODUCTS.map((product) => (
          <OptionTile
            key={product.id}
            label={product.name}
            onSelect={() => {
              selectProduct(product.id);
            }}
          />
        ))}
      </StepShell>
    );
  }

  return (
    <StepShell
      stepIndex={stepIndex}
      title="¿Dónde estás curando?"
      why="El clima manda: no se cura igual en Manizales que en Buenos Aires. También define con qué vas a poder pagar si algún día te suscribes."
      onBack={null}
    >
      {COUNTRIES.map((country) => (
        <OptionTile
          key={country.id}
          label={country.name}
          onSelect={() => {
            selectCountry(country.id);
          }}
        />
      ))}
    </StepShell>
  );
}
