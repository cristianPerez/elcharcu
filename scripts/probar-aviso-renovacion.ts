/**
 * Manda el aviso de renovación de UNA cuenta a OTRA dirección, para aprobarlo
 * antes de que le llegue a la persona.
 *
 *     npx tsx scripts/probar-aviso-renovacion.ts <ruta/.env> <user_id> <correo-de-prueba>
 *
 * Lee los datos reales de la cuenta (del .env que se le pasa) y usa los
 * enlaces de OnePay de producción. NUNCA escribe a la persona: el destino es
 * siempre el tercer argumento.
 */
import { readFileSync } from 'node:fs';

import { createClient } from '@supabase/supabase-js';

import { sendRenewalReminders } from '../src/features/renewal-reminder';
import { type Database } from '../src/shared/api/supabase/database.types';

function loadEnv(path: string): void {
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = /^([A-Z_]+)=(.*)$/.exec(line);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function main(): Promise<void> {
  const [envPath, userId, testTo] = process.argv.slice(2);
  if (envPath === undefined || userId === undefined || testTo === undefined) {
    console.error('uso: probar-aviso-renovacion.ts <.env> <user_id> <correo>');
    process.exit(1);
  }
  loadEnv(envPath);
  const db = createClient<Database, 'charcu'>(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_SECRET_KEY ?? '',
    {
      db: { schema: 'charcu' },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const results = await sendRenewalReminders(db, {
    allowedUserIds: [userId],
    testTo,
    checkoutMode: 'produccion',
  });
  console.log(
    results.length === 0 ? 'esa cuenta no tiene un plan manual por terminar' : results,
  );
}

void main();
