'use client';

import { useEffect, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { QuotaWallPlans } from './QuotaWallPlans';

interface QuotaWallProps {
  /** Preguntas del mes que el visitante ya gastó. */
  readonly questionsUsed: number;
  /** Su tope del mes, tal como lo cuenta la base. */
  readonly questionsLimit: number;
}

/**
 * El muro que aparece cuando se acaba el cupo gratis de preguntas (9e).
 *
 * Sustituye al viejo muro de "segunda receta": la unidad ahora es la pregunta.
 * El tono es de valor, no de castigo — ya se llevó respuestas de verdad, gratis.
 */
export function QuotaWall({ questionsUsed, questionsLimit }: QuotaWallProps): ReactNode {
  useEffect(() => {
    track(ANALYTICS_EVENTS.quotaWallHit, {
      questions_used: questionsUsed,
      free_questions: questionsLimit,
    });
  }, [questionsUsed, questionsLimit]);

  return (
    <div>
      <p className="text-sm font-medium text-terracota-dark">
        Se acabaron tus preguntas del mes
      </p>

      <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-forest md:text-3xl">
        Salva tu próximo kilo de carne.
      </h2>

      <p className="mt-3 text-base leading-relaxed text-cocoa/70">
        Ya usaste tus {questionsLimit} preguntas gratis de este mes sin poner un peso. Con
        lo que vale una pieza echada a perder, el plan se paga solo — y el cupo vuelve a
        cero el mes que viene, pagues o no.
      </p>

      <QuotaWallPlans />

      <p className="mt-6 text-xs leading-relaxed text-cocoa/45">
        Pagas con tarjeta, PSE o Nequi a través de Hotmart. El precio está en dólares y se
        cobra al cambio del día.
      </p>
    </div>
  );
}
