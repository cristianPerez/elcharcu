'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';

interface QuotaNoticeProps {
  readonly questionsLeft: number;
  readonly questionsLimit: number;
}

/**
 * El aviso de cupo, encima del chat. NO lo reemplaza.
 *
 * ⚠️ Esto sustituye al `QuotaWall` en los DOS sitios donde se usaba —la app y
 * la portada— (2026-08-29, pedido de Cristian). El muro tapaba la conversación
 * entera al llegar a cero, con dos daños distintos:
 *
 *   - En la app, la pestaña del Charcu se veía ROTA: entrabas al asistente y no
 *     había asistente. Y se perdía de vista el historial de lo que ya habías
 *     preguntado, que es lo que hace volver a alguien durante un curado de
 *     semanas.
 *   - En la portada era peor: el asistente funcionando ES el argumento de venta
 *     de toda la página (D14), y el muro lo escondía justo para enseñar un
 *     precio.
 *
 * El comportamiento nuevo es el de Claude cuando te vas quedando sin uso: la
 * herramienta sigue ahí, y arriba aparece una franja que te dice cómo vas. Se
 * avisa ANTES de que se acabe, no solo después — enterarte de que te quedaba
 * una pregunta cuando ya la gastaste no te sirve de nada.
 *
 * ⚠️ `QuotaWall` quedó SIN USAR y sigue exportado. No se borra aquí para no
 * mezclarlo con este cambio, pero es candidato a irse.
 */
export function QuotaNotice({
  questionsLeft,
  questionsLimit,
}: QuotaNoticeProps): ReactNode {
  const isExhausted = questionsLeft === 0;

  useEffect(() => {
    if (isExhausted) {
      track(ANALYTICS_EVENTS.quotaWallHit, {
        questions_used: questionsLimit,
        free_questions: questionsLimit,
      });
    }
  }, [isExhausted, questionsLimit]);

  return (
    <div
      role="status"
      className={`mb-4 rounded-xl border px-4 py-3 ${
        isExhausted ? 'border-terracota/35 bg-terracota/10' : 'border-cocoa/12 bg-cream'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`text-sm font-medium ${
              isExhausted ? 'text-terracota-dark' : 'text-cocoa/80'
            }`}
          >
            {isExhausted
              ? 'Se acabaron tus preguntas del mes'
              : questionsLeft === 1
                ? 'Te queda 1 pregunta este mes'
                : `Te quedan ${String(questionsLeft)} preguntas este mes`}
          </p>

          <p className="mt-0.5 text-xs leading-relaxed text-cocoa/60">
            {isExhausted
              ? // La fecha de vuelta va PRIMERO y sin condiciones: quedarse sin
                // cupo no puede parecer un callejón sin salida, y el cupo
                // vuelve pague o no pague. Decirlo es lo honesto y además quita
                // el miedo que hace cerrar la app y no volver.
                'Vuelven el día 1. Puedes seguir leyendo lo que ya preguntaste.'
              : 'Tu cupo vuelve a cero el día 1 de cada mes.'}
          </p>
        </div>

        <Link
          href={`${appRoutes.subscription}?de=aviso-cupo`}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            isExhausted
              ? 'bg-terracota-dark text-cream-white'
              : 'border border-cocoa/20 text-cocoa/70 hover:border-terracota hover:text-terracota'
          }`}
        >
          Ver planes
        </Link>
      </div>
    </div>
  );
}
