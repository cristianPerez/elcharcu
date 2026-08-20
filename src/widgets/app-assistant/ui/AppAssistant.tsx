'use client';

import { useSearchParams } from 'next/navigation';
import { type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { QuotaWall } from '@/features/quota-wall';

import { useUsageQuota } from '@/entities/usage-quota';

import { Reveal } from '@/shared/ui';

/**
 * El asistente dentro de la app, para quien ya entró con su cuenta.
 *
 * Es hermano de `assistant-hero`, no el mismo: allí el chat es el argumento de
 * venta y va rodeado de titular y muro de captura; aquí ya no hay nada que
 * vender ni datos que pedir, así que la pantalla es solo la conversación. El
 * muro que sí queda es el del cupo agotado.
 */
export function AppAssistant(): ReactNode {
  const { quota, status, isKnown } = useUsageQuota();

  /**
   * La duda que llega de una lección (`/charcu?pregunta=…`).
   *
   * Se manda sola al llegar: el sentido de tocar la pregunta de un paso es no
   * tener que escribirla. `AssistantChat` ya se guarda de no reenviarla en
   * cada render, que si no gastaría cupo por cada repintado.
   */
  const pendingPrompt = useSearchParams().get('pregunta');

  // Solo se levanta el muro si SABEMOS que se acabó el cupo. Si no se pudo
  // leer, se deja pasar: quien protege el bolsillo es el tope diario de gasto,
  // que es global y vive en el servidor.
  const isWalled = isKnown && status.isExhausted;

  return (
    <>
      <Reveal>
        <header>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            Pregúntale al maestro
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-forest">
            El Charcu
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-raised">
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
                pendingPrompt={pendingPrompt}
              />

              {isKnown ? (
                <p className="mt-3 text-xs text-cocoa/65">
                  Te quedan {status.questionsLeft} preguntas y {status.imagesLeft} fotos
                  este mes.
                </p>
              ) : null}
            </>
          )}
        </div>
      </Reveal>
    </>
  );
}
