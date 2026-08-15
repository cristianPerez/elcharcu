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
      {/* `shrink-0`: sin él, un título de dos líneas comprime la foto y las
          tarjetas dejan de tener imágenes del mismo tamaño. */}
      <div className="relative h-[150px] shrink-0 md:h-[180px]">
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
      {/* `min-h-0` deja que el cuerpo se encoja dentro de la altura fija de la
          tarjeta; los `line-clamp` recortan el texto sobrante con puntos
          suspensivos en vez de empujar las etiquetas fuera del recorte. */}
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-serif text-xl font-semibold text-cocoa">
          {recipe.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cocoa/70 md:line-clamp-3">
          {recipe.description}
        </p>
        {recipe.tags.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cocoa/10 bg-cream px-2.5 py-0.5 text-[11px] text-cocoa/60"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
