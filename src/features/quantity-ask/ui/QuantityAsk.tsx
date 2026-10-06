'use client';

import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { IconCharcu, IconMinus, IconPlus } from '@/shared/ui';

import {
  askPreview,
  clampGrams,
  DEFAULT_GRAMS,
  fillGrams,
  formatGrams,
  GRAMS_STEP,
  MAX_GRAMS,
  MIN_GRAMS,
} from '../lib/quantityQuestion';

interface QuantityAskProps {
  /** La pregunta sugerida, con su hueco `{gramos}`. */
  readonly ask: string;
}

const STEP_BUTTON =
  'grid size-10 shrink-0 place-items-center rounded-full bg-cream-white text-forest shadow-sm transition-colors hover:bg-capsule-done disabled:opacity-35 disabled:shadow-none';

/**
 * Una pregunta rápida con la cantidad de carne puesta por quien pregunta
 * (Cristian, 2026-10-06).
 *
 * La pregunta de siempre en las recetas es "tengo tantos gramos, ¿cuánto le
 * pongo de cada cosa?", y escribir el número a mano en el celular, con las
 * manos en la carne, es justo lo que nadie hace. Aquí se elige con − y +
 * (o tecleándolo) y la pregunta sale completa.
 *
 * Mientras se teclea se guarda el TEXTO tal cual, para no pelearle a quien
 * escribe; al salir del campo se ajusta al rango. Lo que viaja al asistente
 * siempre pasa por `clampGrams`.
 *
 * Envía igual que la pregunta fija: `/charcu?pregunta=`, que se manda sola al
 * llegar y gasta una pregunta del cupo.
 */
export function QuantityAsk({ ask }: QuantityAskProps): ReactNode {
  const inputId = useId();
  const [grams, setGrams] = useState(DEFAULT_GRAMS);
  const [typed, setTyped] = useState(String(DEFAULT_GRAMS));
  // Editando se ven los dígitos solos; fuera del campo, "1.250" como en el texto.
  const [isEditing, setIsEditing] = useState(false);

  const update = (value: number): void => {
    const next = clampGrams(value);
    setGrams(next);
    setTyped(String(next));
  };

  const onType = (raw: string): void => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    setTyped(digits);
    if (digits !== '') {
      setGrams(clampGrams(Number(digits)));
    }
  };

  const [before, ...after] = askPreview(ask);
  const href = `${appRoutes.appAssistant}?pregunta=${encodeURIComponent(fillGrams(ask, grams))}`;

  return (
    <section
      aria-label="Pregúntale a El Charcu"
      className="mt-5 rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-surface"
    >
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-eyebrow text-terracota-dark">
        <IconCharcu size={14} />
        Pregúntale a El Charcu
      </span>

      <p className="mt-2 text-base leading-relaxed text-cocoa">
        {before}
        {after.map((part, index) => (
          <span key={index}>
            <strong className="font-semibold text-forest">{formatGrams(grams)}</strong>
            {part}
          </span>
        ))}
      </p>

      <label htmlFor={inputId} className="mt-4 block text-sm font-medium text-cocoa/70">
        ¿Cuánta carne tienes?
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-full bg-cream p-1.5">
        <button
          type="button"
          aria-label={`Quitar ${String(GRAMS_STEP)} gramos`}
          onClick={() => update(grams - GRAMS_STEP)}
          disabled={grams <= MIN_GRAMS}
          className={STEP_BUTTON}
        >
          <IconMinus size={18} strokeWidth={2.25} />
        </button>

        <div className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-2 focus-within:bg-cream-white">
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={isEditing ? typed : formatGrams(grams)}
            onFocus={(event) => {
              setIsEditing(true);
              // Se selecciona DESPUÉS de que el valor pase de "1.000" a "1000":
              // seleccionando antes, ese cambio deshace la selección y lo que
              // se escribe queda en medio del número viejo.
              const input = event.currentTarget;
              requestAnimationFrame(() => input.select());
            }}
            onChange={(event) => onType(event.target.value)}
            onBlur={() => {
              setIsEditing(false);
              update(typed === '' ? MIN_GRAMS : Number(typed));
            }}
            aria-describedby={`${inputId}-rango`}
            className="w-[6.5ch] bg-transparent text-right text-lg font-semibold tabular-nums text-forest outline-none"
          />
          <span className="text-base text-cocoa/60">g</span>
        </div>

        <button
          type="button"
          aria-label={`Sumar ${String(GRAMS_STEP)} gramos`}
          onClick={() => update(grams + GRAMS_STEP)}
          disabled={grams >= MAX_GRAMS}
          className={STEP_BUTTON}
        >
          <IconPlus size={18} strokeWidth={2.25} />
        </button>
      </div>
      <p id={`${inputId}-rango`} className="sr-only">
        Entre {formatGrams(MIN_GRAMS)} y {formatGrams(MAX_GRAMS)} gramos.
      </p>

      <Link
        href={href}
        className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-capsule-current px-6 text-[15px] font-semibold text-brasa-tinta transition-colors hover:bg-brasa-light/50"
      >
        Preguntarle a El Charcu
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
