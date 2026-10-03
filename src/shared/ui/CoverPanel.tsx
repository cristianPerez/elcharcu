import Image from 'next/image';
import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

export type CoverTone = 'forest' | 'forest-dark' | 'forest-light' | 'tinta' | 'sage';

interface CoverPanelProps {
  readonly title: string;
  readonly imageUrl?: string | null | undefined;
  readonly tone: CoverTone;
  readonly className?: string | undefined;
  /** El tamaño de la inicial cambia con el de la tarjeta. */
  readonly size?: 'xs' | 'sm' | 'sm-md' | 'md' | 'lg' | undefined;
  readonly children?: ReactNode | undefined;
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

/**
 * Cuánto mide la portada en pantalla, para que `next/image` no mande una foto
 * de 600 px a una miniatura de 40.
 */
const SIZES = {
  xs: '40px',
  sm: '96px',
  'sm-md': '(min-width: 768px) 300px, 96px',
  md: '(min-width: 768px) 300px, 262px',
  lg: '144px',
} as const;

/**
 * La inicial se apoya abajo a la izquierda, como en las maquetas; en la
 * miniatura (`xs`) va centrada y más viva, porque a 40 px no se leería.
 */
const LETTER = {
  xs: 'inset-0 grid place-items-center text-xl opacity-100',
  sm: 'bottom-0 left-3 text-4xl',
  'sm-md': 'bottom-0 left-3 text-4xl md:left-4 md:text-6xl',
  md: 'bottom-0 left-4 text-6xl',
  lg: 'bottom-0 left-4 text-7xl',
} as const;

/**
 * La portada de un curso: la foto si hay, y si no un panel de color con la
 * inicial en Fraunces.
 *
 * Con foto, la foto; sin ella, el panel es la portada oficial, no un hueco.
 * Las fotos siguen el estándar del sitio (600 px, calidad 65, ver la skill
 * `create-recipe`).
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
            'absolute font-serif font-semibold leading-none',
            LETTER[size],
            size === 'xs'
              ? tone === 'sage'
                ? 'text-forest'
                : 'text-brasa-light'
              : colors.letter,
          )}
        >
          {title.trim().charAt(0).toUpperCase()}
        </span>
      ) : (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={SIZES[size]}
          className="object-cover [object-position:50%_30%]"
        />
      )}
      {children}
    </div>
  );
}
