'use client';

import { useMemo, useState, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { Eyebrow } from '@/shared/ui';

import { matches } from '../lib';
import { type CookbookCard, type LockedCard } from '../model';

import { RecipeTile } from './RecipeTile';
import { SearchField } from './SearchField';
import { UpgradeSheet } from './UpgradeSheet';

interface CookbookLockedProps {
  readonly received: readonly CookbookCard[];
  readonly locked: readonly LockedCard[];
  readonly total: number;
}

/**
 * La pestaña Recetas para Aprendiz y sin cuenta (diseño final 08): "Las que
 * te llegaron" siempre abiertas, el banner de Pro y el recetario con candado.
 * Las tarjetas con candado no traen slug: tocarlas abre "Pasar a Pro" (09).
 */
export function CookbookLocked({
  received,
  locked,
  total,
}: CookbookLockedProps): ReactNode {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<LockedCard | null>(null);
  const filtered = useMemo(
    () => locked.filter((r) => matches(r.name, query)),
    [locked, query],
  );

  const showUpgrade = (recipe: LockedCard, from: string): void => {
    track(ANALYTICS_EVENTS.lockedRecipeTapped, { recipe: recipe.name });
    track(ANALYTICS_EVENTS.upgradeSheetShown, { from });
    setOpen(recipe);
  };

  return (
    <section className="mx-auto max-w-app px-5 pt-6 md:px-8 md:pt-10">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-[30px] font-semibold text-forest">Recetas</h1>
        <p className="text-sm text-cocoa-soft">{total} recetas</p>
      </div>

      {received.length === 0 ? null : (
        <div className="mt-5">
          <h2 className="font-serif text-xl font-semibold text-forest">
            Las que te llegaron
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {received.map((recipe) => (
              <li key={recipe.slug}>
                <RecipeTile
                  name={recipe.name}
                  image={recipe.image}
                  href={`/recetas/${recipe.slug}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-grain mt-6 rounded-[20px] bg-forest p-6">
        <Eyebrow className="text-sage-light">El Charcu Pro</Eyebrow>
        <p className="mt-2 font-serif text-[22px] font-semibold leading-tight text-cream-white">
          Abre todo el recetario, con los cursos en video
        </p>
        <button
          type="button"
          onClick={() => {
            const first = locked[0];
            if (first !== undefined) {
              track(ANALYTICS_EVENTS.upgradeSheetShown, { from: 'banner' });
              setOpen(first);
            }
          }}
          className="mt-4 min-h-12 rounded-full bg-brasa px-6 text-[15px] font-semibold text-cocoa hover:bg-brasa-dark"
        >
          Pasar a Pro
        </button>
      </div>

      <h2 className="mt-8 font-serif text-xl font-semibold text-forest">
        Todo el recetario
      </h2>
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Busca en el recetario…"
        className="mt-3"
      />
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {filtered.map((recipe) => (
          <li key={recipe.name}>
            <RecipeTile
              name={recipe.name}
              image={recipe.image}
              isLocked
              onLockedTap={() => showUpgrade(recipe, 'receta')}
            />
          </li>
        ))}
      </ul>

      <UpgradeSheet recipe={open} onClose={() => setOpen(null)} />
    </section>
  );
}
