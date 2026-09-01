'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';

import { loadProfile, type CuringProfile } from '@/entities/curing-profile';
import { useUsageQuota } from '@/entities/usage-quota';

import { INTERESTS } from '@/shared/config';
import { Container } from '@/shared/ui';

import { SessionEmpty } from './SessionEmpty';

type SessionState =
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'ready'; readonly profile: CuringProfile };

/**
 * La receta que el visitante abrió desde el onboarding.
 *
 * ⚠️ Pantalla de transición. Nació con el modelo viejo —recetas en
 * `localStorage`, "una receta gratis" contada en el navegador— y ese modelo lo
 * jubiló D19: ahora las recetas viven en `charcu.recipes` y el cupo lo cuenta
 * Postgres. Aquí ya NO se leen sesiones del navegador, porque decían cosas que
 * la base contradice ("tienes 2 recetas abiertas" cuando el plan gratis da 1).
 *
 * Se queda hasta que exista la pantalla de "Mis recetas" de verdad, que es la
 * que la sustituye.
 */
export function FreeSession(): ReactNode {
  const [state, setState] = useState<SessionState>({ status: 'loading' });
  const { quota, status, isKnown } = useUsageQuota();

  useEffect(() => {
    const profile = loadProfile();
    setState(profile === null ? { status: 'empty' } : { status: 'ready', profile });
  }, []);

  if (state.status === 'loading') {
    return (
      <div className="py-16 text-center text-sm text-cocoa/65 md:py-24">Abriendo…</div>
    );
  }

  if (state.status === 'empty') {
    return <SessionEmpty />;
  }

  const { profile } = state;
  const chips = profile.interests.map(
    (id) => INTERESTS.find((interest) => interest.id === id)?.label ?? id,
  );
  // El primer interés es el tema por defecto del chat nuevo. Es un punto de
  // partida, no una jaula: en cuanto el usuario pregunta otra cosa, la
  // conversación manda (D19, un chat = una receta).
  const recipe = chips[0] ?? 'consulta general';

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-[32px] font-semibold leading-[1.1] text-forest md:text-4xl">
          {recipe}
        </h1>

        <ul className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-cocoa/15 px-3 py-1 text-sm text-cocoa/65"
            >
              {chip}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-raised md:p-6">
          {/* ⚠️ Aquí iba `product={recipe}`, y `recipe` es `chips[0]`: texto
              sacado del perfil de curado que acababa DENTRO del prompt del
              sistema (2026-09-01). Se va con el resto de `product`. Lo que el
              asistente reconoce ahora es el slug de una de las 45 recetas del
              repo, y un chip del onboarding no lo es. La pantalla sigue
              mostrando el chip arriba, así que la persona no pierde nada. */}
          <AssistantChat canSendImages={!status.areImagesExhausted} />

          {isKnown && quota.questionsUsed > 0 ? (
            <p className="mt-3 text-xs text-cocoa/65">
              Te quedan {status.questionsLeft} preguntas y {status.imagesLeft} fotos este
              mes.
            </p>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
