'use client';

import { useState, type ReactNode } from 'react';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { Dialog } from '@/shared/ui';

/** "Cómo funciona la seguridad": un enlace discreto que abre la explicación. */
export function SafetyLink(): ReactNode {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track(ANALYTICS_EVENTS.assistantSafetyOpened, {});
        }}
        className="min-h-11 text-[13px] text-cocoa-soft underline underline-offset-2 hover:text-cocoa"
      >
        Cómo funciona la seguridad
      </button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title="Cómo funciona la seguridad"
      >
        <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-cocoa-soft">
          <p>
            El Charcu acompaña tu criterio, no lo reemplaza. Nunca recomienda más de 2,5 g
            de sal de cura #1 por kilo, y cada respuesta pasa por un revisor de dosis
            antes de llegarte.
          </p>
          <p>Ante un moho dudoso siempre dice descartar. La decisión final es tuya.</p>
        </div>
      </Dialog>
    </>
  );
}
