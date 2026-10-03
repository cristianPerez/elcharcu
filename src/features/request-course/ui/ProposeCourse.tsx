'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { IconChevron, IconClose, IconPlus } from '@/shared/ui';

import { sendCourseRequest } from '../api/requestApi';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const MAX_LENGTH = 280;

/**
 * "¿Qué pieza quieres aprender?": proponer un curso con tus palabras.
 *
 * La fila abre un `<dialog>` nativo con un campo de texto. Al enviar se
 * queda abierto dando las gracias: cerrarlo de golpe haría dudar de si llegó.
 */
export function ProposeCourse(): ReactNode {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function submit(): Promise<void> {
    setStatus('sending');
    const ok = await sendCourseRequest({ body: text.trim() });
    setStatus(ok ? 'sent' : 'error');
    if (ok) {
      setText('');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStatus('idle');
          setOpen(true);
        }}
        className="flex min-h-16 w-full items-center gap-4 rounded-card border border-cocoa/10 bg-cream-white p-4 text-left transition-colors hover:border-cocoa/20"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brasa text-cocoa">
          <IconPlus size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-cocoa">
            ¿Qué pieza quieres aprender?
          </span>
          <span className="block text-sm text-cocoa-soft">Propón un curso nuevo</span>
        </span>
        <IconChevron size={18} className="shrink-0 text-cocoa-muted" />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="propose-title"
        className="w-[min(92vw,460px)] rounded-card bg-cream-white p-0 text-cocoa backdrop:bg-cocoa/40"
      >
        <div className="relative p-6">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => {
              setOpen(false);
            }}
            className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-cocoa-soft hover:bg-cream"
          >
            <IconClose size={18} />
          </button>
          <h2
            id="propose-title"
            className="pr-10 font-serif text-xl font-semibold text-forest"
          >
            ¿Qué pieza quieres aprender?
          </h2>

          {status === 'sent' ? (
            <p role="status" className="mt-3 text-[15px] leading-relaxed text-cocoa-soft">
              Anotado. Los cursos más pedidos son los que se graban primero.
            </p>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}
              className="mt-4 flex flex-col gap-3"
            >
              <label className="text-sm text-cocoa-soft" htmlFor="propose-body">
                Cuéntanos qué te gustaría hacer: una pieza, una técnica, un plato.
              </label>
              <textarea
                id="propose-body"
                value={text}
                maxLength={MAX_LENGTH}
                rows={4}
                required
                minLength={3}
                onChange={(event) => {
                  setText(event.target.value);
                }}
                placeholder="Ej.: pastrami de res ahumado"
                className="w-full resize-none rounded-xl border border-cocoa/15 bg-cream p-3 text-[15px] text-cocoa outline-none placeholder:text-cocoa-muted focus:border-forest"
              />
              {status === 'error' ? (
                <p role="alert" className="text-xs text-brasa-tinta">
                  No se pudo enviar. Inténtalo otra vez.
                </p>
              ) : null}
              <button
                type="submit"
                disabled={status === 'sending' || text.trim().length < 3}
                className="min-h-12 rounded-full bg-brasa px-6 text-[15px] font-semibold text-cocoa transition-colors hover:bg-brasa-dark disabled:opacity-50"
              >
                {status === 'sending' ? 'Enviando…' : 'Proponer curso'}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
