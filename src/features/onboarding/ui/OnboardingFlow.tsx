'use client';

import { useRouter } from 'next/navigation';
import { useCallback, type ReactNode } from 'react';

import { useOnboarding } from '../model/useOnboarding';

import { ContactStep } from './ContactStep';
import { InterestsStep } from './InterestsStep';

/**
 * Las dos preguntas del arranque: intereses y contacto.
 *
 * Al terminar hace `router.refresh()` y NO una navegación: el flag que decide
 * si esta pantalla se enseña vive en el servidor, así que hay que volver a
 * pedir el layout para que se entere de que ya está en 'listo'. Con un
 * `push` a otra ruta, el layout seguiría leyendo el flag viejo de su caché y
 * el formulario reaparecería.
 */
export function OnboardingFlow(): ReactNode {
  const router = useRouter();

  const onDone = useCallback((): void => {
    router.refresh();
  }, [router]);

  const { step, stepIndex, isSaving, error, submitInterests, submitContact, goBack } =
    useOnboarding(onDone);

  if (step === 'contacto') {
    return (
      <ContactStep
        stepIndex={stepIndex}
        isSaving={isSaving}
        error={error}
        onSubmit={(name, phone, consent) => {
          void submitContact(name, phone, consent);
        }}
        onBack={goBack}
      />
    );
  }

  return <InterestsStep stepIndex={stepIndex} onSubmit={submitInterests} />;
}
