'use client';

import { useState, type ReactNode } from 'react';

import { PLACEHOLDER_IMAGES } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconPlay } from '@/shared/ui';

/**
 * El tráiler de la portada: cartel con play que, al tocarlo, se vuelve el
 * reproductor de Bunny. El iframe no se carga hasta entonces (no se gasta el
 * plan de datos de nadie por mirar la portada).
 *
 * ⚠️ La URL llega HECHA desde el servidor: el id de la biblioteca de Bunny
 * (`BUNNY_LIBRARY_ID`) no existe en el navegador. Armarla aquí daba una URL
 * vacía en el cliente y una llena en el servidor —un desajuste de hidratación—.
 */
export function TrailerCard({
  embedUrl,
  className,
}: {
  readonly embedUrl: string | null;
  readonly className?: string | undefined;
}): ReactNode {
  const [isPlaying, setIsPlaying] = useState(false);
  const src = embedUrl;

  return (
    <div
      id="trailer"
      className={cn(
        'relative aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-forest-dark',
        className,
      )}
    >
      {isPlaying && src !== null ? (
        <iframe
          src={src.replace('autoplay=false', 'autoplay=true')}
          title="Así se aprende en El Charcu"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          disabled={src === null}
          aria-label="Ver el tráiler: Así se aprende en El Charcu"
          className="group absolute inset-0 text-left"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${PLACEHOLDER_IMAGES.trailerPoster})` }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/10 to-transparent"
          />
          <span className="absolute left-1/2 top-[42%] grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream-white text-cocoa shadow-lg transition-transform group-hover:scale-105">
            <IconPlay size={22} />
          </span>
          <span className="absolute inset-x-5 bottom-5 md:inset-x-6 md:bottom-6">
            <span className="block text-[11px] uppercase tracking-eyebrow text-cream/80">
              Tráiler · 1 min
            </span>
            <span className="mt-1 block font-serif text-xl font-semibold text-cream-white md:text-2xl">
              Así se aprende en El Charcu
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
