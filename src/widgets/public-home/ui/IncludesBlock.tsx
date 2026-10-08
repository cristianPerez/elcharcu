import { type ReactNode } from 'react';

import { Eyebrow, IconCharcu, IconDoc, IconPlay, type IconProps } from '@/shared/ui';

interface Item {
  readonly title: string;
  /** Texto largo (escritorio) y corto (celular), como en 01 y 02. */
  readonly text: string;
  readonly short: string;
  readonly Icon: (props: IconProps) => ReactNode;
}

const ITEMS: readonly Item[] = [
  {
    title: 'Cursos maestros en video',
    text: 'Una lección por técnica, los errores que arruinan un lote y cómo saber si vas bien.',
    short: 'Técnica, errores y puntos de control',
    Icon: IconPlay,
  },
  {
    title: 'El Charcu a tu lado',
    text: 'Cantidades para tus kilos, revisión con foto, mohos y tiempos, cuando los necesites.',
    short: 'Cantidades, fotos, mohos y tiempos',
    Icon: IconCharcu,
  },
  {
    title: 'Recetario completo',
    text: 'Todas las recetas de El Charcu, con buscador, incluidas en el plan Pro.',
    short: 'Todas las recetas, en el plan Pro',
    Icon: IconDoc,
  },
];

/** El bloque verde "Qué incluye El Charcu" (diseño final 01/02), con su grano. */
export function IncludesBlock(): ReactNode {
  return (
    <section className="mx-auto w-full max-w-app px-5 md:px-8">
      <div className="bg-grain rounded-[20px] bg-forest px-6 py-7 md:rounded-[24px] md:px-10 md:py-10">
        <Eyebrow className="text-sage-light">Qué incluye El Charcu</Eyebrow>
        <h2 className="mt-3 max-w-xl font-serif text-[26px] font-semibold leading-tight text-cream-white md:text-[32px]">
          <span className="md:hidden">Aprende en video, con El Charcu a tu lado.</span>
          <span className="hidden md:inline">
            Aprende el oficio en video, con El Charcu a tu lado.
          </span>
        </h2>
        <ul className="mt-6 flex flex-col gap-5 md:grid md:grid-cols-3 md:gap-4">
          {ITEMS.map(({ title, text, short, Icon }) => (
            <li
              key={title}
              className="flex gap-3 md:flex-col md:rounded-2xl md:border md:border-cream-white/10 md:bg-cream-white/[0.06] md:p-5"
            >
              <Icon size={18} className="mt-0.5 shrink-0 text-brasa-light" />
              <span>
                <span className="block font-semibold text-cream-white md:font-serif md:text-lg">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-cream/80">
                  <span className="md:hidden">{short}</span>
                  <span className="hidden md:inline">{text}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
