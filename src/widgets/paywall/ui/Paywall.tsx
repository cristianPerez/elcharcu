import { type ReactNode } from 'react';

import { QuotaWallPlans } from '@/features/quota-wall';

import { formatCop, oneTimeCourseCop } from '@/entities/plan';

import { Container, Eyebrow } from '@/shared/ui';

/**
 * La página de suscripción (`/asistente/suscripcion`).
 *
 * Nació como el muro de "segunda receta". Desde D15 la unidad es la pregunta,
 * así que el texto habla de preguntas y los planes son los mismos que ve todo
 * el mundo — se reutiliza `QuotaWallPlans` en vez de mantener dos tarjetas de
 * precio que se desincronizan en cuanto alguien cambia un número.
 */
export function Paywall(): ReactNode {
  return (
    <Container className="py-14 md:py-20">
      <div className="max-w-2xl">
        <Eyebrow className="text-terracota-dark">El Charcu Pro</Eyebrow>

        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] text-forest md:text-5xl">
          Salva tu próximo kilo de carne.
        </h1>

        <p className="mt-6 text-base leading-relaxed text-cocoa/70">
          El asistente al lado durante todo el curado: la dosis exacta de sal de cura, el
          moho revisado por foto y la respuesta a la hora en que te asalta la duda. Con lo
          que vale una pieza echada a perder, el plan se paga solo.
        </p>

        <QuotaWallPlans />
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cocoa/10 p-6 md:flex-row md:items-center">
        <div>
          <p className="font-serif text-lg text-forest">
            ¿No quieres suscripción? Compra el curso suelto.
          </p>
          <p className="mt-1 text-sm text-cocoa/65">
            Un curso completo, pago único, tuyo para siempre —{' '}
            {formatCop(oneTimeCourseCop)} COP.
          </p>
        </div>
        <span className="text-xs uppercase tracking-eyebrow text-cream/75">
          Disponible al lanzar
        </span>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-cocoa/65">
        Pagas con tarjeta, PSE o Nequi a través de Hotmart. El precio está en dólares y se
        cobra al cambio del día. Cancelas cuando quieras, sin llamar a nadie.
      </p>
    </Container>
  );
}
