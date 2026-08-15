'use client';

import { useEffect, type ReactNode } from 'react';

import { FREE_TIER_LIMITS } from '@/entities/usage-quota';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { QuotaWallPlans } from './QuotaWallPlans';

interface QuotaWallProps {
  /** Preguntas del mes que el visitante ya gastó. */
  readonly questionsUsed: number;
}

/**
 * El muro que aparece cuando se acaba el cupo gratis de preguntas (9e).
 *
 * Sustituye al viejo muro de "segunda receta": la unidad ahora es la pregunta.
 * El tono es de valor, no de castigo — ya se llevó respuestas de verdad, gratis.
 */
export function QuotaWall({ questionsUsed }: QuotaWallProps): ReactNode {
  useEffect(() => {
    track(ANALYTICS_EVENTS.quotaWallHit, {
      questions_used: questionsUsed,
      free_questions: FREE_TIER_LIMITS.questionsPerMonth,
    });
  }, [questionsUsed]);

  return (
    <div className="rounded-2xl border border-cream/15 bg-forest-dark/40 p-6 md:p-8">
      <p className="text-xs uppercase tracking-eyebrow text-sage">
        Se acabaron tus preguntas del mes
      </p>

      <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-cream md:text-3xl">
        Salva tu próximo kilo de carne.
      </h2>

      <p className="mt-4 text-sm leading-relaxed text-cream/75">
        Ya usaste tus {FREE_TIER_LIMITS.questionsPerMonth} preguntas gratis de este mes
        sin poner un peso. Con lo que vale una pieza echada a perder, el plan se paga solo
        — y el cupo vuelve a cero el mes que viene, pagues o no.
      </p>

      <QuotaWallPlans />

      <p className="mt-6 text-xs leading-relaxed text-cream/45">
        Pagas en pesos colombianos con Nequi, PSE o tarjeta. Nada en dólares.
      </p>
    </div>
  );
}
