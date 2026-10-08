'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { AppChat } from '@/features/assistant-chat';
import { useSignupPrompt, type SignupRequest } from '@/features/auth-by-email';
import { QuotaNotice } from '@/features/quota-wall';

import { useUsageQuota } from '@/entities/usage-quota';

import { appRoutes } from '@/shared/config';
import { ANONYMOUS_QUESTIONS, canAskWithoutAccount } from '@/shared/lib/access';

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
/** La hoja de crear cuenta de la 3.ª pregunta: al entrar, la pregunta se manda sola. */
function thirdQuestionSignup(question: string): SignupRequest {
  const withQuestion = `${appRoutes.appAssistant}?pregunta=${encodeURIComponent(question.trim())}`;
  return {
    trigger: 'tercera_pregunta',
    eyebrow: 'El Charcu',
    title: 'Tu tercera pregunta',
    heading: 'Crea tu cuenta gratis para seguir preguntando',
    // Una pregunta muy larga no cabe en el enlace: se vuelve al chat sin ella.
    destination: withQuestion.length <= 300 ? withQuestion : appRoutes.appAssistant,
    returnLabel: 'tu pregunta',
  };
}

interface AppAssistantProps {
  /** Sin cuenta se contestan 2 preguntas; la 3.ª abre la hoja de crear cuenta. */
  readonly isSignedIn: boolean;
}

export function AppAssistant({ isSignedIn }: AppAssistantProps): ReactNode {
  const { quota, status, isKnown } = useUsageQuota();
  const { openSignup } = useSignupPrompt();
  const needsAccount =
    !isSignedIn && !canAskWithoutAccount('anonimo', quota.questionsUsed);

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
   *
   * `?borrador=` (desde la búsqueda, 2026-10) es lo contrario: se deja ESCRITO
   * y no se manda. Se lee en el primer render para que la caja nazca con él, y
   * también se borra de la URL.
   */
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromUrl = searchParams.get('pregunta');
  const [draft] = useState<string | null>(() => searchParams.get('borrador'));
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const alreadyTaken = useRef(false);

  useEffect(() => {
    if (alreadyTaken.current || (fromUrl === null && draft === null)) {
      return;
    }
    alreadyTaken.current = true;
    if (fromUrl !== null) {
      // La pregunta que viene de la portada: si ya gastó las dos gratis, en
      // vez de mandarla se le pide la cuenta (y vuelve con ella al entrar).
      if (needsAccount) {
        openSignup(thirdQuestionSignup(fromUrl));
      } else {
        setPendingPrompt(fromUrl);
      }
    }
    router.replace(appRoutes.appAssistant, { scroll: false });
  }, [fromUrl, draft, router, needsAccount, openSignup]);

  // Solo se avisa si SABEMOS cómo va el cupo. Si no se pudo leer, se deja
  // pasar: quien protege el bolsillo es el tope diario de gasto, que es global
  // y vive en el servidor.
  const isExhausted = isKnown && status.isExhausted;

  // Se avisa ANTES de que se acabe. Enterarte de que te quedaba una pregunta
  // cuando ya la gastaste no te sirve de nada.
  const showNotice = isSignedIn && isKnown && status.questionsLeft <= 2;
  const anonymousLeft = Math.max(0, ANONYMOUS_QUESTIONS - quota.questionsUsed);

  return (
    <AppChat
      pendingPrompt={pendingPrompt}
      draft={draft}
      canSendImages={!isKnown || !status.areImagesExhausted}
      blockedReason={isExhausted ? 'Sin preguntas este mes. Vuelven el día 1.' : null}
      usage={isKnown ? { used: quota.questionsUsed, limit: quota.questionsLimit } : null}
      remaining={
        !isSignedIn
          ? { questions: anonymousLeft, images: status.imagesLeft }
          : isKnown && !isExhausted
            ? { questions: status.questionsLeft, images: status.imagesLeft }
            : null
      }
      notice={
        showNotice ? (
          <div className="mb-3">
            <QuotaNotice
              questionsLeft={status.questionsLeft}
              questionsLimit={quota.questionsLimit}
            />
          </div>
        ) : undefined
      }
      onBeforeSend={(text) => {
        if (!needsAccount) {
          return true;
        }
        openSignup(thirdQuestionSignup(text));
        return false;
      }}
    />
  );
}
