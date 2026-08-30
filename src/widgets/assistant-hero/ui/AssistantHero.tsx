'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { LeadCaptureModal, useAccountSession } from '@/features/lead-capture';
import { QuotaNotice } from '@/features/quota-wall';

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
 * Dos frenos, en este orden:
 *   1. Tras la primera pregunta, la cuenta — y ese SÍ es bloqueante
 *      (2026-08-19). La demostración es gratis; a partir de ahí hay que entrar.
 *   2. Al agotar las preguntas del mes, el aviso de cupo.
 *
 * Lo que decide el primero es la SESIÓN, no una marca en `localStorage`: quien
 * vuelve por el enlace del correo llega con sesión y el muro se retira solo.
 *
 * ⚠️ El segundo dejó de tapar el chat (2026-08-29, pedido de Cristian). Igual
 * que en la app: `QuotaWall` sustituía la conversación entera y la portada se
 * quedaba sin lo único que tiene que verse ahí —el asistente funcionando—, que
 * además es el argumento de venta de toda la página (D14). Ahora sale la misma
 * franja de la app y el chat se queda donde estaba.
 */
export function AssistantHero(): ReactNode {
  const { quota, status, isKnown } = useUsageQuota();
  const { isSignedIn, isReady: isSessionReady } = useAccountSession();
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const needsAccount =
    isKnown &&
    isSessionReady &&
    !isSignedIn &&
    quota.questionsUsed >= QUESTIONS_BEFORE_LEAD;

  useEffect(() => {
    if (!needsAccount) {
      setShowLeadCapture(false);
      return undefined;
    }

    // Un respiro para que alcance a leer la respuesta antes del formulario.
    const timer = setTimeout(() => {
      setShowLeadCapture(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [needsAccount]);

  // Solo se avisa si SABEMOS cómo va el cupo. Si no se pudo leer, se deja
  // pasar: quien de verdad protege el bolsillo es el tope diario de gasto, que
  // es global y vive en el servidor.
  const isExhausted = isKnown && status.isExhausted;

  // Se avisa ANTES de que se acabe, no solo después.
  const showNotice = isKnown && status.questionsLeft <= 2;

  return (
    <>
      <section className="bg-cream py-10 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-[32px] font-semibold leading-[1.1] text-forest md:text-5xl">
              Cura sin miedo a arruinar la pieza.
            </h1>
            <p className="mt-2 text-base text-cocoa/65">
              Pregúntale a El Charcu. La primera va por cuenta de la casa.
            </p>

            <div className="mt-8 rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-raised md:p-6">
              {showNotice ? (
                <QuotaNotice
                  questionsLeft={status.questionsLeft}
                  questionsLimit={quota.questionsLimit}
                />
              ) : null}

              <AssistantChat
                product="consulta general"
                canSendImages={!status.areImagesExhausted}
                blockedReason={
                  isExhausted ? 'Sin preguntas este mes. Vuelven el día 1.' : null
                }
              />

              {/* El contador de siempre, solo mientras quede algo: a cero lo
                  dice la franja de arriba, y repetirlo sobra. */}
              {isKnown && !isExhausted && quota.questionsUsed > 0 ? (
                <p className="mt-3 text-xs text-cocoa/65">
                  Te quedan {status.questionsLeft} preguntas y {status.imagesLeft} fotos
                  este mes.
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {showLeadCapture && !isExhausted ? (
        <LeadCaptureModal questionsLimit={quota.questionsLimit} />
      ) : null}
    </>
  );
}
