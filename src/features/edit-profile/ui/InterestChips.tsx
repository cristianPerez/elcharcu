'use client';

import { useRef, useState, type ReactNode } from 'react';

import { saveProfile, loadProfile } from '@/entities/curing-profile';

import { INTERESTS, MAX_INTERESTS, type InterestId } from '@/shared/config';
import { ANALYTICS_EVENTS, cn, track } from '@/shared/lib';
import { IconCheck, IconPlus } from '@/shared/ui';

import { patchProfile } from '../api/profileApi';

interface InterestChipsProps {
  readonly initial: readonly InterestId[];
}

/**
 * "Qué quieres aprender": cada chip se activa o se apaga y SE GUARDA al
 * tocarlo, sin botón de guardar. Si no se pudo guardar, vuelve a como estaba
 * y lo dice.
 *
 * Hasta cinco y al menos uno: con todo elegido no se elige nada, y sin ninguno
 * el asistente no sabe de qué hablarte. Los límites se explican en vez de
 * dejar botones muertos sin motivo.
 */
export function InterestChips({ initial }: InterestChipsProps): ReactNode {
  const [chosen, setChosen] = useState<readonly InterestId[]>(initial);
  const [failed, setFailed] = useState(false);
  const isFull = chosen.length >= MAX_INTERESTS;

  /*
    Los guardados van EN FILA. Con dos toques rápidos salían dos PATCH a la
    vez y, si el primero llegaba al servidor después, pisaba al segundo: la
    pantalla decía una cosa y la base otra. Encadenados, el último en salir es
    el último en escribirse. `confirmed` es lo que la base ya tiene, para
    volver ahí si algo falla.
  */
  const queue = useRef<Promise<void>>(Promise.resolve());
  const confirmed = useRef<readonly InterestId[]>(initial);

  function toggle(id: InterestId): void {
    const next = chosen.includes(id)
      ? chosen.filter((item) => item !== id)
      : [...chosen, id];
    setChosen(next);
    setFailed(false);
    queue.current = queue.current.then(() => save(next));
  }

  async function save(next: readonly InterestId[]): Promise<void> {
    const ok = await patchProfile({ interests: next });
    if (!ok) {
      setChosen(confirmed.current);
      setFailed(true);
      return;
    }
    confirmed.current = next;
    // El asistente de la web lee los intereses de aquí sin esperar a la red.
    saveProfile({
      interests: next,
      createdAt: loadProfile()?.createdAt ?? new Date().toISOString(),
    });
    track(ANALYTICS_EVENTS.profileUpdated, {
      how_many: next.length,
      interests: next.join(','),
    });
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label="Qué quieres aprender">
        {INTERESTS.map((interest) => {
          const isChosen = chosen.includes(interest.id);
          const isLast = isChosen && chosen.length === 1;
          const isBlocked = (!isChosen && isFull) || isLast;
          return (
            <li key={interest.id}>
              <button
                type="button"
                aria-pressed={isChosen}
                aria-disabled={isBlocked}
                onClick={() => {
                  if (!isBlocked) {
                    toggle(interest.id);
                  }
                }}
                className={cn(
                  'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors',
                  isChosen
                    ? 'border-forest bg-forest text-cream-white'
                    : 'border-cocoa/15 bg-cream-white text-cocoa hover:border-cocoa/30',
                  isBlocked && !isChosen && 'cursor-not-allowed opacity-50',
                )}
              >
                {isChosen ? (
                  <IconCheck size={14} strokeWidth={2.2} />
                ) : (
                  <IconPlus size={14} strokeWidth={2} />
                )}
                {interest.label}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[13px] text-cocoa-soft" role={failed ? 'alert' : undefined}>
        {failed
          ? 'No se pudo guardar. Inténtalo otra vez.'
          : isFull
            ? `Ya elegiste ${String(MAX_INTERESTS)}: quita uno para cambiarlo.`
            : `Elige hasta ${String(MAX_INTERESTS)}.`}
      </p>
    </div>
  );
}
