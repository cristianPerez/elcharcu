import Image from 'next/image';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

export type CoverTone = 'forest' | 'forest-dark' | 'forest-light' | 'tinta' | 'sage';

interface CoverPanelProps {
  readonly title: string;
  readonly imageUrl?: string | null;
  readonly tone: CoverTone;
  readonly className?: string;
  /** El tamaño de la inicial cambia con el de la tarjeta. */
  readonly size?: 'sm' | 'md' | 'lg';
  readonly children?: ReactNode;
}

const TONES: Record<CoverTone, { readonly bg: string; readonly letter: string }> = {
  forest: { bg: 'bg-forest-light', letter: 'text-cream-white/25' },
  'forest-dark': { bg: 'bg-forest-dark', letter: 'text-cream-white/20' },
  'forest-light': { bg: 'bg-forest', letter: 'text-cream-white/25' },
  tinta: { bg: 'bg-brasa-tinta', letter: 'text-brasa-light/50' },
  sage: { bg: 'bg-sage-light', letter: 'text-forest/30' },
};

const COVER_TONES: readonly CoverTone[] = [
  'forest',
  'forest-dark',
  'tinta',
  'sage',
  'forest-light',
];

/**
 * Un tono estable por clave: el mismo curso sale siempre del mismo color, en
 * todas las pantallas, sin guardar nada en la base.
 */
export function coverToneFor(key: string): CoverTone {
  let hash = 0;
  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return COVER_TONES[hash % COVER_TONES.length] ?? 'forest';
}

const LETTER_SIZE = { sm: 'text-3xl', md: 'text-5xl', lg: 'text-7xl' } as const;

/**
 * La portada de un curso: la foto si hay, y si no un panel de color con la
 * inicial en Fraunces.
 *
 * Hoy NINGÚN curso tiene foto y está bien: el panel es la portada oficial
 * mientras tanto, no un hueco. Cuando llegue `cover_url`, este componente la
 * pinta sin que nadie más se entere.
 */
export function CoverPanel({
  title,
  imageUrl,
  tone,
  className,
  size = 'md',
  children,
}: CoverPanelProps): ReactNode {
  const colors = TONES[tone];

  return (
    <div className={cn('relative overflow-hidden', colors.bg, className)}>
      {imageUrl === null || imageUrl === undefined ? (
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-0 left-4 font-serif font-semibold leading-none',
            LETTER_SIZE[size],
            colors.letter,
          )}
        >
          {title.trim().charAt(0).toUpperCase()}
        </span>
      ) : (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(min-width: 768px) 300px, 50vw"
          className="object-cover [object-position:50%_30%]"
        />
      )}
      {children}
    </div>
  );
}
