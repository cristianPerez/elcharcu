'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type InterestId } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';

export type OnboardingStep = 'intereses' | 'contacto';

export interface OnboardingController {
  readonly step: OnboardingStep;
  readonly stepIndex: number;
  readonly interests: readonly InterestId[];
  readonly isSaving: boolean;
  readonly error: string | null;
  readonly submitInterests: (interests: readonly InterestId[]) => void;
  readonly submitContact: (
    name: string,
    phone: string,
    consent: boolean,
  ) => Promise<void>;
  readonly goBack: () => void;
}

export const TOTAL_STEPS = 2;

const STEP_INDEX: Record<OnboardingStep, number> = { intereses: 1, contacto: 2 };

/**
 * Dos pasos: qué quieres aprender, y quién eres.
 *
 * ⚠️ Este onboarding cambió tres veces en un día (2026-08-29). El estado final
 * y por qué:
 *
 * - **Los intereses van PRIMEROS.** Son lo único que de verdad configura algo
 *   —el panel y el Charcu AI— y además es la pregunta agradable: se contesta
 *   tocando, habla de lo que le gusta y no pide un solo dato personal. Abrir
 *   con "dame tu nombre y tu teléfono" es abrir pidiendo.
 * - **Nombre y WhatsApp van JUNTOS en un formulario.** Eran dos pantallas y
 *   eso son dos teclados que se abren y se cierran en el celular. Los dos son
 *   campos de texto: van en la misma.
 * - **Ya no se guarda paso a paso.** El guardado incremental existía para
 *   aprender de quien abandona, y aquí no se puede abandonar: el formulario es
 *   obligatorio y tapa la app hasta que se completa. Se escribe una vez, al
 *   final, con `complete_onboarding` — que además hace las cinco escrituras
 *   juntas o ninguna.
 * - **Se fueron país, nivel y producto.** Ver `systemPrompt.ts` y la 0016.
 *
 * El WhatsApp se guarda tal cual, SIN validar que exista. Pedido explícito de
 * Cristian: el flujo de verificación por código no entra en el lanzamiento.
 * Consecuencia asumida: habrá números mal escritos en la base.
 */
export function useOnboarding(onDone: () => void): OnboardingController {
  const [step, setStep] = useState<OnboardingStep>('intereses');
  const [interests, setInterests] = useState<readonly InterestId[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    track(ANALYTICS_EVENTS.onboardingStarted, {});
  }, []);

  useEffect(() => {
    track(ANALYTICS_EVENTS.onboardingStepViewed, {
      step,
      step_index: STEP_INDEX[step],
    });
  }, [step]);

  const submitInterests = useCallback((value: readonly InterestId[]): void => {
    setInterests(value);
    setStep('contacto');
    track(ANALYTICS_EVENTS.onboardingAnswered, {
      step: 'intereses',
      answer: value.join(','),
      // Cuántos eligió importa tanto como cuáles: si casi todos marcan uno
      // solo, la selección múltiple no está funcionando y hay que mirarla.
      how_many: value.length,
    });
  }, []);

  const submitContact = useCallback(
    async (name: string, phone: string, consent: boolean): Promise<void> => {
      setIsSaving(true);
      setError(null);

      const response = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, interests, whatsapp: phone, consent }),
      }).catch(() => null);

      if (response === null || !response.ok) {
        setIsSaving(false);
        // No se le deja pasar sin guardar: el flag vive en la base, así que
        // "seguir igual" significaría volver a ver este formulario en la
        // siguiente pantalla y no entender por qué.
        setError('No pudimos guardar tus datos. Revisa la conexión y vuelve a intentar.');
        return;
      }

      track(ANALYTICS_EVENTS.onboardingCompleted, {
        interests: interests.join(','),
        gave_whatsapp: consent && phone.trim() !== '',
        seconds_taken: Math.round((Date.now() - startedAt.current) / 1000),
      });

      onDone();
    },
    [interests, onDone],
  );

  const goBack = useCallback((): void => {
    track(ANALYTICS_EVENTS.onboardingWentBack, { from: 'contacto', to: 'intereses' });
    setStep('intereses');
  }, []);

  return {
    step,
    stepIndex: STEP_INDEX[step],
    interests,
    isSaving,
    error,
    submitInterests,
    submitContact,
    goBack,
  };
}
