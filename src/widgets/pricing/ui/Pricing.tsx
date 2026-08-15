import { type ReactNode } from 'react';

import { PlanCard, formatCop, oneTimeCourseCop, plans } from '@/entities/plan';

import { appRoutes } from '@/shared/config';
import { Container, Eyebrow } from '@/shared/ui';

/** Precios en pesos, con la regla de la receta gratis al frente. */
export function Pricing(): ReactNode {
  return (
    <section id="precios" className="bg-grain bg-forest-dark py-20 text-cream md:py-28">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow className="text-sage">Planes</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            La primera pregunta va por cuenta de la casa.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-cream/70">
            Preguntas sin registrarte y sin poner tarjeta. Los planes se miden en
            preguntas y fotos al mes: pagas por la ayuda que usas, no por meses en los que
            no curaste nada.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} href={appRoutes.start} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cream/15 p-6 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-lg text-cream">
              ¿No quieres suscripción? Compra el curso suelto.
            </p>
            <p className="mt-1 text-sm text-cream/60">
              Un curso completo, pago único, tuyo para siempre —{' '}
              {formatCop(oneTimeCourseCop)}.
            </p>
          </div>
          <span className="text-xs uppercase tracking-eyebrow text-sage">
            Disponible al lanzar
          </span>
        </div>

        <p className="mt-8 text-sm text-cream/55">
          Pagas en pesos colombianos con Nequi, PSE o tarjeta. Nada en dólares. Cancelas
          desde la app cuando quieras, sin llamar a nadie.
        </p>
      </Container>
    </section>
  );
}
