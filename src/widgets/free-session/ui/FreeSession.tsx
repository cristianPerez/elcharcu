'use client';

import { useEffect, useState, type ReactNode } from 'react';

import {
  countryName,
  curingProductName,
  experienceLevelName,
  loadProfile,
  type CuringProfile,
} from '@/entities/curing-profile';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { Container, Eyebrow } from '@/shared/ui';

import { SessionEmpty } from './SessionEmpty';

type SessionState =
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'ready'; readonly profile: CuringProfile };

/**
 * La sesión de la receta gratis. Hoy muestra el estado de la receta; el chat con
 * el asistente se conecta en el siguiente paso, cuando exista la clave de Anthropic.
 */
export function FreeSession(): ReactNode {
  const [state, setState] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    const profile = loadProfile();

    if (profile === null) {
      setState({ status: 'empty' });
      return;
    }

    setState({ status: 'ready', profile });
    track(ANALYTICS_EVENTS.freeRecipeStarted, {
      country: profile.country,
      level: profile.level,
      free_recipe: profile.freeRecipe,
    });
  }, []);

  if (state.status === 'loading') {
    return <div className="py-20 text-center text-sm text-cream/40">Abriendo…</div>;
  }

  if (state.status === 'empty') {
    return <SessionEmpty />;
  }

  const { profile } = state;
  const recipe = curingProductName(profile.freeRecipe);

  return (
    <Container className="py-12 md:py-16">
      <Eyebrow className="text-sage">Tu receta gratis</Eyebrow>

      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-cream md:text-4xl">
        {recipe}
      </h1>

      <ul className="mt-5 flex flex-wrap gap-2">
        {[countryName(profile.country), experienceLevelName(profile.level)].map(
          (chip) => (
            <li
              key={chip}
              className="rounded-full border border-cream/20 px-4 py-1.5 text-sm text-cream/75"
            >
              {chip}
            </li>
          ),
        )}
      </ul>

      <div className="mt-10 rounded-2xl border border-terracota/40 bg-terracota/10 p-6">
        <p className="font-serif text-lg text-cream">
          Vista previa: el asistente todavía no está conectado.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-cream/70">
          Esta es la pantalla donde vas a conversar con él mientras curas. Falta el
          siguiente paso de construcción para que responda de verdad — nada de lo que veas
          aquí abajo son respuestas reales.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-cream/15 p-6">
        <p className="text-xs uppercase tracking-eyebrow text-cream/40">
          Así se va a ver
        </p>
        <p className="mt-4 text-sm leading-relaxed text-cream/50">
          «Vamos con tu {recipe.toLowerCase()}. Cuéntame cuántos kilos de carne tienes y a
          qué temperatura y humedad está el lugar donde lo vas a colgar.»
        </p>
        <div className="border-cream/12 mt-6 rounded-full border px-5 py-3 text-sm text-cream/30">
          Escribe tu duda…
        </div>
      </div>
    </Container>
  );
}
