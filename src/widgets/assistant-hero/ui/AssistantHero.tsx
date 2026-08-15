'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { isLeadCaptured, LeadCaptureModal } from '@/features/lead-capture';
import { QuotaWall } from '@/features/quota-wall';

import { QUESTIONS_BEFORE_LEAD, useUsageQuota } from '@/entities/usage-quota';

import { Container, Eyebrow } from '@/shared/ui';

/**
 * Asistente en la portada: usable sin registro, sin onboarding previo.
 * El asistente pregunta lo que necesite saber.
 *
 * Dos muros, en este orden:
 *   1. Tras la primera pregunta, el muro blando de captura (9c).
 *   2. Al agotar las preguntas del mes, el muro de suscripción (9e).
 */
export function AssistantHero(): ReactNode {
  const { quota, status, isReady } = useUsageQuota();
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [hasLead, setHasLead] = useState(true);

  useEffect(() => {
    setHasLead(isLeadCaptured());
  }, []);

  const needsLead = isReady && !hasLead && quota.questionsUsed >= QUESTIONS_BEFORE_LEAD;

  useEffect(() => {
    if (!needsLead) {
      return undefined;
    }

    // Un respiro para que alcance a leer la respuesta antes del formulario.
    const timer = setTimeout(() => {
      setShowLeadCapture(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [needsLead]);

  const handleLeadCaptured = (): void => {
    setShowLeadCapture(false);
    setHasLead(true);
  };

  const isWalled = isReady && status.isExhausted;

  return (
    <>
      <section className="bg-grain bg-forest py-12 text-cream md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow className="text-sage">Pregúntale al maestro</Eyebrow>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
              Asistente de charcutería artesanal.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-cream/75">
              Sal de cura, moho, temperatura, tiempo — todo lo que necesites para curar tu
              pieza sin riesgos.
            </p>

            <div className="mt-10">
              {isWalled ? (
                <QuotaWall
                  questionsUsed={quota.questionsUsed}
                  questionsLimit={quota.questionsLimit}
                />
              ) : (
                <>
                  <AssistantChat
                    product="consulta general"
                    level="apasionado"
                    country="Colombia"
                    canSendImages={!status.areImagesExhausted}
                  />

                  {isReady && quota.questionsUsed > 0 ? (
                    <p className="mt-4 text-xs text-cream/40">
                      Te quedan {status.questionsLeft} preguntas y {status.imagesLeft}{' '}
                      fotos este mes.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {showLeadCapture && !isWalled ? (
        <LeadCaptureModal
          questionsLimit={quota.questionsLimit}
          imagesLimit={quota.imagesLimit}
          onSuccess={handleLeadCaptured}
        />
      ) : null}
    </>
  );
}
