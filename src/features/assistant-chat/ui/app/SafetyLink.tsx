'use client';

import { useState, type ReactNode } from 'react';

import { SafetyExplainer } from '@/entities/cure-safety';

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
        <SafetyExplainer />
      </Dialog>
    </>
  );
}
