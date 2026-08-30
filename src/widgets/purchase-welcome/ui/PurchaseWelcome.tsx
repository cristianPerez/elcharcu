'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';
import { appRoutes } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { ButtonLink, Container } from '@/shared/ui';

type Estado = 'comprobando' | 'con-sesion' | 'sin-sesion';

/**
 * Donde aterriza quien acaba de pagar.
 *
 * Existe porque hay DOS caminos hacia el pago y hay que atender los dos:
 *
 *   · Ya usó la app → tiene cuenta → aquí solo confirmamos y lo devolvemos.
 *   · Llegó directo al enlace (desde Instagram, un anuncio, un
 *     mensaje) → NO tiene cuenta → aquí es donde la crea, y sin esa cuenta su
 *     pago no tiene a quién atarse.
 *
 * ⚠️ Ojo con el tiempo: el comprador puede llegar aquí en cuanto paga, pero el
 * webhook que activa la suscripción puede tardar — y con PSE el pago puede
 * quedar pendiente horas. Por eso esta pantalla NO promete acceso inmediato:
 * dice que el pago llegó y que la cuenta se activa sola. Prometer lo contrario
 * es garantizarse un mensaje de "pagué y no me sirve".
 */
export function PurchaseWelcome(): ReactNode {
  const [estado, setEstado] = useState<Estado>('comprobando');

  useEffect(() => {
    track(ANALYTICS_EVENTS.purchaseLanded, {});

    if (!isSupabaseConfigured()) {
      setEstado('sin-sesion');
      return;
    }

    void createSupabaseBrowserClient()
      .auth.getUser()
      .then(({ data }) => {
        setEstado(data.user === null ? 'sin-sesion' : 'con-sesion');
      })
      .catch(() => {
        setEstado('sin-sesion');
      });
  }, []);

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-medium text-terracota-dark">Pago recibido</p>

        <h1 className="mt-3 font-serif text-[32px] font-semibold leading-[1.1] text-forest md:text-4xl">
          Bienvenido a El Charcu Pro.
        </h1>

        <p className="mt-4 text-base leading-relaxed text-cocoa/70">
          Gracias por confiar. Cristian activa tu suscripción a mano en cuanto nos
          confirme el pago — normalmente es cosa de un minuto, y si pagaste por PSE puede
          tardar un poco más.
        </p>

        <div className="mt-8 rounded-2xl border border-cocoa/10 bg-cream-white p-6 shadow-raised">
          {estado === 'comprobando' ? (
            <p className="text-sm text-cocoa/65">Un momento…</p>
          ) : estado === 'con-sesion' ? (
            <>
              <p className="text-base leading-relaxed text-cocoa/80">
                Ya estás dentro con tu cuenta. Vuelve al asistente y sigue donde ibas.
              </p>
              <ButtonLink href="/" variant="primary" className="mt-5">
                Volver al asistente
              </ButtonLink>
            </>
          ) : (
            <>
              <p className="text-base leading-relaxed text-cocoa/80">
                Falta un paso: entra con el{' '}
                <strong className="font-medium text-cocoa">mismo correo</strong> con el
                que pagaste. Es lo que ata tu pago a tu cuenta.
              </p>
              <ButtonLink href={appRoutes.login} variant="primary" className="mt-5">
                Entrar con mi correo
              </ButtonLink>
              <p className="mt-4 text-xs leading-relaxed text-cocoa/65">
                Si usas otro correo distinto al de la compra, escríbenos y lo unimos a
                mano.
              </p>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
