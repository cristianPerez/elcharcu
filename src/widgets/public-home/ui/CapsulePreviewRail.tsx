import { type ReactNode } from 'react';

import { CapsuleCard, type Course } from '@/entities/course';

interface CapsulePreviewRailProps {
  readonly capsules: readonly Course[];
}

/**
 * "Empieza por aquí" para quien no tiene cuenta (diseño final 01/02): la
 * primera cápsula invita a empezar y el resto se enseña en su pastel, sin
 * candados — todavía no hay ruta que seguir. Tocar cualquiera pide la cuenta.
 */
export function CapsulePreviewRail({ capsules }: CapsulePreviewRailProps): ReactNode {
  if (capsules.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="empieza-title"
      className="mx-auto w-full max-w-app px-5 md:px-8"
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
        <h2 id="empieza-title" className="font-serif text-2xl font-semibold text-forest">
          Empieza por aquí
        </h2>
        <p className="text-sm text-cocoa-soft">
          {capsules.length} cápsulas cortas, gratis con tu cuenta
        </p>
      </div>
      <ul className="-mx-5 mt-4 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {capsules.map((capsule, index) => (
          <li key={capsule.id} className="w-[168px] shrink-0 snap-start md:w-auto">
            <CapsuleCard
              slug={capsule.slug}
              title={capsule.title}
              position={index + 1}
              state={index === 0 ? 'actual' : 'vista'}
              icon={capsule.icon}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
