'use client';

import { useState, type FormEvent, type ReactNode } from 'react';

import { StepShell } from './StepShell';

interface ContactStepProps {
  readonly stepIndex: number;
  readonly isSaving: boolean;
  readonly error: string | null;
  readonly onSubmit: (name: string, phone: string, consent: boolean) => void;
  readonly onBack: () => void;
}

/**
 * El segundo y último paso: nombre y WhatsApp, en un solo formulario.
 *
 * Eran dos pantallas y se juntaron: los dos son campos de texto, y en el
 * celular cada pantalla de más es un teclado que se abre y se cierra.
 *
 * ⚠️ El NOMBRE es obligatorio; el WHATSAPP no. Es la única forma honesta de
 * hacer obligatorio el formulario entero: se exige lo que hace falta para
 * saludar a alguien por su nombre, y se pide —sin exigir— lo que es dato
 * personal sensible. Si el teléfono fuera obligatorio, el "formulario que tapa
 * la app" pasaría a ser un peaje, y el número que dejaría la gente sería falso.
 *
 * ⚠️ Sin la casilla marcada el número no se manda (Ley 1581 de 2012). Y no se
 * verifica que exista: Cristian dejó fuera del lanzamiento el flujo de código
 * por WhatsApp, así que habrá números mal escritos y se asume.
 */
export function ContactStep({
  stepIndex,
  isSaving,
  error,
  onSubmit,
  onBack,
}: ContactStepProps): ReactNode {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  const canSubmit = name.trim() !== '' && !isSaving;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    onSubmit(name, phone, consent);
  }

  return (
    <StepShell
      stepIndex={stepIndex}
      title="¿Cómo te llamas?"
      why="Para hablarte por tu nombre y no como a un usuario. El WhatsApp es opcional: es por donde Cristian avisa cuando se abre un curso que estabas esperando."
      onBack={onBack}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="onboarding-nombre" className="text-xs text-cocoa/50">
          Tu nombre
        </label>
        <input
          id="onboarding-nombre"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          placeholder="Cristian"
          autoComplete="given-name"
          maxLength={80}
          autoFocus
          className="mt-1.5 w-full rounded-2xl border border-cocoa/15 bg-cream-white px-5 py-4 font-serif text-lg text-forest shadow-surface placeholder:text-cocoa/30 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30"
        />

        <label htmlFor="onboarding-whatsapp" className="mt-5 block text-xs text-cocoa/50">
          Tu WhatsApp · opcional
        </label>
        <input
          id="onboarding-whatsapp"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
          }}
          placeholder="+57 300 123 4567"
          autoComplete="tel"
          maxLength={24}
          className="mt-1.5 w-full rounded-2xl border border-cocoa/15 bg-cream-white px-5 py-4 font-serif text-lg text-forest shadow-surface placeholder:text-cocoa/30 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30"
        />

        {phone.trim() === '' ? null : (
          <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-cocoa/70">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
              }}
              className="mt-0.5 size-4 shrink-0 accent-terracota"
            />
            <span>
              Autorizo que El Charcu guarde mi número para escribirme sobre los cursos.
              Puedo pedir que lo borren cuando quiera en hola@elcharcu.co — Ley 1581/2012.
            </span>
          </label>
        )}

        {error === null ? null : (
          <p className="mt-4 rounded-xl bg-terracota/10 px-4 py-3 text-sm text-terracota-dark">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 w-full rounded-2xl bg-terracota-dark px-5 py-4 font-medium text-cream-white shadow-surface transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? 'Guardando…' : 'Entrar a El Charcu'}
        </button>
      </form>
    </StepShell>
  );
}
