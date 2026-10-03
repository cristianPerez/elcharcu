import { mkdirSync } from 'node:fs';

import { chromium, type FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Prepara dos cuentas de prueba en QA y deja su sesión guardada.
 *
 *   · `gratis` — sin suscripción: el caso de casi todo el mundo hoy.
 *   · `pro`    — con suscripción activa: el único que puede apuntarse a la
 *                lista de espera (migración 0021).
 *
 * La sesión se abre como la abriría una persona: con el enlace del correo.
 * `generateLink` devuelve el mismo `token_hash` que viajaría en el email, y se
 * entra por `/auth/callback`, así que el test pasa por la puerta de verdad.
 */

const QA_REF = 'lcvmsbfnnpviumsqcxip';

export const E2E_USERS = {
  gratis: { email: 'e2e-gratis@elcharcu.test', name: 'Prueba Gratis' },
  pro: { email: 'e2e-pro@elcharcu.test', name: 'Prueba Pro' },
} as const;

export type E2eUser = keyof typeof E2E_USERS;

export function storageStateFor(user: E2eUser): string {
  return `e2e/.auth/${user}.json`;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Falta ${name} en .env.local`);
  }
  return value;
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  process.loadEnvFile('.env.local');

  const url = requireEnv('SUPABASE_URL');
  if (!url.includes(QA_REF)) {
    throw new Error('Los e2e solo corren contra la base de QA.');
  }

  const admin = createClient(url, requireEnv('SUPABASE_SECRET_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const charcu = admin.schema('charcu');

  const baseURL = config.projects[0]?.use.baseURL ?? 'http://localhost:3100';
  mkdirSync('e2e/.auth', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });

  for (const key of Object.keys(E2E_USERS) as E2eUser[]) {
    const { email, name } = E2E_USERS[key];

    const { data: link, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    // `magiclink` falla si la cuenta no existe: se crea y se vuelve a pedir.
    const ready =
      error === null
        ? link
        : (
            await (async () => {
              await admin.auth.admin.createUser({ email, email_confirm: true });
              return admin.auth.admin.generateLink({ type: 'magiclink', email });
            })()
          ).data;

    const userId = ready.user?.id;
    const tokenHash = ready.properties?.hashed_token;
    // Una cuenta recién creada recibe un enlace de `signup`, no de `magiclink`.
    const otpType = ready.properties?.verification_type ?? 'magiclink';
    if (userId === undefined || tokenHash === undefined) {
      throw new Error(`No se pudo abrir sesión para ${email}`);
    }

    // Sin esto el layout enseña el onboarding en vez de la app.
    await charcu
      .from('profiles')
      .update({ full_name: name, onboarding_status: 'listo' })
      .eq('id', userId);

    if (key === 'pro') {
      await charcu.from('subscriptions').upsert(
        {
          user_id: userId,
          status: 'active',
          plan_id: 'pro-mensual',
          rail: 'manual',
          current_period_end: new Date(Date.now() + 30 * 86_400_000).toISOString(),
        },
        { onConflict: 'user_id' },
      );
    }

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(
      `${baseURL}/auth/callback?token_hash=${tokenHash}&type=${otpType}&next=/cursos`,
    );
    await page.waitForURL(/\/cursos/);
    await context.storageState({ path: storageStateFor(key) });
    await context.close();
  }

  await browser.close();
}
