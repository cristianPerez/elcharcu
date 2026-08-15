import { type ReactNode } from 'react';

import { site } from '@/shared/config';
import { Container, Eyebrow } from '@/shared/ui';

interface Difference {
  readonly title: string;
  readonly description: string;
}

const differences: readonly Difference[] = [
  {
    title: 'Responde sobre TU pieza',
    description:
      'Un video no sabe que tu cuarto está a 24 °C con 80 % de humedad, no vio la mancha que te salió hoy, y no te va a decir si eso se come o se bota.',
  },
  {
    title: 'Detrás hay una persona real',
    description: `${site.name}, en ${site.location}. Técnica de España e Italia, cursos calificados 4.8–5.0 por gente que ya curó con este método.`,
  },
  {
    title: 'No inventa para quedar bien',
    description:
      'Cuando algo puede enfermar a alguien, prefiere decirte que pares. Aunque no sea la respuesta que querías oír.',
  },
];

/** La objeción "está gratis en YouTube" + el bloque de seguridad alimentaria. */
export function AssistantTrust(): ReactNode {
  return (
    <section id="confianza" className="bg-cream py-20 md:py-28">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow className="text-terracota">Por qué pagar por esto</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-5xl">
            En YouTube nadie te responde
            <br />a las once de la noche.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-cocoa/70">
            Los videos están, sí, y son gratis. El problema nunca fue conseguir la receta:
            fue no tener a quién preguntarle cuando algo se salió del guion.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {differences.map((item) => (
            <div key={item.title} className="border-t border-cocoa/15 pt-6">
              <h3 className="font-serif text-xl font-semibold text-forest">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-grain mt-16 rounded-3xl bg-forest p-8 text-cream md:p-12">
          <Eyebrow className="text-sage">Seguridad primero</Eyebrow>
          <h3 className="mt-5 max-w-2xl font-serif text-2xl font-semibold leading-tight md:text-3xl">
            La regla que no se negocia: que nadie se enferme.
          </h3>

          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            <li>
              <p className="font-serif text-lg text-cream">El tope es el tope</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                Nunca recomienda más de 2,5 g de sal de cura #1 por kilo de carne — el
                máximo permitido, unas 156 ppm de nitrito. Se lo pidas como se lo pidas.
              </p>
            </li>
            <li>
              <p className="font-serif text-lg text-cream">Ante la duda, se bota</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                Con moho verde ambiguo o mal olor, la respuesta es descartar. Vale más
                perder un kilo de carne que un domingo en urgencias.
              </p>
            </li>
            <li>
              <p className="font-serif text-lg text-cream">Te explica el porqué</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                Nunca te suelta un número solo. Te dice qué hace el nitrito, por qué el
                botulismo importa, y qué estás previniendo.
              </p>
            </li>
          </ul>

          <p className="mt-8 border-t border-cream/15 pt-6 text-xs leading-relaxed text-cream/75">
            El asistente acompaña tu criterio, no lo reemplaza. Sigue siendo tu
            responsabilidad manipular la carne con higiene y descartar lo que no te dé
            confianza.
          </p>
        </div>
      </Container>
    </section>
  );
}
