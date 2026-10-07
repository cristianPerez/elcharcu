'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { useAccountSession } from '@/features/lead-capture';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { Eyebrow, IconCheck } from '@/shared/ui';

const ROWS = [
  { label: 'Ingredientes y pasos', recipe: true },
  { label: 'Video por técnica', recipe: false },
  { label: 'Errores y cómo salvar el lote', recipe: false },
  { label: 'Tu lote acompañado', recipe: false },
] as const;

interface RecipeCourseWidgetProps {
  readonly recipeSlug: string;
  readonly recipeName: string;
  /** La foto de la receta: la cabecera, si el curso no tiene portada o no existe. */
  readonly recipeImage: string;
  /** El curso publicado de esta receta, o `null` si todavía no existe. */
  readonly course: {
    readonly slug: string;
    readonly title: string;
    readonly coverUrl: string | null;
  } | null;
}

function Mark({ on }: { readonly on: boolean }): ReactNode {
  return on ? (
    <IconCheck size={16} className="mx-auto text-forest" aria-label="Sí" />
  ) : (
    <span aria-label="No" className="block text-center text-cocoa-muted">
      —
    </span>
  );
}

/**
 * "Esta receta te dice qué hacer. El curso te enseña a hacerlo bien."
 * (diseño final 07). Con curso: la tabla Receta vs Curso y "Ver el curso".
 * Sin curso: "Avísame cuando salga" — con cuenta deja el pedido; sin cuenta,
 * abre la hoja de crear cuenta.
 */
export function RecipeCourseWidget({
  recipeSlug,
  recipeName,
  recipeImage,
  course,
}: RecipeCourseWidgetProps): ReactNode {
  const headerImage = course?.coverUrl ?? recipeImage;
  const [notified, setNotified] = useState(false);
  // La receta es estática: la sesión se sabe en el navegador. Sin cuenta,
  // "Avísame" lleva `data-signup-*` y el interceptor del marco abre la hoja.
  const { isSignedIn } = useAccountSession();

  const notify = async (): Promise<void> => {
    track(ANALYTICS_EVENTS.recipeCourseCtaClicked, {
      recipe_slug: recipeSlug,
      accion: 'avisame',
    });
    if (!isSignedIn) {
      return;
    }
    const response = await fetch('/api/pedidos-de-cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: `Avísame cuando salga el curso de ${recipeName}`.slice(0, 280),
      }),
    }).catch(() => null);
    setNotified(response?.ok === true);
  };

  return (
    <section className="mx-auto max-w-xl overflow-hidden rounded-[20px] border border-cocoa/10 bg-cream-white shadow-surface">
      <div className="relative h-28 bg-forest">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${headerImage})` }}
        />
        <Eyebrow className="absolute bottom-3 left-5 text-cream-white">
          {course === null ? 'Próximamente' : 'Curso maestro'}
        </Eyebrow>
      </div>
      <div className="p-5">
        <h2 className="font-serif text-[22px] font-semibold leading-tight text-forest">
          Esta receta te dice qué hacer. El curso te enseña a hacerlo bien.
        </h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-cocoa-soft">
              <th scope="col" className="py-2 text-left font-normal">
                <span className="sr-only">Qué trae</span>
              </th>
              <th scope="col" className="w-16 py-2 font-normal">
                Receta
              </th>
              <th
                scope="col"
                className="w-16 rounded-t-lg bg-capsule-done py-2 font-semibold text-forest"
              >
                Curso
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-cocoa/10">
                <th scope="row" className="py-2.5 text-left font-normal text-cocoa">
                  {row.label}
                </th>
                <td>
                  <Mark on={row.recipe} />
                </td>
                <td className="bg-capsule-done">
                  <Mark on />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {course !== null ? (
          <Link
            href={`/cursos/${course.slug}`}
            onClick={() =>
              track(ANALYTICS_EVENTS.recipeCourseCtaClicked, {
                recipe_slug: recipeSlug,
                accion: 'ver_curso',
              })
            }
            className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-brasa text-[15px] font-semibold text-cocoa hover:bg-brasa-dark"
          >
            Ver el curso
          </Link>
        ) : notified ? (
          <p role="status" className="mt-5 text-center font-semibold text-forest">
            Listo: te avisamos cuando salga.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void notify()}
            data-signup-trigger={isSignedIn ? undefined : 'avisame'}
            data-signup-title={isSignedIn ? undefined : `El curso de ${recipeName}`}
            data-signup-destination={isSignedIn ? undefined : `/recetas/${recipeSlug}`}
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full border border-forest text-[15px] font-semibold text-forest hover:bg-cream"
          >
            Avísame cuando salga
          </button>
        )}
      </div>
    </section>
  );
}
