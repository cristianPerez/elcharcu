'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { markLeadCaptured } from '../lib/leadFlag';
import { sendAccountLink } from '../lib/sendAccountLink';
import { submitLead } from '../lib/submitLead';

interface LeadCaptureModalProps {
  /** Preguntas que gana al dejar el correo. Lo dice la base, no la pantalla. */
  readonly questionsLimit: number;
  readonly onSuccess: () => void;
}

/**
 * La ÚNICA vez que pedimos el correo.
 *
 * Aparece tras la primera respuesta: el momento de máximo interés, cuando ya
 * comprobó que funciona y todavía no le hemos cobrado nada.
 *
 * Antes pedía nombre, correo y WhatsApp y NO creaba cuenta, así que el correo
 * se volvía a pedir en `/entrar` y otra vez en Hotmart. Ahora este formulario
 * crea la cuenta: guarda el lead y manda el enlace de entrada. Nombre y
 * WhatsApp se piden después, cuando haya algo que dar a cambio.
 *
 * ⚠️ Se pide validar el correo para seguir (decisión de Cristian, 2026-08-15).
 * Si algún día la espera del correo resulta cara en conversión, el cambio es
 * llamar a `onSuccess()` justo tras enviar el enlace en vez de esperar: se
 * sigue chateando y el enlace solo sirve para guardar las recetas.
 */
export function LeadCaptureModal({
  questionsLimit,
  onSuccess,
}: LeadCaptureModalProps): ReactNode {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'form' | 'sending' | 'sent'>('form');

  const isSending = phase === 'sending';
  const wasSent = phase === 'sent';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (isSending) {
      return;
    }

    setError(null);
    setPhase('sending');
    const clean = email.trim();

    // El lead se guarda ANTES de mandar el enlace: si el correo falla, al menos
    // tenemos el contacto. Al revés perderíamos las dos cosas.
    const saved = await submitLead({ email: clean });
    if (!saved.ok) {
      setError(saved.error ?? 'No pudimos guardar tu correo.');
      setPhase('form');
      return;
    }

    markLeadCaptured();
    track(ANALYTICS_EVENTS.leadCaptured, { step: 'correo' });

    const sent = await sendAccountLink(clean);
    setPhase('sent');
    track(ANALYTICS_EVENTS.accountLinkSent, { delivered: sent });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-cocoa/10 bg-cream-white p-6 shadow-raised md:p-8">
        {wasSent ? (
          <>
            <h2 className="font-serif text-2xl font-semibold text-forest md:text-3xl">
              Te mandamos un enlace
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cocoa/70">
              Ábrelo desde este mismo celular y sigues donde ibas, con tus recetas
              guardadas. Si no llega en un minuto, mira en spam.
            </p>
            <p className="mt-4 text-sm font-medium text-cocoa">{email.trim()}</p>
          </>
        ) : (
          <>
            <h2 className="font-serif text-2xl font-semibold text-forest md:text-3xl">
              Te gustó, ¿verdad?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cocoa/70">
              Déjanos tu correo y sigues con {questionsLimit} preguntas al mes, gratis.
              Sin contraseña: te mandamos un enlace y listo.
            </p>

            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className="mt-6"
            >
              <label
                htmlFor="lead-email"
                className="block text-sm font-medium text-cocoa/80"
              >
                Tu correo
              </label>
              <input
                type="email"
                id="lead-email"
                required
                autoFocus
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                disabled={isSending}
                placeholder="tunombre@correo.com"
                className="mt-2 w-full rounded-xl border border-cocoa/15 bg-cream px-4 py-3 text-base text-cocoa placeholder-cocoa/65 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30 disabled:opacity-50"
              />

              {error === null ? null : (
                <p className="mt-3 rounded-xl border border-terracota/40 bg-terracota/10 px-3 py-2 text-sm text-cocoa">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="mt-4 w-full rounded-full bg-terracota-dark px-6 py-3 font-medium text-cream-white shadow-surface transition-shadow hover:shadow-raised focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 active:scale-[0.97] disabled:opacity-50"
              >
                {isSending ? 'Enviando…' : 'Mandarme el enlace'}
              </button>

              <p className="mt-4 text-xs leading-relaxed text-cocoa/65">
                Usamos tu correo para darte acceso y contarte cosas de El Charcu. Puedes
                pedirnos borrarlo cuando quieras en hola@elcharcu.co — Ley 1581/2012.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
