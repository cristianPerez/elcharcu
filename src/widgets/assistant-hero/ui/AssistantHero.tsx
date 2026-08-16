'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { isLeadCaptured, LeadCaptureModal } from '@/features/lead-capture';
import { QuotaWall } from '@/features/quota-wall';

import { QUESTIONS_BEFORE_LEAD, useUsageQuota } from '@/entities/usage-quota';

import { Container } from '@/shared/ui';

/**
 * Asistente en la portada: usable sin registro, sin onboarding previo.
 *
 * La conversación vive en una tarjeta blanca sobre fondo crema. Ese contraste
 * es lo que dice "aquí se trabaja" sin necesidad de un letrero: antes todo era
 * el mismo verde y la caja de escribir —lo único que hay que hacer— era lo que
 * menos se veía.
 *
 * Dos muros, en este orden:
 *   1. Tras la primera pregunta, el muro blando de captura (9c).
 *   2. Al agotar las preguntas del mes, el muro de suscripción (9e).
 */
export function AssistantHero(): ReactNode {
  const { quota, status, isKnown } = useUsageQuota();
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [hasLead, setHasLead] = useState(true);

  useEffect(() => {
    setHasLead(isLeadCaptured());
  }, []);

  const needsLead = isKnown && !hasLead && quota.questionsUsed >= QUESTIONS_BEFORE_LEAD;

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

  // Solo se levanta el muro si SABEMOS que se acabó el cupo. Si no se pudo
  // leer, se deja pasar: quien de verdad protege el bolsillo es el tope diario
  // de gasto, que es global y vive en el servidor.
  const isWalled = isKnown && status.isExhausted;

  return (
    <>
      <section className="bg-cream py-8 md:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-[32px] font-semibold leading-[1.1] text-forest md:text-5xl">
              Cura sin miedo a arruinar la pieza.
            </h1>
            <p className="mt-2 text-base text-cocoa/65">
              Pregúntale al maestro. La primera va por cuenta de la casa.
            </p>

            <div className="mt-8 rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-raised md:p-6">
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

                  {isKnown && quota.questionsUsed > 0 ? (
                    <p className="mt-3 text-xs text-cocoa/65">
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
          onSuccess={handleLeadCaptured}
        />
      ) : null}
    </>
  );
}
