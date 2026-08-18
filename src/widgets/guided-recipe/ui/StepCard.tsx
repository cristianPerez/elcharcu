'use client';

import Image from 'next/image';
import { type ReactNode } from 'react';

import { type RecipeStep } from '@/entities/guided-recipe';

import { ANALYTICS_EVENTS, cn, track } from '@/shared/lib';

interface StepCardProps {
  readonly step: RecipeStep;
  readonly index: number;
  readonly isDone: boolean;
  readonly onToggleDone: () => void;
  readonly onAsk: (question: string) => void;
}

/**
 * Un paso del curado: el video (o su portada), qué se hace, y la duda de
 * siempre convertida en botón.
 *
 * Ese botón es toda la idea del experimento. En un curso normal terminas el
 * video y te quedas solo con la pregunta; aquí la pregunta ya está escrita y
 * lleva al maestro sin que tengas que redactarla.
 */
export function StepCard({
  step,
  index,
  isDone,
  onToggleDone,
  onAsk,
}: StepCardProps): ReactNode {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border bg-cream-white shadow-raised transition-opacity',
        isDone ? 'border-forest/30 opacity-70' : 'border-cocoa/10',
      )}
    >
      <div className="relative aspect-[4/3] bg-cream">
        <Image
          src={step.poster}
          alt={step.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Mientras no haya video se dice, no se finge un reproductor que no
            reproduce nada — eso es peor que no tenerlo. */}
        {step.video === null ? (
          <span className="absolute right-3 top-3 rounded-full bg-cocoa/55 px-3 py-1 text-[11px] font-medium text-cream-white backdrop-blur-sm">
            Video en camino
          </span>
        ) : null}
      </div>

      <div className="p-5 md:p-6">
        <p className="text-xs font-medium text-cocoa/65">
          Paso {index + 1} · {step.duration}
        </p>

        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold text-forest">{step.title}</h3>

          {/* Marcar hecho es lo que convierte cuatro bloques iguales en un
              recorrido: un curado dura semanas y vuelves varias veces, así que
              lo primero que necesitas al volver es saber por dónde ibas. */}
          <button
            type="button"
            onClick={onToggleDone}
            aria-pressed={isDone}
            aria-label={isDone ? 'Marcar como pendiente' : 'Marcar como hecho'}
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota',
              isDone
                ? 'border-forest bg-forest text-cream-white'
                : 'border-cocoa/20 text-cocoa/35 hover:border-forest hover:text-forest',
            )}
          >
            <span aria-hidden>✓</span>
          </button>
        </div>

        <p className="mt-2 text-base leading-relaxed text-cocoa/70">{step.summary}</p>

        <button
          type="button"
          onClick={() => {
            track(ANALYTICS_EVENTS.guidedStepAsked, { step: step.id });
            onAsk(step.ask);
          }}
          className="mt-6 flex min-h-[56px] w-full items-center gap-3 rounded-xl border border-terracota/30 bg-cream-white px-4 py-3 text-left shadow-surface transition-colors hover:border-terracota hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota active:scale-[0.99]"
        >
          <span className="flex-1">
            <span className="block text-xs font-medium text-cocoa/65">
              La duda de siempre aquí
            </span>
            <span className="mt-1 block text-[15px] leading-snug text-cocoa">
              {step.ask}
            </span>
          </span>
          <span aria-hidden className="shrink-0 text-lg text-terracota-dark">
            ›
          </span>
        </button>
      </div>
    </article>
  );
}
