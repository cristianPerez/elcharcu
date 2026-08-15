import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

import { stats } from '../model/stats';

/** Historia de marca: qué es El Charcu, de dónde surge, y cifras clave. */
export function BrandStory(): ReactNode {
  return (
    <section id="historia" className="bg-cream py-20 text-cocoa md:py-28">
      <Container>
        <div className="grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
          <div>
            <Eyebrow className="text-terracota">La marca</Eyebrow>
            <h2 className="mt-6 max-w-md font-serif text-4xl font-semibold leading-tight md:text-5xl">
              El tiempo también es un ingrediente.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-cocoa/80">
            <p>
              El Charcu nace en Manizales de la obsesión por hacer embutidos y curados con
              la calidad de España e Italia — sin los aditivos ni los atajos de la
              industria. Lo que empezó como afición se convirtió en oficio, y el oficio en
              marca.
            </p>
            <p>
              Curamos con técnica europea y paciencia: la sal, el humo y el aire hacen el
              resto. Cada pieza se elabora en lotes pequeños, con control real sobre cada
              etapa del proceso.
            </p>
            <p className="font-serif text-xl italic text-forest">
              El producto que se prueba, y el conocimiento que se enseña.
            </p>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-cocoa/10 pt-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-serif text-4xl font-semibold text-forest md:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm text-cocoa/65">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
