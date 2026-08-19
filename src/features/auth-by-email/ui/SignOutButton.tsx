'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';

/**
 * Salir de la cuenta.
 *
 * Después de cerrar sesión se hace `refresh()` además de navegar: sin eso el
 * caché de rutas de Next puede devolver la pantalla de la app ya pintada, y el
 * usuario ve durante un segundo la cuenta de la que acaba de salir.
 */
export function SignOutButton(): ReactNode {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClick = async (): Promise<void> => {
    if (isLeaving || !isSupabaseConfigured()) {
      return;
    }

    setIsLeaving(true);
    await createSupabaseBrowserClient().auth.signOut();
    router.replace('/');
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={isLeaving}
      onClick={() => {
        void handleClick();
      }}
      className="w-full rounded-xl border border-cocoa/15 px-4 py-3 text-base font-medium text-cocoa/70 transition-colors hover:border-cocoa/25 hover:text-cocoa focus:outline-none focus:ring-2 focus:ring-terracota/30 active:scale-[0.98] disabled:opacity-50"
    >
      {isLeaving ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
