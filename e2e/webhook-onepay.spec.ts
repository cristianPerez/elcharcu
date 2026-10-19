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

function paid(
  subscriptionId: string,
  nextBilling: string,
  email = EMAIL,
  planId = PRO_ANUAL_PRUEBAS,
): unknown {
  return {
    event: 'subscription.paid',
    data: {
      id: subscriptionId,
      customer_id: 'cus_e2e',
      plan_id: planId,
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
      .select(
        'status, plan_id, provider, external_subscription_id, external_plan_id, current_period_end',
      )
      .eq('user_id', userId)
      .single();
    expect(sub).toMatchObject({
      status: 'active',
      plan_id: 'pro-anual',
      provider: 'onepay',
      external_subscription_id: subscriptionId,
      external_plan_id: PRO_ANUAL_PRUEBAS,
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

test('un plan que no está en plan_checkout no se adivina: queda para revisar', async ({
  request,
}) => {
  await ensureTestAccount(EMAIL);
  const userId = await userIdOf(EMAIL);
  const subscriptionId = `sub_e2e_${randomUUID()}`;
  // Como la prueba de US$ 1 del 2026-10-19: un plan de OnePay sin fila nuestra.
  const unknownPlan = `plan_e2e_${randomUUID()}`;
  await cleanup(userId, subscriptionId);

  try {
    const nextYear = new Date(Date.now() + 365 * 86_400_000).toISOString();
    expect(
      await send(request, paid(subscriptionId, nextYear, EMAIL, unknownPlan)),
    ).toEqual({ ok: true });

    const { data: row } = await admin()
      .from('webhook_eventos')
      .select('estado, nota')
      .eq('recurso_id', subscriptionId)
      .single();
    expect(row?.estado).toBe('plan_desconocido');
    expect(row?.nota).toContain(unknownPlan);

    // Se guarda de quién es y qué compró, pero sin dar acceso.
    const { data: sub } = await admin()
      .from('subscriptions')
      .select('status, plan_id, external_subscription_id, external_plan_id')
      .eq('user_id', userId)
      .single();
    expect(sub).toEqual({
      status: 'free',
      plan_id: null,
      external_subscription_id: subscriptionId,
      external_plan_id: unknownPlan,
    });
    const { data: isActive } = await admin().rpc('has_active_subscription', {
      p_user_id: userId,
    });
    expect(isActive).toBe(false);
  } finally {
    await cleanup(userId, subscriptionId);
  }
});

test('un pago sin correo ni teléfono conocidos queda huérfano, guardado', async ({
  request,
}) => {
  const subscriptionId = `sub_e2e_${randomUUID()}`;
  try {
    // El correo de OnePay (modo de pruebas) NO crea cuenta: juntaría a todos.
    await send(request, paid(subscriptionId, new Date().toISOString(), 'hola@onepay.ai'));
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

test('un pago de un correo sin cuenta crea la cuenta, sin verificar, con el Pro activo', async ({
  request,
}) => {
  const email = `e2e-pago-nuevo-${randomUUID()}@elcharcu.test`;
  const subscriptionId = `sub_e2e_${randomUUID()}`;
  const nextYear = new Date(Date.now() + 365 * 86_400_000).toISOString();
  let userId: string | null = null;
  try {
    expect(await send(request, paid(subscriptionId, nextYear, email))).toEqual({
      ok: true,
    });
    userId = await userIdOf(email);
    const { data: user } = await admin().auth.admin.getUserById(userId);
    expect(user.user?.email_confirmed_at ?? null).toBeNull();

    const { data: sub } = await admin()
      .from('subscriptions')
      .select('status, plan_id, bienvenida_enviada_el')
      .eq('user_id', userId)
      .single();
    expect(sub).toMatchObject({ status: 'active', plan_id: 'pro-anual' });
    // Resend rechaza la clave falsa de los e2e: la bienvenida queda pendiente
    // para el próximo aviso, no marcada como enviada.
    expect(sub?.bienvenida_enviada_el).toBeNull();
  } finally {
    await admin().from('webhook_eventos').delete().eq('recurso_id', subscriptionId);
    if (userId !== null) {
      await admin().from('subscriptions').delete().eq('user_id', userId);
      await admin().auth.admin.deleteUser(userId);
    }
  }
});

/** La forma REAL del aviso de OnePay (QA, 2026-10-18): sin correo útil ni próxima cobranza. */
function paidLikeOnePay(
  subscriptionId: string,
  paymentId: string,
  phone: string,
): unknown {
  return {
    event: { type: 'subscription.paid', environment: 'test' },
    payment: { id: paymentId, paid_at: '2026-10-18T17:26:08.000000Z' },
    subscription: {
      id: subscriptionId,
      plan_id: PRO_ANUAL_PRUEBAS,
      customer: { id: 'cus_e2e', email: 'hola@onepay.ai', phone },
    },
  };
}

test('sin correo, se encuentra la cuenta por el WhatsApp y vence en un año', async ({
  request,
}) => {
  const email = 'e2e-pagos-telefono@elcharcu.test';
  await ensureTestAccount(email);
  const userId = await userIdOf(email);
  const subscriptionId = `sub_e2e_${randomUUID()}`;
  // Diez dígitos que no tiene nadie más: la búsqueda exige una única cuenta.
  const digits = `3${String(Date.now()).slice(-9)}`;
  await cleanup(userId, subscriptionId);
  await admin().from('profiles').update({ whatsapp: digits }).eq('id', userId);

  try {
    const first = paidLikeOnePay(subscriptionId, randomUUID(), `+57 ${digits}`);
    expect(await send(request, first)).toEqual({ ok: true });
    const { data: sub } = await admin()
      .from('subscriptions')
      .select('status, plan_id, current_period_end')
      .eq('user_id', userId)
      .single();
    expect(sub).toMatchObject({ status: 'active', plan_id: 'pro-anual' });
    expect(sub?.current_period_end?.slice(0, 10)).toBe('2027-10-18');

    // El mismo cobro reintentado se descarta; el cobro siguiente (otro id), no.
    expect(await send(request, first)).toEqual({ ok: true, repetido: true });
    expect(
      await send(request, paidLikeOnePay(subscriptionId, randomUUID(), digits)),
    ).toEqual({ ok: true });
  } finally {
    await admin().from('profiles').update({ whatsapp: null }).eq('id', userId);
    await cleanup(userId, subscriptionId);
  }
});
