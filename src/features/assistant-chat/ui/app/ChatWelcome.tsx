import { type ReactNode } from 'react';

import { IconCharcu } from '@/shared/ui';

/** El saludo del chat en blanco: el avatar y "¿Qué vas a preparar hoy?". */
export function ChatWelcome(): ReactNode {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-forest text-brasa"
      >
        <IconCharcu size={18} />
      </span>
      <p className="font-serif text-2xl font-semibold text-forest md:text-[28px]">
        ¿Qué vas a preparar hoy?
      </p>
    </div>
  );
}
