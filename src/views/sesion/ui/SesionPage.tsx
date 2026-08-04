import Link from 'next/link';
import { type ReactNode } from 'react';

import { FreeSession } from '@/widgets/free-session';

import { Logo } from '@/shared/ui';

/** Marco de la sesión de curado. Solo composición. */
export function SesionPage(): ReactNode {
  return (
    <div className="bg-grain flex min-h-screen flex-col bg-forest">
      <header className="border-b border-cream/10 px-6 py-6 md:px-10">
        <Link href="/asistente" aria-label="Volver a El Charcu">
          <Logo tone="light" />
        </Link>
      </header>

      <main className="flex-1">
        <FreeSession />
      </main>
    </div>
  );
}
