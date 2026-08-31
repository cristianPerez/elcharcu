'use client';

import { useState, type ReactNode } from 'react';

import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/shared/api/supabase';

/**
 * Salir de la cuenta.
 */
export function SignOutButton(): ReactNode {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClick = async (): Promise<void> => {
    if (isLeaving || !isSupabaseConfigured()) {
      return;
    }

    setIsLeaving(true);
    await createSupabaseBrowserClient().auth.signOut();

    // Recarga entera, no navegación del cliente.
    //
    // Salir tiene que dejar el navegador como si nadie hubiera entrado, y hay
    // cosas que solo se van con una recarga: la conversación que el chat
    // recuerda en memoria, el caché de rutas de Next y cualquier otro dato de
    // la sesión anterior. Con `router.replace` el siguiente que entrara en
    // este celular podía encontrarse el chat del anterior.
    //
    // Y de paso evita que esta feature tenga que importar de otra para irlas
    // limpiando una por una, que es justo lo que CLAUDE.md prohíbe.
    window.location.assign('/');
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
