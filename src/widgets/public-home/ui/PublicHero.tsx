import { type ReactNode } from 'react';

import { bunnyEmbedUrl, HOME_VIDEO_ID } from '@/shared/config';
import { Eyebrow } from '@/shared/ui';

import { HomeVideo } from './HomeVideo';
import { SignupLink } from './SignupLink';

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
 * empezar, el video y lo que hay grabado. Un solo video vertical: en el
 * celular va entre el título y el botón; en escritorio, a la derecha.
 */
export function PublicHero({
  masterCount,
  capsuleCount,
  lessonCount,
}: PublicHeroProps): ReactNode {
  // En el servidor, donde existe el id de la biblioteca de Bunny.
  const videoUrl = bunnyEmbedUrl(HOME_VIDEO_ID, { autoplay: true });

  return (
    <section className="mx-auto grid w-full max-w-app gap-x-16 px-5 pt-6 md:grid-cols-[1fr_auto] md:items-center md:px-8 md:pt-12">
      <div className="md:col-start-1 md:self-end">
        <Eyebrow className="text-brasa-tinta">
          <span className="md:hidden">Charcutería artesanal</span>
          <span className="hidden md:inline">Academia de charcutería artesanal</span>
        </Eyebrow>
        <h1 className="mt-2 font-serif text-[26px] font-semibold leading-[1.12] text-forest md:mt-3 md:text-[52px] md:leading-[1.08]">
          Aprende el oficio en video, paso a paso.
        </h1>
        <p className="mt-4 hidden text-[17px] leading-relaxed text-cocoa-soft md:block">
          Cursos maestros de chorizos, jamones y curados, con El Charcu a tu lado para
          cada duda.
        </p>
      </div>

      <HomeVideo
        embedUrl={videoUrl}
        className="-mx-2 mt-4 md:col-start-2 md:row-span-2 md:row-start-1 md:mx-0 md:mt-0 md:w-[300px] lg:w-[340px]"
      />

      <div className="md:col-start-1 md:self-start">
        <div className="mt-5 md:mt-7">
          <SignupLink className="w-full md:w-auto">
            Crear cuenta gratis y empezar
          </SignupLink>
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
    </section>
  );
}
