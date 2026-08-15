'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

import { markLeadCaptured } from '../lib/leadFlag';
import { submitLead } from '../lib/submitLead';
import type { LeadCaptureState } from '../model/types';

interface LeadCaptureModalProps {
  /** Preguntas que gana al dejar los datos. Lo dice la base, no la pantalla. */
  readonly questionsLimit: number;
  readonly imagesLimit: number;
  readonly onSuccess: () => void;
}

/**
 * Muro blando de captura: nombre, correo y WhatsApp.
 *
 * Aparece tras la primera respuesta del asistente. Es el momento de máximo
 * interés —el usuario acaba de comprobar que el producto funciona— y todavía
 * no le hemos cobrado nada.
 *
 * ⚠️ Incluye nota de privacidad (Ley 1581/2012 de Colombia).
 */
export function LeadCaptureModal({
  questionsLimit,
  imagesLimit,
  onSuccess,
}: LeadCaptureModalProps): ReactNode {
  const [state, setState] = useState<LeadCaptureState>({ status: 'idle' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (state.status === 'submitting') {
      return;
    }

    setState({ status: 'submitting' });

    const result = await submitLead({ name, email, whatsapp });

    if (result.ok) {
      setState({ status: 'success' });
      markLeadCaptured();
      onSuccess();
    } else {
      setState({
        status: 'error',
        message: result.error ?? 'No pudimos guardar tus datos.',
      });
    }
  };

  const isSubmitting = state.status === 'submitting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/95 p-4">
      <div className="w-full max-w-md rounded-2xl border border-cream/15 bg-forest p-6 shadow-2xl md:p-8">
        <h2 className="font-serif text-2xl font-semibold text-cream md:text-3xl">
          Te gustó, ¿verdad?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-cream/75">
          Déjanos tu nombre, correo y WhatsApp y sigues con {questionsLimit} preguntas y{' '}
          {imagesLimit} fotos al mes, gratis. Sin contraseña y sin compromiso.
        </p>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-cream/90">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-lg border border-cream/20 bg-forest px-4 py-2.5 text-cream placeholder-cream/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/50 disabled:opacity-50"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cream/90">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-lg border border-cream/20 bg-forest px-4 py-2.5 text-cream placeholder-cream/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/50 disabled:opacity-50"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-cream/90">
              WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-lg border border-cream/20 bg-forest px-4 py-2.5 text-cream placeholder-cream/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/50 disabled:opacity-50"
              placeholder="+57 300 123 4567"
            />
          </div>

          {state.status === 'error' ? (
            <p className="rounded-lg border border-terracota/40 bg-terracota/10 px-3 py-2 text-sm text-cream">
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-terracota px-6 py-3 font-medium text-cream transition-colors hover:bg-terracota/90 focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 focus:ring-offset-forest disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando…' : 'Continuar usando el asistente'}
          </button>

          <p className="text-xs leading-relaxed text-cream/50">
            Al continuar, aceptas que usemos estos datos para contactarte sobre El Charcu
            y personalizar tu experiencia. Puedes pedirnos borrarlos en cualquier momento
            escribiéndonos a hola@elcharcu.co — Ley 1581/2012.
          </p>
        </form>
      </div>
    </div>
  );
}
