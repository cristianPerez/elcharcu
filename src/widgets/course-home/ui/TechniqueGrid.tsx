import Link from 'next/link';
import { type ReactNode } from 'react';

import { courseSearchHref } from '@/features/course-search';

import { COURSE_TECHNIQUES, type CourseTechnique } from '@/entities/course';

import {
  IconFlame,
  IconHanging,
  IconPot,
  IconTie,
  SectionHeader,
  type IconProps,
} from '@/shared/ui';

const ICONS: Record<CourseTechnique, (props: IconProps) => ReactNode> = {
  'embutir-amarrar': IconTie,
  curado: IconHanging,
  ahumado: IconFlame,
  coccion: IconPot,
};

/** "Explora por técnica": cada tile abre la búsqueda filtrada por esa técnica. */
export function TechniqueGrid(): ReactNode {
  return (
    <section aria-labelledby="techniques-title">
      <SectionHeader id="techniques-title" title="Explora por técnica" />
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {COURSE_TECHNIQUES.map((technique) => {
          const Icon = ICONS[technique.id];
          return (
            <li key={technique.id}>
              <Link
                href={courseSearchHref({ techniques: [technique.id] })}
                className="flex h-full min-h-14 flex-col gap-1.5 rounded-card border border-cocoa/10 bg-cream-white p-4 transition-colors hover:border-cocoa/20 lg:flex-row lg:items-center lg:gap-3"
              >
                <Icon size={22} className="text-forest" />
                <span>
                  <span className="block text-[15px] font-semibold text-cocoa">
                    {technique.label}
                  </span>
                  <span className="block text-[13px] leading-snug text-cocoa-soft lg:hidden">
                    {technique.hint}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
