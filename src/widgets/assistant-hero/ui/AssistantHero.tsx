'use client';

import { type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';

import { Container, Eyebrow } from '@/shared/ui';

/**
 * Asistente en la portada: usable sin registro, sin onboarding previo.
 * El asistente pregunta lo que necesite saber.
 */
export function AssistantHero(): ReactNode {
  return (
    <section className="bg-grain bg-forest py-12 text-cream md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Eyebrow className="text-sage">Pregúntale al maestro</Eyebrow>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Asistente de charcutería artesanal.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-cream/75 md:text-[15px]">
            Sal de cura, moho, temperatura, tiempo — todo lo que necesites para curar tu
            pieza sin riesgos.
          </p>

          <div className="mt-10">
            <AssistantChat
              product="consulta general"
              level="apasionado"
              country="Colombia"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
