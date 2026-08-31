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

function labelOf(id: string): string {
  return INTERESTS.find((interest) => interest.id === id)?.label ?? id;
}

/**
 * Tus datos: en modo LECTURA, con un enlace para editarlos.
 *
 * ⚠️ El formulario estaba siempre abierto —campo de nombre, ocho categorías
 * tocables y un botón de guardar— y eso estaba mal por dos motivos (Cristian,
 * 2026-08-31, con la app ya en producción):
 *
 *   · La pestaña de cuenta se visita para MIRAR, no para editar. Lo que uno
 *     viene a comprobar es qué tiene puesto, y eso era justo lo que había que
 *     deducir mirando qué píldoras estaban encendidas.
 *   · Un formulario siempre abierto invita a tocar sin querer. En un celular,
 *     ocho botones grandes en la pantalla de cuenta son ocho oportunidades de
 *     descolocarse el perfil sin enterarse.
 *
 * Ahora se ve el nombre y los intereses como texto, y un "Editar" que abre el
 * formulario. Al guardar se vuelve a cerrar solo: la edición es un momento, no
 * un estado.
 */
export function EditProfile({
  initialName,
  initialInterests,
}: EditProfileProps): ReactNode {
  const [name, setName] = useState(initialName);
  const [chosen, setChosen] = useState<readonly InterestId[]>(initialInterests);
  const [isEditing, setIsEditing] = useState(false);
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

    const ok = response !== null && response.ok;

    track(ANALYTICS_EVENTS.profileUpdated, {
      how_many: chosen.length,
      interests: chosen.join(','),
    });

    setState(ok ? 'saved' : 'idle');
    // Solo se cierra si se guardó. Si falló, el formulario se queda abierto con
    // lo que escribió: cerrarlo perdería el cambio y encima parecería que sí.
    if (ok) {
      setIsEditing(false);
    }
  }

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium text-cocoa/65">Tus datos</h2>
        {isEditing ? null : (
          <button
            type="button"
            onClick={() => {
              setState('idle');
              setIsEditing(true);
            }}
            className="text-sm font-medium text-terracota-dark transition-colors hover:text-terracota"
          >
            Editar
          </button>
        )}
      </div>

      <div className="mt-3 rounded-2xl border border-cocoa/10 bg-cream-white p-5">
        {isEditing ? (
          <>
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

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  // Se descarta lo tecleado y se vuelve a lo que hay guardado.
                  setName(initialName);
                  setChosen(initialInterests);
                  setIsEditing(false);
                  setState('idle');
                }}
                className="flex-1 rounded-xl border border-cocoa/15 px-5 py-3 text-sm font-medium text-cocoa/70 transition-colors hover:border-cocoa/30"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!canSave}
                onClick={() => {
                  void save();
                }}
                className="flex-[2] rounded-xl bg-forest px-5 py-3 text-sm font-medium text-cream-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state === 'saving' ? 'Guardando…' : 'Guardar'}
              </button>
            </div>

            {chosen.length === 0 ? (
              <p className="mt-2 text-center text-xs text-terracota-dark">
                Deja al menos uno: es lo que usa El Charcu para saber de qué hablarte.
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="text-xs text-cocoa/50">Cómo te llamas</p>
            <p className="mt-0.5 text-base text-cocoa">
              {name === '' ? 'Sin nombre' : name}
            </p>

            <p className="mt-5 text-xs text-cocoa/50">Qué quieres aprender</p>
            {chosen.length === 0 ? (
              <p className="mt-1 text-sm text-cocoa/55">Todavía no has elegido nada.</p>
            ) : (
              /* Píldoras sin borde ni sombra: aquí no se tocan, solo se leen.
                 Con el mismo aspecto de los botones, el ojo pide un clic que
                 no va a pasar nada. */
              <ul className="mt-2 flex flex-wrap gap-2">
                {chosen.map((id) => (
                  <li
                    key={id}
                    className="rounded-full bg-cream px-3.5 py-1.5 text-sm text-cocoa/75"
                  >
                    {labelOf(id)}
                  </li>
                ))}
              </ul>
            )}

            {state === 'saved' ? (
              <p className="mt-4 text-sm font-medium text-forest">Guardado ✓</p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
