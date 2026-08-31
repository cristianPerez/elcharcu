'use client';

import { useEffect, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';

interface QuotaWallProps {
  /** Preguntas del mes que el visitante ya gastó. */
  readonly questionsUsed: number;
  /** Su tope del mes, tal como lo cuenta la base. */
  readonly questionsLimit: number;
}

/**
 * Lo que reemplaza al chat cuando se acaba el cupo del mes.
 *
 * Es corto a propósito: no vende aquí, lleva a la página de upsell. Vender en
 * un bloque incrustado se mide a medias; una URL propia se mide sola, se puede
 * mandar por WhatsApp y sirve de destino para un anuncio.
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
        Usaste tus {questionsLimit} preguntas gratis sin poner un peso. Con lo que vale
        una pieza echada a perder, el plan se paga solo.
      </p>

      <a
        href={`${appRoutes.subscription}?de=muro`}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-terracota-dark px-6 py-3 text-sm font-medium tracking-wide text-cream-white shadow-surface transition-shadow hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 active:scale-[0.97]"
      >
        Ver los planes
      </a>

      <p className="mt-4 text-xs leading-relaxed text-cocoa/65">
        Tu cupo vuelve a cero el mes que viene, pagues o no.
      </p>
    </div>
  );
}
