'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { Dialog } from '@/shared/ui';

import { patchProfile } from '../api/profileApi';

interface EditNameButtonProps {
  readonly initialName: string;
  readonly variant?: 'pill' | 'link' | undefined;
}

const MAX_NAME = 80;

/** "Editar": cambia cómo te llamas. Al guardar se refresca la pantalla. */
export function EditNameButton({
  initialName,
  variant = 'pill',
}: EditNameButtonProps): ReactNode {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  async function save(): Promise<void> {
    setStatus('saving');
    const ok = await patchProfile({ fullName: name.trim() });
    if (!ok) {
      setStatus('error');
      return;
    }
    setStatus('idle');
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setName(initialName);
          setStatus('idle');
          setOpen(true);
        }}
        className={
          variant === 'pill'
            ? 'min-h-11 shrink-0 rounded-full border border-cocoa/15 bg-cream-white px-4 text-sm font-semibold text-forest hover:border-cocoa/30'
            : 'min-h-11 shrink-0 text-sm font-semibold text-brasa-tinta hover:text-brasa-dark'
        }
      >
        Editar
      </button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title="Cómo te llamas"
      >
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <label className="sr-only" htmlFor="cuenta-nombre">
            Tu nombre
          </label>
          <input
            id="cuenta-nombre"
            type="text"
            value={name}
            maxLength={MAX_NAME}
            required
            autoComplete="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            className="min-h-12 w-full rounded-xl border border-cocoa/15 bg-cream px-4 text-base text-cocoa outline-none focus:border-forest"
          />
          {status === 'error' ? (
            <p role="alert" className="text-xs text-brasa-tinta">
              No se pudo guardar. Inténtalo otra vez.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={status === 'saving' || name.trim() === ''}
            className="min-h-12 rounded-full bg-brasa px-6 text-[15px] font-semibold text-cocoa hover:bg-brasa-dark disabled:opacity-50"
          >
            {status === 'saving' ? 'Guardando…' : 'Guardar'}
          </button>
        </form>
      </Dialog>
    </>
  );
}
