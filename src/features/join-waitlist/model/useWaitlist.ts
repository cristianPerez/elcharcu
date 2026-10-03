'use client';

import { useState } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { joinWaitlist, leaveWaitlist } from '../api/waitlistApi';

interface UseWaitlistOptions {
  readonly courseId: string;
  readonly courseSlug: string;
  readonly initiallyJoined: boolean;
  /** Si quien mira tiene suscripción. Sin ella, ni se llama a la base. */
  readonly canJoin: boolean;
}

interface UseWaitlist {
  readonly joined: boolean;
  readonly isSaving: boolean;
  readonly error: string | null;
  readonly showUpsell: boolean;
  readonly toggle: () => void;
  readonly closeUpsell: () => void;
}

/**
 * Apuntarse y borrarse, con la respuesta optimista.
 *
 * El estado cambia en el mismo toque y se deshace si la base dice que no:
 * esperar a la red para pintar un ✓ hace que la gente toque dos veces.
 *
 * Al usuario gratis no se le manda a la base a que le diga que no: `canJoin`
 * ya lo sabe el servidor al pintar. Pero si la base contesta
 * `necesita-suscripcion` igual —la suscripción venció mientras tanto— el
 * resultado es el mismo: la invitación al plan, no un error.
 */
export function useWaitlist({
  courseId,
  courseSlug,
  initiallyJoined,
  canJoin,
}: UseWaitlistOptions): UseWaitlist {
  const [joined, setJoined] = useState(initiallyJoined);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  async function run(): Promise<void> {
    const next = !joined;
    setIsSaving(true);
    setError(null);
    setJoined(next);

    const result = next ? await joinWaitlist(courseId) : await leaveWaitlist(courseId);

    setIsSaving(false);
    if (result === 'ok') {
      if (next) {
        track(ANALYTICS_EVENTS.waitlistJoined, { course: courseSlug });
      }
      return;
    }

    setJoined(!next);
    if (result === 'necesita-suscripcion') {
      setShowUpsell(true);
      return;
    }
    setError('No se pudo guardar. Inténtalo otra vez.');
  }

  return {
    joined,
    isSaving,
    error,
    showUpsell,
    toggle: () => {
      if (!joined && !canJoin) {
        setShowUpsell(true);
        return;
      }
      void run();
    },
    closeUpsell: () => {
      setShowUpsell(false);
    },
  };
}
