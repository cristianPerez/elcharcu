import { type ReactNode } from 'react';

import { Container, Eyebrow } from '@/shared/ui';

import { faqItems } from '../model/faq';

/** Preguntas frecuentes. `<details>` nativo: accesible y sin JavaScript. */
export function AssistantFaq(): ReactNode {
  return (
    <section id="preguntas" className="bg-cream py-20 md:py-28">
      <Container className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
        <div>
          <Eyebrow className="text-terracota">Preguntas</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
            Lo que todos preguntan antes de empezar.
          </h2>
        </div>

        <div>
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="border-cocoa/12 group border-b py-5 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-lg font-medium text-forest marker:content-none">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-2xl font-light text-terracota transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cocoa/70">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
