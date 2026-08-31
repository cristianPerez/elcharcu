'use client';

import { useState, type ReactNode } from 'react';

import { INTERESTS, MAX_INTERESTS, type InterestId } from '@/shared/config';

import { StepShell } from './StepShell';

interface InterestsStepProps {
  readonly stepIndex: number;
  readonly onSubmit: (interests: readonly InterestId[]) => void;
}

/**
 * LA pregunta del onboarding.
 *
 * Configura el panel y el Charcu AI, así que es la que más rinde de las tres.
 * Es de selección MÚLTIPLE porque quien cura jamones casi siempre hace también
 * chorizos: obligar a elegir uno tiraba media respuesta a la basura.
 *
 * Sustituye además a la vieja "¿qué vas a hacer ahora?", que preguntaba casi lo
 * mismo con otra lista dos pantallas antes.
 *
 * Va PRIMERA a propósito: es la pregunta agradable —se contesta tocando, habla
 * de lo que le gusta y no pide un solo dato personal—. Abrir un formulario
 * obligatorio con "dame tu nombre y tu teléfono" es abrir pidiendo.
 */
export function InterestsStep({ stepIndex, onSubmit }: InterestsStepProps): ReactNode {
  const [chosen, setChosen] = useState<readonly InterestId[]>([]);
  const isFull = chosen.length >= MAX_INTERESTS;

  function toggle(id: InterestId): void {
    setChosen((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      // Elegirlo todo es no elegir nada: con ocho marcados el panel no puede
      // priorizar y el prompt del asistente no se entera de nada.
      return current.length >= MAX_INTERESTS ? current : [...current, id];
    });
  }

  return (
    <StepShell
      stepIndex={stepIndex}
      title="¿Qué quieres aprender?"
      why={`Con esto armo tu panel y le digo al Charcu de qué hablarte. Elige hasta ${String(MAX_INTERESTS)}; puedes cambiarlo cuando quieras desde tu cuenta.`}
      onBack={null}
    >
      <ul className="grid grid-cols-2 gap-2.5">
        {INTERESTS.map((interest) => {
          const isChosen = chosen.includes(interest.id);
          return (
            <li key={interest.id}>
              <button
                type="button"
                aria-pressed={isChosen}
                // Lo que no cabe se apaga en vez de desaparecer: que la opción
                // siga ahí explica por qué no se puede marcar.
                disabled={!isChosen && isFull}
                onClick={() => {
                  toggle(interest.id);
                }}
                className={`flex h-full w-full items-center justify-between gap-2 rounded-2xl border px-4 py-3.5 text-left transition-colors active:scale-[0.99] disabled:opacity-35 ${
                  isChosen
                    ? 'border-terracota bg-terracota/10 text-forest'
                    : 'border-cocoa/12 bg-cream-white text-cocoa/80 hover:border-terracota/50'
                }`}
              >
                <span className="font-serif text-base font-medium leading-snug">
                  {interest.label}
                </span>
                <span
                  aria-hidden
                  className={`grid size-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                    isChosen
                      ? 'border-terracota bg-terracota text-cream-white'
                      : 'border-cocoa/20 text-transparent'
                  }`}
                >
                  ✓
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={chosen.length === 0}
        onClick={() => {
          onSubmit(chosen);
        }}
        className="mt-3 w-full rounded-2xl bg-terracota-dark px-5 py-4 font-medium text-cream-white shadow-surface transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {chosen.length === 0
          ? 'Elige al menos uno'
          : `Seguir con ${String(chosen.length)}`}
      </button>
    </StepShell>
  );
}
