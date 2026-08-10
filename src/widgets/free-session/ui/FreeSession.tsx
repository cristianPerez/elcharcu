'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';

import {
  countryName,
  curingProductName,
  experienceLevelName,
  loadProfile,
  type CuringProfile,
} from '@/entities/curing-profile';
import {
  loadSessions,
  startSession,
  type RecipeSession,
} from '@/entities/recipe-session';

import { appRoutes } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { ButtonLink, Container, Eyebrow } from '@/shared/ui';

import { SessionEmpty } from './SessionEmpty';

type SessionState =
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | {
      readonly status: 'ready';
      readonly session: RecipeSession;
      readonly profile: CuringProfile | null;
      readonly openCount: number;
    };

/**
 * La receta abierta. Hoy muestra su estado; el chat con el asistente se conecta
 * en el siguiente paso, cuando exista la clave de Anthropic.
 */
export function FreeSession(): ReactNode {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    const profile = loadProfile();
    let sessions = loadSessions();

    // Rescate de quien hizo el onboarding antes de que existieran las sesiones:
    // su receta gratis estaba solo en el perfil.
    if (sessions.length === 0 && profile !== null) {
      startSession(profile.freeRecipe, true);
      sessions = loadSessions();
    }

    const session = sessions[sessions.length - 1];
    if (session === undefined) {
      setState({ status: 'empty' });
      return;
    }

    setState({ status: 'ready', session, profile, openCount: sessions.length });
    track(
      session.isFree
        ? ANALYTICS_EVENTS.freeRecipeStarted
        : ANALYTICS_EVENTS.recipeStarted,
      { recipe: session.product, is_free: session.isFree },
    );
  }, []);

  if (state.status === 'loading') {
    return <div className="py-20 text-center text-sm text-cream/40">Abriendo…</div>;
  }

  if (state.status === 'empty') {
    return <SessionEmpty />;
  }

  const { session, profile, openCount } = state;
  const recipe = curingProductName(session.product);
  const chips =
    profile === null
      ? []
      : [countryName(profile.country), experienceLevelName(profile.level)];

  return (
    <Container className="py-12 md:py-16">
      <Eyebrow className="text-sage">
        {session.isFree ? 'Tu receta gratis' : 'Tu receta'}
      </Eyebrow>

      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-cream md:text-4xl">
        {recipe}
      </h1>

      {chips.length === 0 ? null : (
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-cream/20 px-4 py-1.5 text-sm text-cream/75"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <AssistantChat
          product={recipe}
          level={profile?.level ?? 'apasionado'}
          country={profile === null ? 'Colombia' : countryName(profile.country)}
        />
      </div>

      <div className="mt-10 border-t border-cream/15 pt-8">
        <ButtonLink href={appRoutes.newRecipe} variant="outline" className="text-cream">
          Empezar otra receta
        </ButtonLink>
        <p className="mt-3 text-xs leading-relaxed text-cream/40">
          {openCount === 1
            ? 'Tienes 1 receta abierta. La segunda receta distinta pide suscripción.'
            : `Tienes ${String(openCount)} recetas abiertas.`}
        </p>
      </div>
    </Container>
  );
}
