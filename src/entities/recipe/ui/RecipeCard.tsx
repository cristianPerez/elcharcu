import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { type RecipeSummary } from '../model/types';

interface RecipeCardProps {
  readonly recipe: RecipeSummary;
  readonly className?: string;
}

/** Tarjeta de receta para el grid del listado — foto, título, descripción corta. */
export function RecipeCard({ recipe, className }: RecipeCardProps): ReactNode {
  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-cocoa/10 bg-white',
        className,
      )}
    >
      <div className="relative h-[180px]">
        {recipe.image ? (
          <div
            role="img"
            aria-label={recipe.name}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${recipe.image})` }}
          />
        ) : (
          <div className="bg-grain flex h-full items-center justify-center bg-forest">
            <span className="font-serif text-4xl font-semibold text-cream/90">
              {recipe.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold text-cocoa">{recipe.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">
          {recipe.description}
        </p>
      </div>
    </article>
  );
}
