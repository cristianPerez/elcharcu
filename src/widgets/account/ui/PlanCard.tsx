import Link from 'next/link';
import { type ReactNode } from 'react';

import { planWhatsappHref, type CurrentPlan } from '@/entities/plan';

import { appRoutes } from '@/shared/config';
import { ProgressBar } from '@/shared/ui';

interface PlanCardProps {
  readonly current: CurrentPlan;
  /** ISO 8601 de `subscriptions.current_period_end`. `null` sin suscripción. */
  readonly renewsAt: string | null;
  readonly isCanceled: boolean;
  readonly usage: {
    readonly questionsUsed: number;
    readonly questionsLimit: number;
    readonly imagesUsed: number;
    readonly imagesLimit: number;
  } | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Meter({
  label,
  used,
  limit,
}: {
  readonly label: string;
  readonly used: number;
  readonly limit: number;
}): ReactNode {
  return (
    <div className="flex-1">
      <div className="mb-2 flex justify-between text-sm text-cream-white">
        <span>{label}</span>
        <span className="font-semibold">
          {used} de {limit}
        </span>
      </div>
      <ProgressBar
        tone="dark"
        value={limit === 0 ? 0 : (used / limit) * 100}
        label={`${label} usadas este mes`}
      />
    </div>
  );
}

/**
 * "Tu plan": cuál es, cuándo se renueva DE VERDAD y cuánto lleva gastado.
 *
 * La fecha sale de `current_period_end`; si no hay suscripción no se inventa
 * ninguna. "Gestionar" abre WhatsApp mientras OnePay no esté conectado: es
 * por donde hoy se activa y se cancela a mano (ver ESTADO.md).
 */
export function PlanCard({
  current,
  renewsAt,
  isCanceled,
  usage,
}: PlanCardProps): ReactNode {
  const isFree = current.cycle === null;
  const cycleLabel = current.cycle === 'anual' ? 'Anual' : 'Mensual';

  return (
    <section
      aria-labelledby="plan-title"
      className="bg-grain rounded-card bg-forest p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage-light">
            Tu plan
          </p>
          <h2
            id="plan-title"
            className="mt-1.5 font-serif text-[22px] font-semibold text-cream-white"
          >
            {current.plan.name}
          </h2>
          <p className="mt-1 text-sm text-cream-white/85">
            {isFree
              ? 'Gratis'
              : renewsAt === null
                ? cycleLabel
                : `${cycleLabel} · ${isCanceled ? 'se acaba el' : 'se renueva el'} ${formatDate(renewsAt)}`}
          </p>
        </div>
        {isFree ? (
          <Link
            href={appRoutes.subscription}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-cream-white/30 px-4 text-sm font-semibold text-cream-white hover:bg-cream-white/10"
          >
            Ver planes
          </Link>
        ) : (
          <a
            href={planWhatsappHref(current.plan, null)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-cream-white/30 px-4 text-sm font-semibold text-cream-white hover:bg-cream-white/10"
          >
            Gestionar plan
          </a>
        )}
      </div>

      {usage === null ? null : (
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:gap-6">
          <Meter
            label="Preguntas"
            used={usage.questionsUsed}
            limit={usage.questionsLimit}
          />
          <Meter label="Fotos" used={usage.imagesUsed} limit={usage.imagesLimit} />
        </div>
      )}
      <p className="mt-4 text-[13px] text-cream-white/85">
        El cupo se renueva el día 1 de cada mes.
      </p>
    </section>
  );
}
