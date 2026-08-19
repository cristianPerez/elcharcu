import Link from 'next/link';
import { type ReactNode } from 'react';

import { bondiolaCurada } from '@/entities/guided-recipe';

import { appRoutes } from '@/shared/config';
import { IconChevron, Reveal } from '@/shared/ui';

/**
 * Cursos que todavía no existen, dichos por su nombre.
 *
 * Se enseñan a propósito y apagados: que se vea a dónde va esto sin prometer
 * una fecha. Prometer un video para el viernes y no tenerlo cuesta más que no
 * haberlo enseñado.
 */
const COMING: readonly string[] = ['Chorizo santarrosano', 'Lomo curado', 'Pastrami'];

/**
 * Primera pestaña: lo que el usuario vino a aprender.
 *
 * Hoy hay UNA receta guiada y sin videos grabados. La pantalla lo dice en vez
 * de disimularlo con tarjetas de relleno — el usuario acaba de dar su correo y
 * la confianza es lo único que tenemos.
 */
export function AppCursosView(): ReactNode {
  const recipe = bondiolaCurada;

  return (
    <>
      <Reveal>
        <header>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            El Charcu
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-forest">
            Mis cursos
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <Link
          href={appRoutes.guidedRecipe}
          className="mt-6 block rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-raised transition-transform active:scale-[0.98]"
        >
          <p className="text-xs font-medium uppercase tracking-eyebrow text-terracota-dark">
            Empieza aquí
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-forest">
            {recipe.name}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-cocoa/70">{recipe.summary}</p>

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cocoa/65">
            <div className="flex gap-1.5">
              <dt className="text-cocoa/50">Duración</dt>
              <dd className="font-medium text-cocoa">{recipe.totalTime}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-cocoa/50">Nivel</dt>
              <dd className="font-medium text-cocoa">{recipe.difficulty}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-cocoa/50">Pasos</dt>
              <dd className="font-medium text-cocoa">{recipe.steps.length}</dd>
            </div>
          </dl>

          <span className="mt-5 flex items-center gap-1 text-sm font-medium text-terracota-dark">
            Abrir la receta guiada
            <IconChevron size={16} />
          </span>
        </Link>
      </Reveal>

      <Reveal delay={0.12}>
        <section className="mt-8">
          <h2 className="text-sm font-medium text-cocoa/65">En camino</h2>
          <ul className="mt-3 space-y-2">
            {COMING.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-xl border border-cocoa/10 bg-cream-white/60 px-4 py-3.5"
              >
                <span className="text-base text-cocoa/50">{name}</span>
                <span className="text-xs font-medium uppercase tracking-eyebrow text-cocoa/40">
                  Grabando
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-cocoa/60">
            Los videos se están grabando. Mientras tanto, la receta guiada lleva los pasos
            escritos y El Charcu te responde en cualquiera de ellos.
          </p>
        </section>
      </Reveal>
    </>
  );
}
