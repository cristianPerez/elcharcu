import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { isSupabaseConfigured, supabaseConfig } from '@/shared/api/supabase';

/**
 * Refresca la sesión en cada navegación. Sin esto, la sesión caduca y el
 * usuario se cae solo a mitad de un curado que dura semanas.
 *
 * Si todavía no hay credenciales, deja pasar todo sin tocar nada.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.publishableKey, {
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
  });

  // Obligatorio: es la llamada que renueva el token.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Todo menos estáticos, imágenes y el favicon.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
