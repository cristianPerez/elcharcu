'use client';

import { useState, type ReactNode } from 'react';

import {
  BillingToggle,
  DEFAULT_BILLING_CYCLE,
  PlanCard,
  formatCop,
  oneTimeCourseCop,
  planWhatsappHref,
  plans,
  priceFor,
  proPlan,
  type BillingCycle,
} from '@/entities/plan';

import { appRoutes, site } from '@/shared/config';
import { Container, Eyebrow } from '@/shared/ui';

/** Dos planes —gratis y de pago— y un toggle para elegir mes o año. */
export function Pricing(): ReactNode {
  const [cycle, setCycle] = useState<BillingCycle>(DEFAULT_BILLING_CYCLE);
  const yearly = priceFor(proPlan, 'anual');

  return (
    <section id="precios" className="bg-grain bg-forest-dark py-16 text-cream md:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow className="text-sage">Planes</Eyebrow>
          <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            La primera pregunta va por cuenta de la casa.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-cream/75">
            Preguntas sin registrarte y sin poner tarjeta. Los planes se miden en
            preguntas y fotos al mes: pagas por la ayuda que usas, no por meses en los que
            no curaste nada.
          </p>
        </div>

        <div className="mt-8">
          <BillingToggle
            cycle={cycle}
            onChange={setCycle}
            savingPercent={yearly?.savingPercent ?? 0}
            onDark
          />
        </div>

        <div className="mt-8 grid items-start gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cycle={cycle}
              /*
                El gratis lleva a PROBAR; los de pago, a WhatsApp.

                Los tres apuntaban a `appRoutes.start`, que era el onboarding
                anónimo — y ese onboarding se mudó detrás del login el
                2026-08-29, así que a quien no tiene cuenta le contestaba
                "No pudimos guardar tus datos". El botón de precios llevaba a
                un formulario roto.
              */
              href={
                plan.id === 'aprendiz'
                  ? appRoutes.start
                  : planWhatsappHref(plan, priceFor(plan, cycle))
              }
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cream/15 p-6 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-lg text-cream">
              ¿No quieres suscripción? Compra el curso suelto.
            </p>
            <p className="mt-1 text-sm text-cream/75">
              Un curso completo, pago único, tuyo para siempre —{' '}
              {formatCop(oneTimeCourseCop)} COP.
            </p>
          </div>
          <span className="text-xs uppercase tracking-eyebrow text-cream/75">
            Disponible al lanzar
          </span>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm text-cream/75">
            Escribes por WhatsApp y El Charcu te manda el link de pago —PSE, Nequi o
            tarjeta—. Te activamos la cuenta y te confirmamos. Sin plataformas de por
            medio y sin renovación automática: cuando quieras seguir, lo dices.
          </p>

          {/* Un botón directo, además del de cada plan: quien llegó hasta aquí
              abajo ya leyó los precios y puede tener una duda antes de elegir.
              Obligarle a subir a una tarjeta para poder preguntar es fricción. */}
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-cream px-6 py-3 text-sm font-medium tracking-wide text-forest transition-transform active:scale-[0.97]"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}
