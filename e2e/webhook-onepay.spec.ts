import { createHmac, randomUUID } from 'node:crypto';

import { expect, test, type APIRequestContext } from '@playwright/test';

import { admin, userIdOf } from './admin';
import { E2E_WEBHOOK_SECRET, E2E_WEBHOOK_TOKEN } from './env';
import { ensureTestAccount } from './magicLink';

/**
 * El webhook de OnePay (2026-10-17), probado como lo prueba Manos Creadoras
 * con `webhook:probar`: eventos firmados igual que los firmaría OnePay, con
 * claves de PRUEBA que solo existen en los e2e (playwright.config / e2e.yml).
 * Ningún evento sale de verdad ni toca OnePay.
 *
 * No depende del ancho: corre solo en un proyecto.
 */

const EMAIL = 'e2e-pagos@elcharcu.test';
/** El plan anual del MODO DE PRUEBAS de OnePay (migración 0050). */
const PRO_ANUAL_PRUEBAS = '01a14cee-febf-710f-a088-04e89a5721d2';

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'No depende del ancho');
});

function signed(body: unknown): { data: string; headers: Record<string, string> } {
  const data = JSON.stringify(body);
  return {
    data,
    headers: {
      'content-type': 'application/json',
      'x-webhook-token': E2E_WEBHOOK_TOKEN,
      signature: createHmac('sha256', E2E_WEBHOOK_SECRET).update(data).digest('hex'),
    },
  };
}

async function send(
  request: APIRequestContext,
  body: unknown,
): Promise<Record<string, unknown>> {
  const { data, headers } = signed(body);
  const response = await request.post('/api/webhooks/onepay', { data, headers });
  expect(response.status()).toBe(200);
  return (await response.json()) as Record<string, unknown>;
}

function paid(subscriptionId: string, nextBilling: string, email = EMAIL): unknown {
  return {
    event: 'subscription.paid',
    data: {
      id: subscriptionId,
      customer_id: 'cus_e2e',
      plan_id: PRO_ANUAL_PRUEBAS,
      email,
      next_billing_at: nextBilling,
    },
  };
}

async function cleanup(userId: string, subscriptionId: string): Promise<void> {
  await admin().from('subscriptions').delete().eq('user_id', userId);
  await admin().from('webhook_eventos').delete().like('recurso_id', `${subscriptionId}%`);
}

test('sin firma, 401; proveedor que no existe, 404', async ({ request }) => {
  const unsigned = await request.post('/api/webhooks/onepay', {
    data: JSON.stringify({ event: 'subscription.paid', data: { id: 'x' } }),
    headers: {
      'content-type': 'application/json',
      signature: 'mala',
      'x-webhook-token': 'mala',
    },
  });
  expect(unsigned.status()).toBe(401);

  const unknown = await request.post('/api/webhooks/otra', { data: '{}' });
  expect(unknown.status()).toBe(404);
});

test('un pago activa el plan; el reintento no se repite; cancelar conserva el acceso', async ({
  request,
}) => {
  await ensureTestAccount(EMAIL);
  const userId = await userIdOf(EMAIL);
  const subscriptionId = `sub_e2e_${randomUUID()}`;
  await cleanup(userId, subscriptionId);

  try {
    const nextYear = new Date(Date.now() + 365 * 86_400_000).toISOString();
    expect(await send(request, paid(subscriptionId, nextYear))).toEqual({ ok: true });

    const { data: sub } = await admin()
      .from('subscriptions')
      .select('status, plan_id, provider, external_subscription_id, current_period_end')
      .eq('user_id', userId)
      .single();
    expect(sub).toMatchObject({
      status: 'active',
      plan_id: 'pro-anual',
      provider: 'onepay',
      external_subscription_id: subscriptionId,
    });
    expect(new Date(sub?.current_period_end ?? 0).getTime()).toBeGreaterThan(Date.now());
    const { data: isActive } = await admin().rpc('has_active_subscription', {
      p_user_id: userId,
    });
    expect(isActive).toBe(true);

    // El MISMO evento otra vez (un reintento de OnePay): no se aplica dos veces.
    expect(await send(request, paid(subscriptionId, nextYear))).toEqual({
      ok: true,
      repetido: true,
    });

    // La renovación del período siguiente: misma suscripción, otra fecha → se procesa.
    const later = new Date(Date.now() + 2 * 365 * 86_400_000).toISOString();
    expect(await send(request, paid(subscriptionId, later))).toEqual({ ok: true });

    // Cancelar no corta: conserva el acceso hasta el final del período pagado.
    await send(request, {
      event: 'subscription.canceled',
      data: { id: subscriptionId, canceled_at: new Date().toISOString() },
    });
    const { data: canceled } = await admin()
      .from('subscriptions')
      .select('status, canceled_at')
      .eq('user_id', userId)
      .single();
    expect(canceled?.status).toBe('active');
    expect(canceled?.canceled_at).not.toBeNull();

    const { data: rows } = await admin()
      .from('webhook_eventos')
      .select('estado, traza, duracion_ms')
      .eq('recurso_id', subscriptionId);
    expect((rows ?? []).length).toBe(3);
    for (const row of rows ?? []) {
      expect(row.estado).toBe('procesado');
      expect(row.traza).toMatch(/^[0-9a-f]{8}$/);
    }
  } finally {
    await cleanup(userId, subscriptionId);
  }
});

test('un pago de un correo sin cuenta queda huérfano, guardado', async ({ request }) => {
  const subscriptionId = `sub_e2e_${randomUUID()}`;
  try {
    await send(
      request,
      paid(
        subscriptionId,
        new Date().toISOString(),
        `nadie-${randomUUID()}@elcharcu.test`,
      ),
    );
    const { data } = await admin()
      .from('webhook_eventos')
      .select('estado, nota')
      .eq('recurso_id', subscriptionId)
      .single();
    expect(data?.estado).toBe('huerfano');
    expect(data?.nota).toContain('nadie con el correo');
  } finally {
    await admin().from('webhook_eventos').delete().eq('recurso_id', subscriptionId);
  }
});
