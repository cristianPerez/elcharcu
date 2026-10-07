import { type ReactNode } from 'react';

import { bunnyEmbedUrl, TRAILER_VIDEO_ID } from '@/shared/config';
import { Eyebrow } from '@/shared/ui';

import { SignupLink } from './SignupLink';
import { TrailerCard } from './TrailerCard';

interface PublicHeroProps {
  /** Los `[N]` del diseño: números reales de la base. */
  readonly masterCount: number;
  readonly capsuleCount: number;
  readonly lessonCount: number;
}

function Stat({
  value,
  label,
  short,
}: {
  readonly value: number;
  readonly label: string;
  /** La etiqueta del celular (diseño 02). */
  readonly short: string;
}): ReactNode {
  return (
    // `dt` antes que `dd` (HTML válido); el número se ve arriba con `flex-col-reverse`.
    <div className="flex flex-col-reverse">
      <dt className="mt-0.5 text-xs text-cocoa-soft">
        <span className="md:hidden">{short}</span>
        <span className="hidden md:inline">{label}</span>
      </dt>
      <dd className="font-serif text-2xl font-semibold text-forest">{value}</dd>
    </div>
  );
}

/**
 * El héroe de la portada sin cuenta (diseño final 01/02): qué es, el botón de
 * empezar, el tráiler y lo que hay grabado. En el celular el tráiler va entre
 * el título y el botón; en escritorio, a la derecha.
 */
export function PublicHero({
  masterCount,
  capsuleCount,
  lessonCount,
}: PublicHeroProps): ReactNode {
  // En el servidor, donde existe el id de la biblioteca de Bunny.
  const trailerUrl = bunnyEmbedUrl(TRAILER_VIDEO_ID);

  return (
    <section className="mx-auto grid max-w-app gap-6 px-5 pt-6 md:grid-cols-2 md:items-center md:gap-12 md:px-8 md:pt-12">
      <div className="flex flex-col">
        <Eyebrow className="text-brasa-tinta">Academia de charcutería artesanal</Eyebrow>
        <h1 className="mt-3 font-serif text-[34px] font-semibold leading-[1.08] text-forest md:text-[52px]">
          Aprende el oficio en video, paso a paso.
        </h1>
        <p className="mt-4 hidden text-[17px] leading-relaxed text-cocoa-soft md:block">
          Cursos maestros de chorizos, jamones y curados, con El Charcu a tu lado para
          cada duda.
        </p>

        <TrailerCard embedUrl={trailerUrl} className="mt-5 md:hidden" />

        <div className="mt-5 flex flex-col gap-3 md:mt-7 md:flex-row">
          <SignupLink className="w-full md:w-auto">
            Crear cuenta gratis y empezar
          </SignupLink>
          <a
            href="#trailer"
            className="hidden min-h-12 items-center justify-center gap-2 rounded-full border border-forest px-6 text-[15px] font-semibold text-forest hover:bg-cream-white md:inline-flex"
          >
            <span aria-hidden="true">▸</span> Ver el tráiler
          </a>
        </div>
        <p className="mt-4 text-center text-sm text-cocoa-soft md:text-left">
          <span className="md:hidden">
            Gratis: las 5 cápsulas, el curso de lomo y 8 preguntas al mes.
          </span>
          <span className="hidden md:inline">
            Gratis con tu cuenta: las 5 cápsulas, el curso de lomo completo y 8 preguntas
            al mes.
          </span>
        </p>

        <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-cocoa/10 pt-5 text-center md:flex md:gap-10 md:text-left">
          <Stat value={masterCount} label="Cursos maestros" short="Cursos" />
          <Stat value={capsuleCount} label="Cápsulas gratis" short="Cápsulas gratis" />
          <Stat value={lessonCount} label="Lecciones en video" short="Lecciones" />
        </dl>
      </div>

      <TrailerCard embedUrl={trailerUrl} className="hidden md:block" />
    </section>
  );
}
