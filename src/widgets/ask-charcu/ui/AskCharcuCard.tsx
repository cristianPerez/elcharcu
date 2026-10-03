import Link from 'next/link';
import { type ReactNode } from 'react';

import { appRoutes, assistantDraftHref } from '@/shared/config';
import { cn } from '@/shared/lib';
import { IconArrowRight, IconCharcu, IconChevron } from '@/shared/ui';

interface AskCharcuCardProps {
  /**
   * `quiet` al pie de Mis cursos en el celular; `panel` junto a "Sigue donde
   * ibas" en escritorio; `brand` (verde) al final de una búsqueda.
   */
  readonly variant: 'quiet' | 'panel' | 'brand';
  /** Lo que se buscó. Se lleva escrito al asistente, sin enviarlo. */
  readonly query?: string | undefined;
  readonly className?: string | undefined;
}

/**
 * La salida al asistente desde los cursos: "¿No encuentras lo que buscas?".
 *
 * Con búsqueda, la consulta viaja como BORRADOR (`?borrador=`), no como
 * pregunta enviada: tocar la tarjeta no puede gastar una pregunta del mes.
 */
export function AskCharcuCard({
  variant,
  query = '',
  className,
}: AskCharcuCardProps): ReactNode {
  const term = query.trim();
  const href =
    term === ''
      ? appRoutes.appAssistant
      : assistantDraftHref(`Tengo una duda sobre ${term}: `);

  if (variant === 'brand') {
    return (
      <section
        aria-label="Pregúntale a El Charcu"
        className={cn(
          'bg-grain flex flex-col justify-between gap-5 rounded-card bg-forest p-5 md:p-6',
          className,
        )}
      >
        <p className="font-serif text-xl font-semibold leading-snug text-cream-white">
          {term === '' ? (
            '¿Tienes una duda puntual?'
          ) : (
            <>
              ¿Tienes una duda puntual sobre tu{' '}
              <span className="text-brasa-light">{term}</span>?
            </>
          )}
        </p>
        <Link
          href={href}
          className="inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-brasa px-6 text-[15px] font-semibold text-cocoa transition-colors hover:bg-brasa-dark"
        >
          <IconCharcu size={16} />
          Pregúntale a El Charcu
        </Link>
      </section>
    );
  }

  if (variant === 'panel') {
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col rounded-card border border-cocoa/10 bg-cream-white p-6 transition-colors hover:border-cocoa/20',
          className,
        )}
      >
        <IconCharcu size={22} className="text-brasa-dark" />
        <span className="mt-auto pt-6 font-serif text-xl font-semibold text-forest">
          Pregúntale a El Charcu
        </span>
        <span className="mt-1 text-sm text-cocoa-soft">
          Dosis de sal, humedad, mohos.
        </span>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brasa-tinta">
          Hacer una pregunta
          <IconArrowRight size={15} strokeWidth={2} />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex min-h-16 items-center gap-3 rounded-card border border-dashed border-cocoa/25 p-4 transition-colors hover:bg-cream-white',
        className,
      )}
    >
      <IconCharcu size={20} className="shrink-0 text-brasa-dark" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-cocoa">
          ¿No encuentras lo que buscas?
        </span>
        <span className="block text-sm text-cocoa-soft">Pregúntale a El Charcu</span>
      </span>
      <IconChevron size={18} className="shrink-0 text-cocoa-muted" />
    </Link>
  );
}
