import { type ReactNode } from 'react';

import { Chip, ChipRow } from '@/shared/ui';

import { filterGroups } from '../model/filterOptions';
import { courseSearchHref, type CourseQuery } from '../model/searchParams';

interface FilterChipsProps {
  readonly query: CourseQuery;
  readonly className?: string | undefined;
}

/**
 * Los filtros del celular: una fila de chips que se desliza.
 *
 * Los activos van PRIMERO y con su ✕: lo que ya filtra es lo que más se mira,
 * y no puede quedar escondido al final de la fila. Cada chip es un enlace, así
 * que el filtro funciona aunque el JavaScript no haya cargado.
 */
export function FilterChips({ query, className }: FilterChipsProps): ReactNode {
  const options = filterGroups(query).flatMap((group) => group.options);
  const ordered = [
    ...options.filter((o) => o.active),
    ...options.filter((o) => !o.active),
  ];

  return (
    <ChipRow label="Filtros" className={className}>
      {ordered.map((option) => (
        <li key={`${option.group}-${option.id}`}>
          <Chip href={courseSearchHref(option.next)} active={option.active} removable>
            {option.label}
            {option.active ? <span className="sr-only"> (quitar filtro)</span> : null}
          </Chip>
        </li>
      ))}
    </ChipRow>
  );
}
