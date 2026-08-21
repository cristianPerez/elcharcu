'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';

import { SignOutButton } from '@/features/auth-by-email';

import { useUsageQuota } from '@/entities/usage-quota';

import { appRoutes } from '@/shared/config';
import { IconChevron, Reveal } from '@/shared/ui';

interface AppCuentaViewProps {
  /** El correo con el que entró. Lo lee el servidor, no el navegador. */
  readonly email: string;
}

/**
 * Nombre de cara al usuario del plan que dice la base.
 *
 * Las claves son los `plan_id` REALES de `charcu.plan_quotas`
 * (`aprendiz`, `pro-mensual`, `pro-anual`, `maestro-*`). Antes decían
 * `charcutero` y `maestro`, que no existen en la tabla: a quien pagara le
 * habría salido el id crudo en pantalla.
 */
const PLAN_LABEL: Record<string, string> = {
  aprendiz: 'Aprendiz · gratis',
  'pro-mensual': 'El Charcu Pro · mensual',
  'pro-anual': 'El Charcu Pro · anual',
  'maestro-mensual': 'El Charcu Maestro · mensual',
  'maestro-anual': 'El Charcu Maestro · anual',
};

/**
 * Tercera pestaña: quién eres aquí y qué te queda.
 *
 * El orden no es casual: primero lo que el usuario vino a mirar —cuánto le
 * queda este mes— y solo después la cuenta y la salida. Poner "cerrar sesión"
 * arriba es invitar a irse.
 */
export function AppCuentaView({ email }: AppCuentaViewProps): ReactNode {
  const { quota, isKnown } = useUsageQuota();
  const planLabel = PLAN_LABEL[quota.plan] ?? quota.plan;
  // Se espera a saber el plan de verdad: enseñarle "pasa a El Charcu Pro" a
  // alguien que ya paga, aunque sea medio segundo, es de las cosas que hacen
  // dudar de si el cobro entró.
  const isFree = isKnown && quota.plan === 'aprendiz';

  return (
    <>
      <Reveal>
        <header>
          <p className="text-xs font-medium uppercase tracking-eyebrow text-sage">
            El Charcu
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-forest">
            Mi cuenta
          </h1>
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="mt-6 rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-raised">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm text-cocoa/50">Tu plan</p>
            <p className="text-sm font-medium text-forest">{isKnown ? planLabel : '—'}</p>
          </div>

          <dl className="mt-5 space-y-4">
            <QuotaRow
              label="Preguntas este mes"
              used={quota.questionsUsed}
              limit={quota.questionsLimit}
              isKnown={isKnown}
            />
            <QuotaRow
              label="Fotos este mes"
              used={quota.imagesUsed}
              limit={quota.imagesLimit}
              isKnown={isKnown}
            />
          </dl>

          <p className="mt-5 text-xs leading-relaxed text-cocoa/55">
            El cupo se renueva el día 1 de cada mes.
          </p>
        </section>
      </Reveal>

      {isFree ? (
        <Reveal delay={0.08}>
          <Link
            href={appRoutes.subscription}
            className="mt-4 flex items-center justify-between rounded-2xl bg-terracota-dark px-5 py-4 text-cream-white shadow-surface transition-transform active:scale-[0.98]"
          >
            <span>
              <span className="block font-medium">Pasar a El Charcu Pro</span>
              <span className="mt-0.5 block text-sm text-cream-white/80">
                Más preguntas y más fotos al mes
              </span>
            </span>
            <IconChevron size={18} />
          </Link>
        </Reveal>
      ) : null}

      <Reveal delay={0.12}>
        <section className="mt-8">
          <h2 className="text-sm font-medium text-cocoa/65">Tus datos</h2>
          <div className="mt-3 rounded-xl border border-cocoa/10 bg-cream-white px-4 py-3.5">
            <p className="text-xs text-cocoa/50">Correo</p>
            <p className="mt-0.5 break-all text-base text-cocoa">{email}</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-cocoa/55">
            Puedes pedirnos borrar tus datos cuando quieras en hola@elcharcu.co — Ley
            1581/2012.
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </Reveal>
    </>
  );
}

interface QuotaRowProps {
  readonly label: string;
  readonly used: number;
  readonly limit: number;
  readonly isKnown: boolean;
}

/**
 * Una fila de cupo, con la barra.
 *
 * Se enseña "3 de 8" y no "te quedan 5": el usuario está comprobando si le
 * alcanza, y para eso necesita ver el total contra el que va.
 */
function QuotaRow({ label, used, limit, isKnown }: QuotaRowProps): ReactNode {
  const percent = limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-base text-cocoa/70">{label}</dt>
        <dd className="text-base font-medium text-cocoa">
          {isKnown ? `${used} de ${limit}` : '—'}
        </dd>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream"
        role="presentation"
      >
        <div
          className="h-full rounded-full bg-sage transition-[width] duration-500"
          style={{ width: `${isKnown ? percent : 0}%` }}
        />
      </div>
    </div>
  );
}
