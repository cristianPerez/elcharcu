'use client';

import { useState, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

interface WaitlistButtonProps {
  readonly courseId: string;
  readonly courseSlug: string;
  readonly initialCount: number;
  readonly goal: number;
  readonly initiallyJoined: boolean;
}

/**
 * La barra de "cuánta gente espera este curso" y el botón de apuntarse.
 *
 * ⚠️ EL CONTADOR NO SE INFLA NUNCA. Sube solo cuando alguien se apunta de
 * verdad. Si se falsea una vez, el mecanismo entero queda muerto: esta
 * plataforma se vende sobre la confianza en una persona real, y una barra
 * mentirosa es exactamente lo que rompe eso. Por eso tampoco hay un número
 * "de arranque" ni un mínimo bonito — si son 3, dice 3.
 *
 * El número sube en el cliente tras apuntarse, sin recargar: la respuesta de
 * la ruta trae el contador nuevo. Ver la barra moverse por lo que uno acaba de
 * hacer es la mitad de por qué esto funciona.
 */
export function WaitlistButton({
  courseId,
  courseSlug,
  initialCount,
  goal,
  initiallyJoined,
}: WaitlistButtonProps): ReactNode {
  const [count, setCount] = useState(initialCount);
  const [joined, setJoined] = useState(initiallyJoined);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const percent = goal === 0 ? 0 : Math.min(100, Math.round((count / goal) * 100));

  async function join(): Promise<void> {
    setIsSaving(true);
    setError(null);

    const response = await fetch('/api/lista-de-espera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    }).catch(() => null);

    if (response === null) {
      setIsSaving(false);
      setError('No hay conexión. Inténtalo otra vez.');
      return;
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = (body ?? {}) as { count?: unknown; message?: unknown };

    if (!response.ok) {
      setIsSaving(false);
      setError(
        typeof parsed.message === 'string'
          ? parsed.message
          : 'No pudimos apuntarte. Inténtalo otra vez.',
      );
      return;
    }

    if (typeof parsed.count === 'number') {
      setCount(parsed.count);
    }
    setJoined(true);
    setIsSaving(false);
    track(ANALYTICS_EVENTS.waitlistJoined, { course: courseSlug });
  }

  return (
    <div className="mt-4 rounded-xl bg-cream px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-cocoa/70">
          {count === 1 ? '1 persona lo espera' : `${String(count)} personas lo esperan`}
        </span>
        <span className="text-cocoa/45">meta: {goal}</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cocoa/10">
        <div
          className="h-full rounded-full bg-terracota transition-[width] duration-500"
          style={{ width: `${String(percent)}%` }}
        />
      </div>

      {joined ? (
        <p className="mt-3 text-sm font-medium text-forest">
          Ya estás dentro. Te aviso cuando se abra.
        </p>
      ) : (
        <button
          type="button"
          disabled={isSaving}
          onClick={(event) => {
            // La tarjeta entera es un enlace al curso: sin esto, apuntarse
            // también navegaría y el usuario nunca vería subir la barra.
            event.preventDefault();
            event.stopPropagation();
            void join();
          }}
          className="mt-3 w-full rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-cream-white transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? 'Apuntándote…' : 'Avísame cuando se abra'}
        </button>
      )}

      {error === null ? null : (
        <p className="mt-2 text-xs text-terracota-dark">{error}</p>
      )}
    </div>
  );
}
