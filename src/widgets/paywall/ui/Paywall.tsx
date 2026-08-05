import { type ReactNode } from 'react';

import { curingProductName, isCuringProductId } from '@/entities/curing-profile';
import { formatCop, oneTimeCourseCop } from '@/entities/plan';

import { appRoutes } from '@/shared/config';
import { Container, Eyebrow } from '@/shared/ui';

import { PaywallPlans } from './PaywallPlans';

interface PaywallProps {
  /** La receta que intentó empezar, si viene en la URL. */
  readonly attemptedProduct: string | null;
}

/**
 * El muro. Aparece al empezar la SEGUNDA receta.
 * El tono es de valor, no de escasez: no le quitamos nada, le ofrecemos seguir.
 */
export function Paywall({ attemptedProduct }: PaywallProps): ReactNode {
  const attempted = isCuringProductId(attemptedProduct)
    ? curingProductName(attemptedProduct).toLowerCase()
    : null;

  return (
    <Container className="py-14 md:py-20">
      <div className="max-w-2xl">
        <Eyebrow className="text-sage">Ya usaste tu receta gratis</Eyebrow>

        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] text-cream md:text-5xl">
          Salva tu próximo kilo de carne.
        </h1>

        <p className="mt-6 text-base leading-relaxed text-cream/75">
          {attempted === null
            ? 'Tu primera receta ya la curaste con el asistente al lado, sin pagar nada.'
            : `Para abrir tu ${attempted} necesitas la suscripción. Tu primera receta ya la curaste con el asistente al lado, sin pagar nada.`}{' '}
          De aquí en adelante son recetas ilimitadas — y con lo que vale una pieza echada
          a perder, el plan se paga solo.
        </p>
      </div>

      <PaywallPlans />

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

      <p className="mt-8 text-sm leading-relaxed text-cream/55">
        Pagas en pesos colombianos con Nequi, PSE o tarjeta. Nada en dólares. Cancelas
        cuando quieras, sin llamar a nadie.
      </p>

      <div className="border-cream/12 mt-10 border-t pt-8">
        <a
          href={appRoutes.session}
          className="text-sm text-cream/60 underline underline-offset-4 transition-colors hover:text-cream"
        >
          Seguir con la receta que ya tengo abierta
        </a>
        <p className="mt-2 text-xs leading-relaxed text-cream/40">
          Nunca te cerramos una receta empezada. Un curado dura semanas y esa pieza es
          tuya hasta el final, pagues o no.
        </p>
      </div>
    </Container>
  );
}
