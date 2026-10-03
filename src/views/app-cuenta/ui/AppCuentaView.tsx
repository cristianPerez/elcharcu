import { type ReactNode } from 'react';

import {
  AccountNav,
  MaestroUpsell,
  PlanCard,
  ProgressSummary,
  SupportLinks,
  type AccountProgress,
} from '@/widgets/account';

import { SignOutButton } from '@/features/auth-by-email';
import {
  EditNameButton,
  InterestChips,
  NotificationToggles,
  type NotificationValues,
} from '@/features/edit-profile';

import { type CurrentPlan } from '@/entities/plan';

import { type InterestId } from '@/shared/config';
import { PageTitle } from '@/shared/ui';

interface AppCuentaViewProps {
  readonly name: string;
  readonly email: string;
  readonly initials: string;
  readonly interests: readonly InterestId[];
  readonly notifications: NotificationValues;
  readonly plan: CurrentPlan;
  readonly renewsAt: string | null;
  readonly isCanceled: boolean;
  readonly usage: {
    readonly questionsUsed: number;
    readonly questionsLimit: number;
    readonly imagesUsed: number;
    readonly imagesLimit: number;
  } | null;
  readonly progress: AccountProgress;
}

const CARD = 'rounded-card border border-cocoa/10 bg-cream-white';

/**
 * "Mi cuenta" (rediseño 2026-10). En el celular, una columna; en escritorio,
 * el menú de secciones a la izquierda y el contenido en grilla.
 *
 * Cada interés, interruptor o nombre se guarda al tocarlo: aquí no hay un
 * botón de "guardar" que olvidar.
 */
export function AppCuentaView(props: AppCuentaViewProps): ReactNode {
  const { name, email, initials, plan } = props;
  const isMaestro = plan.plan.id === 'maestro';

  return (
    <div className="reveal grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">
        <AccountNav name={name} email={email} initials={initials} />
      </aside>

      <div className="flex min-w-0 flex-col gap-8">
        <PageTitle>Mi cuenta</PageTitle>

        {/* El perfil compacto: solo en el celular; en escritorio está en el menú. */}
        <div className="-mt-2 flex items-center gap-3 lg:hidden">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-full bg-forest font-serif text-xl font-semibold text-cream-white"
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-cocoa">
              {name || 'Sin nombre'}
            </p>
            <p className="truncate text-sm text-cocoa-soft">{email}</p>
          </div>
          <EditNameButton initialName={name} />
        </div>

        <div
          id="plan"
          className="grid scroll-mt-28 gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-5"
        >
          <div className={isMaestro ? 'md:col-span-2' : undefined}>
            <PlanCard
              current={plan}
              renewsAt={props.renewsAt}
              isCanceled={props.isCanceled}
              usage={props.usage}
            />
          </div>
          {isMaestro ? null : <MaestroUpsell />}
        </div>

        <ProgressSummary progress={props.progress} />

        <div className="grid gap-8 md:grid-cols-2 md:gap-5">
          <section
            id="perfil"
            aria-labelledby="perfil-title"
            className="scroll-mt-28 md:rounded-card md:border md:border-cocoa/10 md:bg-cream-white md:p-6"
          >
            <div className="flex items-baseline justify-between">
              <h2
                id="perfil-title"
                className="font-serif text-[19px] font-semibold text-forest md:text-xl"
              >
                <span className="md:hidden">Qué quieres aprender</span>
                <span className="hidden md:inline">Perfil</span>
              </h2>
              <span className="hidden md:inline">
                <EditNameButton initialName={name} variant="link" />
              </span>
            </div>
            <dl className="mt-4 hidden gap-4 md:grid">
              <div>
                <dt className="text-[13px] text-cocoa-soft">Cómo te llamas</dt>
                <dd className="text-base text-cocoa">{name || 'Sin nombre'}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-cocoa-soft">Correo</dt>
                <dd className="text-base text-cocoa">{email}</dd>
              </div>
            </dl>
            <p className="mb-2 mt-4 hidden text-[13px] text-cocoa-soft md:block">
              Qué quieres aprender
            </p>
            <div className="mt-4 md:mt-0">
              <InterestChips initial={props.interests} />
            </div>
          </section>

          <section
            id="notificaciones"
            aria-labelledby="ajustes-title"
            className="scroll-mt-28"
          >
            <h2
              id="ajustes-title"
              className="mb-4 font-serif text-[19px] font-semibold text-forest md:sr-only"
            >
              Ajustes
            </h2>
            <div className={`overflow-hidden ${CARD} md:h-full md:p-6`}>
              <h3 className="mb-2 hidden font-serif text-xl font-semibold text-forest md:block">
                Notificaciones
              </h3>
              <NotificationToggles initial={props.notifications} withIcons />
              <ul className="divide-y divide-cocoa/10 border-t border-cocoa/10 lg:hidden">
                <SupportLinks variant="rows" />
              </ul>
            </div>
          </section>
        </div>

        <div className="flex justify-center lg:hidden">
          <SignOutButton className="min-h-11 px-4 text-[15px] font-semibold text-brasa-tinta hover:text-brasa-dark disabled:opacity-50" />
        </div>
      </div>
    </div>
  );
}
