import { type BrowserContext, type Page } from '@playwright/test';

import { admin, userIdOf } from './admin';
import { loadLocalEnv } from './env';

/**
 * Ayudantes para probar el enlace mágico de VERDAD, sin buzón (2026-10-07).
 *
 * El correo no se lee: Supabase guarda el token que mete en el enlace en
 * `auth.one_time_tokens`, y con él se arma la misma URL que llega al correo.
 * Esa tabla está en el esquema `auth`, que PostgREST no expone, así que se lee
 * con el endpoint SQL de la API de administración (solo lectura) y hace falta
 * `SUPABASE_ACCESS_TOKEN`. Sin él, los tests que lo usan se saltan solos; en
 * CI no está, a propósito: cada corrida manda correos de verdad por Resend a
 * direcciones `.test` que rebotan.
 */

const QA_REF = 'lcvmsbfnnpviumsqcxip';

export const INSTAGRAM_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 345.0.0.34.103 (iPhone14,5; iOS 17_5; es_CO; es; scale=3.00; 1170x2532; 634108168)';
export const SAFARI_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

export function canReadEmailTokens(): boolean {
  loadLocalEnv();
  return (process.env.SUPABASE_ACCESS_TOKEN ?? '') !== '';
}

async function sql(query: string): Promise<unknown> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${QA_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN ?? ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, read_only: true }),
    },
  );
  return res.json();
}

/** Una cuenta de prueba que existe y ya pasó el onboarding. */
export async function ensureTestAccount(email: string): Promise<void> {
  const client = admin();
  const exists = await userIdOf(email).catch(() => null);
  const userId =
    exists ??
    (await client.auth.admin.createUser({ email, email_confirm: true })).data.user?.id;
  if (userId === undefined) {
    throw new Error(`No se pudo crear ${email}`);
  }
  await client
    .from('profiles')
    .update({ full_name: 'Prueba Enlace', onboarding_status: 'listo' })
    .eq('id', userId);
}

/**
 * Pide el enlace desde el formulario que esté en pantalla y devuelve el
 * `redirect_to` que el navegador le mandó a Supabase: es el que va en el correo.
 *
 * Supabase deja pedir un enlace por minuto y por correo; si choca con eso,
 * espera y lo vuelve a intentar una vez.
 */
export async function requestMagicLink(page: Page, email: string): Promise<string> {
  let redirectTo: string | null = null;
  page.on('request', (request) => {
    if (request.url().includes('/auth/v1/otp')) {
      redirectTo = new URL(request.url()).searchParams.get('redirect_to');
    }
  });

  for (let intento = 0; intento < 2; intento += 1) {
    // Sirve en `/entrar` y en la hoja de crear cuenta (diseño final 03–06).
    await page.locator('input[type="email"]:visible').fill(email);
    await page.getByRole('button', { name: /enlace/i }).click();
    const sent = await page
      .getByText('Revisa tu correo')
      .waitFor({ timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (sent) {
      break;
    }
    await page.waitForTimeout(61_000);
  }

  if (redirectTo === null) {
    throw new Error('El navegador no pidió el enlace');
  }
  return redirectTo;
}

/** La URL exacta del correo, armada con el último token que Supabase guardó. */
export async function emailLinkFor(email: string, redirectTo: string): Promise<string> {
  for (let vuelta = 0; vuelta < 10; vuelta += 1) {
    const rows = await sql(`
      select t.token_hash, t.token_type
        from auth.one_time_tokens t join auth.users u on u.id = t.user_id
       where u.email = '${email.replace(/'/g, "''")}'
       order by t.created_at desc limit 1`);
    const row = Array.isArray(rows)
      ? (rows[0] as Record<string, unknown> | undefined)
      : undefined;
    if (row !== undefined && typeof row.token_hash === 'string') {
      const type = row.token_type === 'confirmation_token' ? 'signup' : 'magiclink';
      const base = process.env.SUPABASE_URL ?? '';
      return `${base}/auth/v1/verify?token=${row.token_hash}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`Sin token para ${email}`);
}

/** ¿Este navegador tiene sesión de Supabase? */
export async function hasSession(context: BrowserContext): Promise<boolean> {
  const cookies = await context.cookies();
  return cookies.some((cookie) => /^sb-.+-auth-token(\.\d+)?$/.test(cookie.name));
}

/** Los eventos del embudo de entrada que el NAVEGADOR manda a Mixpanel. No salen de verdad. */
export async function captureAuthEvents(context: BrowserContext): Promise<string[]> {
  const events: string[] = [];
  await context.route(/mixpanel\.com\/track/, async (route) => {
    const raw = new URLSearchParams(route.request().postData() ?? '').get('data') ?? '';
    let parsed: unknown = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        parsed = JSON.parse(Buffer.from(raw, 'base64').toString());
      } catch {
        parsed = [];
      }
    }
    for (const item of ([] as unknown[]).concat(parsed)) {
      const name = (item as { event?: unknown }).event;
      if (typeof name === 'string' && /auth_|magic_link|returned_to/.test(name)) {
        events.push(name);
      }
    }
    await route.fulfill({ body: '1' });
  });
  return events;
}
