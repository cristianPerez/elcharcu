import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import {
  isServerSupabaseConfigured,
  serverSupabasePublishableKey,
  serverSupabaseUrl,
} from '@/shared/api/supabase/serverConfig';
import { attachVisitorCookie, ensureVisitorId } from '@/shared/api/visitor';

/**
 * Dos cosas en cada navegación:
 *
 * 1. Garantiza que el visitante tiene identificador ANTES de que se pinte
 *    nada. Así el layout puede leerlo y pasárselo al navegador en el primer
 *    render, sin una petición extra y sin que la primera medición se pierda.
 * 2. Refresca la sesión de Supabase. Sin esto caduca y el usuario se cae solo
 *    a mitad de un curado que dura semanas.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const visitorId = ensureVisitorId(request);

  // La cookie viaja también en la PETICIÓN, no solo en la respuesta: si no,
  // el layout de este mismo render todavía no la vería y el visitante
  // estrenaría identificador en cada recarga.
  request.cookies.set('elcharcu_vid', visitorId);

  let response = NextResponse.next({ request });

  if (!isServerSupabaseConfigured()) {
    return attachVisitorCookie(response, visitorId);
  }

  const supabase = createServerClient(
    serverSupabaseUrl(),
    serverSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Obligatorio: es la llamada que renueva el token.
  await supabase.auth.getUser();

  return attachVisitorCookie(response, visitorId);
}

export const config = {
  matcher: [
    /*
      Todo menos lo interno de Next, los iconos y las imágenes.

      ⚠️ Antes solo se excluían `_next/static` y `_next/image`, y eso dejaba
      dentro el resto de `_next/*` — sobre todo `_next/webpack-hmr`, que en
      desarrollo se pide constantemente. Cada una de esas peticiones se comía
      un `getUser()`, o sea un viaje de ida y vuelta a Supabase, para refrescar
      la sesión de algo que no es una página. Medido: un 404 de `webpack-hmr`
      tardaba 5,8 s.

      Nada de `_next/*` necesita sesión: son recursos que sirve el propio Next.
      Y `_next/data` tampoco, porque las páginas que sí la necesitan ya la
      comprueban en el layout con `currentUser()`.
    */
    '/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
