import { NextResponse } from 'next/server';

import {
  serverSupabasePublishableKey,
  serverSupabaseSecretKey,
  serverSupabaseUrl,
} from '@/shared/api/supabase/serverConfig';

/**
 * Qué configuración ve ESTE despliegue. Diagnóstico, no producto.
 *
 * Nace de una mañana entera perdida (QA, 2026-08-19): las `NEXT_PUBLIC_*`
 * estaban marcadas como *Sensitive* en Vercel, la app quedó sin credenciales y
 * el único síntoma era una pantalla diciendo "vuelve en un rato". Desde fuera
 * no había forma de saber si faltaba una variable, si estaba mal escrita, si el
 * despliegue era viejo o si Supabase estaba caído. Cuatro causas, un solo
 * síntoma.
 *
 * ⚠️ NO DEVUELVE NI UN VALOR. Solo `true`/`false` y la longitud, que sirve para
 * detectar el clásico "la pegué con comillas" sin enseñar nada. Ni siquiera la
 * URL, que es pública: si algún día alguien añade aquí un valor "que no es
 * secreto", esto deja de ser seguro de tener abierto.
 *
 * Lo importante: `publicUrl` y `publicKey` se leen del MISMO valor incrustado
 * que usa el navegador. Si aquí salen en `false`, el navegador también las ve
 * vacías — sin tener que abrir las herramientas de desarrollo.
 */
function describe(value: string): { readonly ok: boolean; readonly length: number } {
  return { ok: value !== '', length: value.length };
}

export async function GET(): Promise<NextResponse> {
  // Se leen tal cual, sin el respaldo, para saber qué falta DE VERDAD.
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

  const config = {
    /** Incrustadas al compilar. Si están en `false`, el navegador está ciego. */
    publicUrl: describe(publicUrl),
    publicKey: describe(publicKey),
    /** El respaldo del servidor, leído al ejecutar. */
    serverUrl: describe(process.env.SUPABASE_URL ?? ''),
    serverKey: describe(process.env.SUPABASE_PUBLISHABLE_KEY ?? ''),
    secretKey: describe(serverSupabaseSecretKey()),
    gemini: describe(process.env.GEMINI_API_KEY ?? ''),
    mixpanel: describe(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? ''),
  };

  // Y una llamada de verdad, para separar "falta configuración" de "Supabase
  // no responde". Son dos problemas distintos con soluciones opuestas: uno se
  // arregla en el panel y el otro se arregla esperando.
  const url = serverSupabaseUrl();
  const key = serverSupabasePublishableKey();
  let database = 'sin-credenciales';

  if (url !== '' && key !== '') {
    try {
      const response = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: key },
        cache: 'no-store',
      });
      database = response.ok ? 'responde' : `error-${String(response.status)}`;
    } catch {
      database = 'no-responde';
    }
  }

  return NextResponse.json(
    {
      config,
      database,
      /** Qué build es este, para saber si estás mirando el que crees. */
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
      branch: process.env.VERCEL_GIT_COMMIT_REF ?? 'local',
      environment: process.env.VERCEL_ENV ?? 'local',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
