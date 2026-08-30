'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { QuotaNotice } from '@/features/quota-wall';

import { useUsageQuota } from '@/entities/usage-quota';

import { appRoutes } from '@/shared/config';
import { Reveal } from '@/shared/ui';

/**
 * El asistente dentro de la app, para quien ya entró con su cuenta.
 *
 * Es hermano de `assistant-hero`, no el mismo: allí el chat es el argumento de
 * venta y va rodeado de titular y muro de captura; aquí ya no hay nada que
 * vender ni datos que pedir, así que la pantalla es solo la conversación.
 *
 * ⚠️ AQUÍ YA NO SE TAPA EL CHAT (2026-08-29, pedido de Cristian). Antes, al
 * llegar a cero preguntas, `QuotaWall` sustituía la conversación entera y la
 * pestaña del Charcu se veía rota: entrabas al asistente y no había asistente.
 * Además se perdía de vista el historial, que es lo que hace volver a alguien
 * durante un curado de semanas.
 *
 * Ahora el chat se queda y arriba sale una franja, como hace Claude cuando te
 * vas quedando sin uso. Lo único que se cierra es la caja de escribir, y con el
 * motivo escrito dentro.
 */
export function AppAssistant(): ReactNode {
  const { quota, status, isKnown } = useUsageQuota();

  /**
   * La duda que llega de una lección (`/charcu?pregunta=…`).
   *
   * Se manda sola al llegar: el sentido de tocar la pregunta de un paso es no
   * tener que escribirla.
   *
   * ⚠️ Y se BORRA de la URL en cuanto se recoge. Mientras el parámetro seguía
   * ahí, cada vez que esta pantalla se montaba se volvía a mandar: volver dos
   * veces a la misma lección dejó tres recetas idénticas y gastó tres
   * preguntas del cupo (2026-08-20). La pregunta se guarda en estado, que no
   * viaja en la dirección.
   */
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromUrl = searchParams.get('pregunta');
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const alreadyTaken = useRef(false);

  useEffect(() => {
    if (fromUrl === null || alreadyTaken.current) {
      return;
    }
    alreadyTaken.current = true;
    setPendingPrompt(fromUrl);
    router.replace(appRoutes.appAssistant, { scroll: false });
  }, [fromUrl, router]);

  // Solo se avisa si SABEMOS cómo va el cupo. Si no se pudo leer, se deja
  // pasar: quien protege el bolsillo es el tope diario de gasto, que es global
  // y vive en el servidor.
  const isExhausted = isKnown && status.isExhausted;

  // Se avisa ANTES de que se acabe. Enterarte de que te quedaba una pregunta
  // cuando ya la gastaste no te sirve de nada.
  const showNotice = isKnown && status.questionsLeft <= 2;

  return (
    <>
      <Reveal>
        <header>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            Pregúntale a El Charcu
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-forest">
            El Charcu
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-4 shadow-raised">
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
            pendingPrompt={pendingPrompt}
          />

          {/* El contador de siempre, solo mientras quede algo: cuando está a
              cero lo dice la franja de arriba, y repetirlo sobra. */}
          {isKnown && !isExhausted ? (
            <p className="mt-3 text-xs text-cocoa/65">
              Te quedan {status.questionsLeft} preguntas y {status.imagesLeft} fotos este
              mes.
            </p>
          ) : null}
        </div>
      </Reveal>
    </>
  );
}
