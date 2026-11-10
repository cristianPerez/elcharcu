import { NextResponse, type NextRequest } from 'next/server';

import { sendRenewalReminders } from '@/features/renewal-reminder';

import { createSupabaseAdminClient } from '@/shared/api/supabase/server';

/**
 * El aviso diario de "tu mes de Pro termina" a quien pagó por fuera de OnePay (cron de Vercel, ver
 * `vercel.json`). Vercel manda `Authorization: Bearer $CRON_SECRET`; sin ese
 * secreto configurado, no sale nada.
 *
 * A quién: SOLO las cuentas de `RENOVACION_AVISO_USUARIOS` (ids separados por
 * coma). Vacía, el cron corre y no manda nada: así se aprueba cada persona.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET ?? '';
  if (secret === '' || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  const allowedUserIds = (process.env.RENOVACION_AVISO_USUARIOS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id !== '');

  const results = await sendRenewalReminders(createSupabaseAdminClient(), {
    allowedUserIds,
    checkoutMode: process.env.VERCEL_ENV === 'production' ? 'produccion' : 'pruebas',
  });
  return NextResponse.json({ enviados: results.filter((r) => r.sent).length, results });
}
