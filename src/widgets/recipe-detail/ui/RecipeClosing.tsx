'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';

import { useAccountSession } from '@/features/lead-capture';

import { appRoutes } from '@/shared/config';

interface RecipeClosingProps {
  readonly recipeName: string;
  /**
   * El curso en video de ESTA receta, solo si ya está grabado y publicado.
   * `null` en las 44 que todavía no lo tienen.
   */
  readonly courseSlug: string | null;
}

/**
 * El cierre de la receta: aquí se ofrece algo, no se ayuda.
 *
 * ⚠️ VA SEPARADO DE LAS DUDAS A PROPÓSITO. Las cuatro cajas de terracota
 * repartidas por la página son AYUDA —abren El Charcu con una pregunta— y
 * funcionan porque no piden nada. Esto es una OFERTA. Mezclar las dos cosas en
 * el mismo formato convertiría la ayuda en publicidad, y entonces se saltan
 * las dos.
 *
 * ⚠️ NO OFRECE EL PLAN DE PAGO (Cristian, 2026-09-01). Le pediría dinero a
 * alguien que ni siquiera ha dejado un correo —justo el paso que D16 pone
 * primero— y, mientras OnePay no esté conectado, cada interesado se convierte
 * en una conversación de WhatsApp que hay que atender a mano. Lo que se ofrece
 * es la cuenta, que es gratis, inmediata y no le genera trabajo a nadie.
 *
 * ⚠️ Y SOLO ENLAZA CURSOS GRABADOS. De las cuatro recetas que tienen curso con
 * el mismo slug, tres están en lista de espera y esa lista es solo para
 * suscritos: anunciarlas aquí sería enseñarle a un visitante sin cuenta una
 * puerta que no puede abrir. Se ofrece lo que hoy se puede dar.
 */
export function RecipeClosing({ recipeName, courseSlug }: RecipeClosingProps): ReactNode {
  const { isSignedIn, isReady } = useAccountSession();

  // Hasta saber si tiene sesión no se decide nada: pintar "crea tu cuenta" a
  // quien ya entró, aunque sea medio segundo, es la clase de parpadeo que hace
  // dudar de si la página sabe quién eres.
  if (!isReady) {
    return null;
  }

  const hasCourse = courseSlug !== null;

  const { eyebrow, title, body, cta, href } = hasCourse
    ? isSignedIn
      ? {
          eyebrow: 'Y si quieres verlo hacer',
          title: `${recipeName}, en video`,
          body: 'El curso completo, paso a paso, con las manos de El Charcu dentro del plano.',
          cta: 'Ver el curso',
          href: `${appRoutes.appCourses}/${String(courseSlug)}`,
        }
      : {
          eyebrow: 'Y si quieres verlo hacer',
          title: `Esta receta tiene su curso en video`,
          body: 'Entra con tu correo y lo abres. Sin contraseña: te mandamos un enlace.',
          cta: 'Entrar y verlo',
          href: appRoutes.login,
        }
    : isSignedIn
      ? {
          eyebrow: 'Sigue por aquí',
          title: 'Las cápsulas de El Charcu',
          body: 'Tutoriales cortos de la técnica que hay detrás: la sal de cura, embutir, amarrar, bridar.',
          cta: 'Ver las cápsulas',
          href: appRoutes.appCourses,
        }
      : {
          eyebrow: 'Antes de irte',
          title: 'Crea tu cuenta, gratis',
          body: 'Ocho preguntas al mes a El Charcu y las cápsulas de técnica. Sin contraseña y sin tarjeta.',
          cta: 'Crear mi cuenta',
          href: appRoutes.login,
        };

  return (
    <div className="rounded-2xl bg-forest-dark px-6 py-8 text-cream md:px-10 md:py-10">
      <p className="text-[11px] uppercase tracking-eyebrow text-sage">{eyebrow}</p>
      <h2 className="mt-3 max-w-[24ch] font-serif text-2xl font-semibold md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-cream/75 md:text-base">
        {body}
      </p>
      <Link
        href={href}
        className="mt-6 inline-block rounded-full bg-terracota-dark px-6 py-3 text-[15px] font-medium text-cream-white shadow-surface transition-shadow hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2"
      >
        {cta}
      </Link>
    </div>
  );
}
