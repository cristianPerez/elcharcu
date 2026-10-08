import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { RecetasPage } from '@/views/recetas';

import { toCookbookCards, toLockedCards } from '@/widgets/recipe-catalog';

import { readProfile } from '@/entities/curing-profile/server';
import { getRecetario, receivedRecipeSlugs } from '@/entities/recipe/server';
import { hasActiveSubscription } from '@/entities/subscription/server';

import { currentUser } from '@/shared/api/supabase/server';
import { readVisitorIdFromCookies } from '@/shared/api/visitor/server';
import { initialsOf } from '@/shared/lib';
import { canSeeFullCookbook, viewerPlanOf } from '@/shared/lib/access';

const TITLE = 'Recetas · El Charcu';
const DESCRIPTION =
  'Recetario guiado de charcutería artesanal — cada receta con la técnica exacta: sal, humo y tiempo.';
const IMAGE = '/recipes/chorizo-iberico.jpg';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    images: [{ url: IMAGE, width: 430, height: 180, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE],
  },
};

/**
 * La pestaña Recetas decide en el SERVIDOR qué se manda (2026-10-07):
 *   · Pro/Maestro → el recetario entero, con slugs.
 *   · Aprendiz y sin cuenta → la vitrina SIN slugs, más los slugs de "Las que
 *     te llegaron". El catálogo completo nunca sale para quien no paga: ni en
 *     esta página ni por la API de Supabase (RLS de `charcu.recetario`).
 */
export default async function Page(): Promise<ReactNode> {
  const user = await currentUser();
  const [entries, isSubscribed, visitorId, profile] = await Promise.all([
    getRecetario(),
    user === null ? false : hasActiveSubscription(user.id),
    readVisitorIdFromCookies(),
    user === null ? null : readProfile(user.id),
  ]);

  const plan = viewerPlanOf(user !== null, isSubscribed ? 'pro' : null);
  const viewer =
    user === null
      ? ({ kind: 'anon' } as const)
      : ({
          kind: 'user',
          initials: initialsOf(profile?.fullName ?? null, user.email ?? null),
          isPro: isSubscribed,
        } as const);

  if (canSeeFullCookbook(plan)) {
    return <RecetasPage viewer={viewer} isPro recipes={toCookbookCards(entries)} />;
  }

  const receivedSlugs = new Set(await receivedRecipeSlugs(visitorId, user?.id ?? null));
  return (
    <RecetasPage
      viewer={viewer}
      isPro={false}
      received={toCookbookCards(entries.filter((e) => receivedSlugs.has(e.recipe.slug)))}
      locked={toLockedCards(entries.filter((e) => !receivedSlugs.has(e.recipe.slug)))}
      total={entries.length}
    />
  );
}
