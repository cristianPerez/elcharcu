import Link from 'next/link';
import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

interface RecipeHeroProps {
  readonly eyebrow: string;
  readonly name: string;
  readonly subtitle: string;
}

/**
 * Cabecera de la receta: volver, eyebrow, título y subtítulo.
 *
 * ⚠️ MENOS CABECERA (Cristian, 2026-09-01). Iba con `py-12 md:py-24` y en un
 * móvil se comía casi la primera pantalla entera: llegabas de Google a una
 * receta y lo primero —y a veces lo único— que veías era verde y un título.
 * La receta empezaba por debajo del pliegue.
 *
 * Ahora el aire de arriba es el justo para separar del menú, y el de abajo el
 * justo para no pegarse al texto. El título sube de tamaño mientras la caja
 * baja: se lee mejor y ocupa menos, que no es una contradicción — lo que
 * sobraba era el vacío, no la letra.
 */
export function RecipeHero({ eyebrow, name, subtitle }: RecipeHeroProps): ReactNode {
  return (
    <section className="bg-grain bg-forest pb-7 pt-5 text-cream md:pb-14 md:pt-10">
      <Container>
        <Link
          href="/recetas"
          className="text-sm text-cream/75 transition-colors hover:text-cream"
        >
          ← Recetas
        </Link>
        <Eyebrow className="mt-4 text-sage md:mt-5">
          {/* En el celular, más junta y más chica: cabe en una línea. */}
          <span className="text-[11px] tracking-[0.12em] md:text-xs md:tracking-eyebrow">
            {eyebrow}
          </span>
        </Eyebrow>
        {/* 26 px en el celular, como el título de la portada de Cursos: a 34 px
            un nombre largo ocupaba 4 líneas y media pantalla (2026-10-07). */}
        <h1 className="mt-2 font-serif text-[26px] font-semibold leading-[1.15] md:mt-3 md:text-[46px] md:leading-[1.1]">
          {name}
        </h1>
        <p className="mt-2 font-serif text-[15px] italic text-brasa-light md:mt-3 md:text-lg">
          {subtitle}
        </p>
      </Container>
    </section>
  );
}
