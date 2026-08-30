'use client';

import { useEffect, useState, type ReactNode } from 'react';

import {
  hydrateProfileFromSupabase,
  loadProfile,
  saveProfile,
} from '@/entities/curing-profile';

import { INTERESTS, MAX_INTERESTS, type InterestId } from '@/shared/config';
import { ANALYTICS_EVENTS, track } from '@/shared/lib';

type SaveState = 'idle' | 'saving' | 'saved';

interface EditProfileProps {
  /** El nombre que ya está en la base. La pantalla lo lee en el servidor. */
  readonly initialName: string;
  readonly initialInterests: readonly InterestId[];
}

/**
 * Cambiar nombre e intereses desde la cuenta.
 *
 * Existe porque el onboarding se pide UNA vez y los gustos cambian: alguien
 * entra queriendo chorizos y a los dos meses está con quesos. Sin esta
 * pantalla, el panel y el Charcu AI se quedarían configurados para siempre con
 * lo que contestó el primer día.
 *
 * Guarda solo al tocar el botón, y no en cada clic como el onboarding: aquí no
 * hay abandono del que aprender —ya es usuario— y sí hay el riesgo de dejarle
 * el perfil a medias mientras piensa cuál quitar.
 */
export function EditProfile({
  initialName,
  initialInterests,
}: EditProfileProps): ReactNode {
  const [name, setName] = useState(initialName);
  const [chosen, setChosen] = useState<readonly InterestId[]>(initialInterests);
  const [state, setState] = useState<SaveState>('idle');

  // Si en otro dispositivo cambió sus intereses, esta pantalla tiene que
  // enterarse: es justo donde alguien viene a comprobar qué tiene puesto.
  useEffect(() => {
    void hydrateProfileFromSupabase().then((profile) => {
      if (profile !== null) {
        setChosen(profile.interests);
      }
    });
  }, []);

  const isFull = chosen.length >= MAX_INTERESTS;
  const canSave = chosen.length > 0 && state !== 'saving';

  function toggle(id: InterestId): void {
    setState('idle');
    setChosen((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= MAX_INTERESTS
          ? current
          : [...current, id],
    );
  }

  async function save(): Promise<void> {
    setState('saving');

    saveProfile({
      interests: chosen,
      createdAt: loadProfile()?.createdAt ?? new Date().toISOString(),
    });

    const response = await fetch('/api/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, interests: chosen }),
    }).catch(() => null);

    track(ANALYTICS_EVENTS.profileUpdated, {
      how_many: chosen.length,
      interests: chosen.join(','),
    });

    setState(response !== null && response.ok ? 'saved' : 'idle');
  }

  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium text-cocoa/65">Tus datos</h2>

      <div className="mt-3 rounded-2xl border border-cocoa/10 bg-cream-white p-5">
        <label htmlFor="cuenta-nombre" className="text-xs text-cocoa/50">
          Cómo te llamas
        </label>
        <input
          id="cuenta-nombre"
          type="text"
          value={name}
          maxLength={80}
          onChange={(event) => {
            setName(event.target.value);
            setState('idle');
          }}
          placeholder="Tu nombre"
          className="mt-1.5 w-full rounded-xl border border-cocoa/15 bg-cream px-4 py-3 text-base text-cocoa placeholder:text-cocoa/30 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/25"
        />

        <p className="mt-5 text-xs text-cocoa/50">
          Qué quieres aprender · hasta {MAX_INTERESTS}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const isChosen = chosen.includes(interest.id);
            return (
              <li key={interest.id}>
                <button
                  type="button"
                  aria-pressed={isChosen}
                  disabled={!isChosen && isFull}
                  onClick={() => {
                    toggle(interest.id);
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:opacity-35 ${
                    isChosen
                      ? 'border-terracota bg-terracota/10 text-forest'
                      : 'border-cocoa/15 text-cocoa/70'
                  }`}
                >
                  {interest.label}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          disabled={!canSave}
          onClick={() => {
            void save();
          }}
          className="mt-5 w-full rounded-xl bg-forest px-5 py-3 text-sm font-medium text-cream-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state === 'saving'
            ? 'Guardando…'
            : state === 'saved'
              ? 'Guardado ✓'
              : 'Guardar'}
        </button>

        {chosen.length === 0 ? (
          <p className="mt-2 text-center text-xs text-terracota-dark">
            Deja al menos uno: es lo que usa El Charcu para saber de qué hablarte.
          </p>
        ) : null}
      </div>
    </section>
  );
}
