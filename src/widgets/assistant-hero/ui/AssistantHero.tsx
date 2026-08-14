'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { LeadCaptureModal } from '@/features/lead-capture';

import { FREE_TIER_LIMITS, loadQuota } from '@/entities/usage-quota';

import { Container, Eyebrow } from '@/shared/ui';

/**
 * Asistente en la portada: usable sin registro, sin onboarding previo.
 * El asistente pregunta lo que necesite saber.
 *
 * Tras la primera respuesta, aparece el muro blando de captura de datos.
 */
export function AssistantHero(): ReactNode {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [hasSeenResponse, setHasSeenResponse] = useState(false);

  useEffect(() => {
    // Verificar si ya dejó los datos
    const alreadyCaptured = localStorage.getItem('elcharcu:lead-captured') === 'true';
    if (alreadyCaptured) {
      return undefined;
    }

    // Verificar si ya usó la primera pregunta gratis
    const quota = loadQuota();
    if (quota.questionsUsed >= FREE_TIER_LIMITS.questionsBeforeLead && !hasSeenResponse) {
      setHasSeenResponse(true);
      // Mostrar el modal tras un pequeño delay para que vea la respuesta
      const timer = setTimeout(() => {
        setShowLeadCapture(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [hasSeenResponse]);

  const handleLeadCaptured = (): void => {
    setShowLeadCapture(false);
  };

  return (
    <>
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

      {showLeadCapture ? <LeadCaptureModal onSuccess={handleLeadCaptured} /> : null}
    </>
  );
}
