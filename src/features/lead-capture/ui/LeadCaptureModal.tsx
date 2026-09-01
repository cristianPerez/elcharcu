'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';

import { markLeadCaptured } from '../lib/leadFlag';
import { sendAccountLink } from '../lib/sendAccountLink';
import { type LeadWallSource } from '../model/useLeadWall';

interface LeadCaptureModalProps {
  /** Preguntas que gana al dejar el correo. Lo dice la base, no la pantalla. */
  readonly questionsLimit: number;
  /** Cerrarlo sin dejar el correo. Devuelve la página, no el cupo. */
  readonly onClose: () => void;
  /**
   * De dónde salió este muro.
   *
   * ⚠️ Es lo único que contesta "¿de qué receta vino este correo?". Sin esto,
   * `leadCaptured` dice cuántos correos entraron y nada más — y con cuatro CTA
   * repartidos por 45 recetas, saber cuántos sin saber de dónde no sirve para
   * decidir nada.
   */
  readonly source: LeadWallSource;
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
 * ⚠️ SE PUEDE CERRAR (2026-09-01, pedido de Cristian). Hasta hoy no tenía
 * salida: se abría encima de la receta y ahí se quedaba, así que quien no
 * quisiera dejar su correo tampoco podía seguir LEYENDO. En una página a la que
 * se llega desde Google eso no convence a nadie — solo hace que se vaya.
 *
 * Cerrarlo devuelve la PÁGINA, no el cupo: sin cuenta sigue sin poder
 * preguntar, y el muro vuelve en cuanto lo intente. El correo se pide, no se
 * cobra.
 *
 * Lo que NO se cierra solo es el aviso de "te mandamos un enlace": eso lo
 * retira la sesión al aparecer, que es lo único que prueba que la cuenta
 * existe. Antes se cerraba en cuanto se enviaba el correo, así que ni siquiera
 * se llegaba a leer el "míralo en spam".
 *
 * La conversación anterior NO se recupera si abre el enlace en otro
 * dispositivo: la receta anónima cuelga de la cookie de este navegador. Es
 * consciente y aceptado para el lanzamiento — se entra a un chat limpio.
 */
export function LeadCaptureModal({
  questionsLimit,
  onClose,
  source,
}: LeadCaptureModalProps): ReactNode {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'form' | 'sending' | 'sent'>('form');

  const isSending = phase === 'sending';
  const wasSent = phase === 'sent';

  // Escape cierra. Es lo primero que se intenta antes de buscar la X.
  useEffect(() => {
    const alPulsar = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', alPulsar);
    return () => {
      window.removeEventListener('keydown', alPulsar);
    };
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (isSending) {
      return;
    }

    setError(null);
    setPhase('sending');
    const clean = email.trim();

    /*
      Mandar el enlace ES guardar el contacto (2026-08-31).

      Antes esto escribía primero en `charcu.leads` y después pedía el enlace,
      con el argumento de que si el correo fallaba al menos quedaba el contacto.
      El argumento era falso: `signInWithOtp` crea la fila en `auth.users` en
      cuanto se pide el enlace, confirmen o no. Comprobado en producción, hay un
      correo mal escrito ahí sin confirmar y sin perfil.

      Así que `leads` guardaba una copia del correo que Supabase ya tenía. Se
      borró la tabla y con ella este paso.
    */
    const sent = await sendAccountLink(clean);
    track(ANALYTICS_EVENTS.accountLinkSent, {
      delivered: sent,
      place: source.place,
      recipe_slug: source.recipeSlug ?? '',
    });

    if (!sent) {
      setError('No pudimos mandarte el enlace. Revisa el correo e inténtalo otra vez.');
      setPhase('form');
      return;
    }

    markLeadCaptured();
    track(ANALYTICS_EVENTS.leadCaptured, {
      step: 'correo',
      place: source.place,
      recipe_slug: source.recipeSlug ?? '',
    });

    setPhase('sent');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Deja tu correo para seguir preguntando"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar y seguir leyendo"
        onClick={onClose}
        className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-cocoa/10 bg-cream-white p-6 shadow-raised md:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-lg text-2xl leading-none text-cocoa/45 transition-colors hover:bg-cream hover:text-cocoa/70"
        >
          ×
        </button>

        {wasSent ? (
          <>
            <h2 className="font-serif text-2xl font-semibold text-forest md:text-3xl">
              Te mandamos un enlace
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cocoa/70">
              Ábrelo{' '}
              <strong className="font-medium text-cocoa">en este mismo aparato</strong> y
              entras directo a seguir preguntando. Si no llega en un minuto, mira en spam.
            </p>
            <p className="mt-4 text-sm font-medium text-cocoa">{email.trim()}</p>
            <button
              type="button"
              onClick={() => {
                setPhase('form');
              }}
              className="mt-6 text-sm font-medium text-terracota-dark underline underline-offset-4 hover:text-terracota"
            >
              Usar otro correo
            </button>
          </>
        ) : (
          <>
            <h2 className="font-serif text-2xl font-semibold text-forest md:text-3xl">
              Te gustó, ¿verdad?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cocoa/70">
              Déjanos tu correo y sigues con {questionsLimit} preguntas al mes, gratis.
              Sin contraseña: te mandamos un enlace, lo abres y listo.
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

              {/* La salida dicha con palabras. La X de la esquina la ve quien
                  la busca; esto lo lee quien se siente acorralado. */}
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full text-sm font-medium text-cocoa/65 underline underline-offset-4 hover:text-cocoa"
              >
                Ahora no, sigo leyendo la receta
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
