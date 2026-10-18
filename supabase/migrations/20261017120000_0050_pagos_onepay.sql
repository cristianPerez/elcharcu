-- ============================================================================
-- 0050 · PAGOS CON ONEPAY: el webhook, sus eventos y los enlaces de cobro
-- (2026-10-17)
--
-- Copiado de Manos Creadoras (migraciones 0019, 0020, 0022 y 0025), donde ya
-- está probado de punta a punta. Cuatro piezas:
--
--   1. `webhook_eventos`: TODO aviso de la pasarela, con el cuerpo entero.
--   2. `subscriptions` recuerda de qué pasarela y suscripción vino.
--   3. `plan_checkout`: a qué enlace de OnePay manda cada botón de pagar.
--   4. `user_id_by_email`: el único puente entre un pago y una cuenta.
-- ============================================================================


-- ── 1. LOS EVENTOS DE CUALQUIER PASARELA ────────────────────────────────────
--
-- ⚠️ NO SE LLAMA `onepay_eventos`. El proveedor es un DATO, no el nombre de la
-- tabla: si la pasarela cambia (ya pasó de Hotmart a OnePay en D17 → D21), el
-- sitio donde se guardan los eventos no cambia.

create table if not exists charcu.webhook_eventos (
  id uuid primary key default gen_random_uuid(),

  -- 'onepay' hoy; mañana la que toque.
  proveedor   text not null,

  -- El nombre del evento TAL CUAL lo manda ('subscription.paid'), para poder
  -- comparar palabra por palabra con su panel.
  evento      text not null,

  -- Nuestro nombre normalizado. ⚠️ Esta lista y `PaymentEventType` en
  -- TypeScript son DOS listas que se mueven juntas (en Manos Creadoras faltó
  -- un tipo aquí y la ruta devolvía 500).
  tipo        text not null check (tipo in (
    'suscripcion.pagada',
    'suscripcion.cancelada',
    'suscripcion.impagada',  -- le rebotó la tarjeta en la renovación
    'suscripcion.vencida',
    'desconocido'
  )),

  -- El id del recurso en la pasarela (la suscripción, el pago…).
  recurso_id  text not null,

  /*
   * ⚠️ LA HUELLA EVITA DOS ERRORES OPUESTOS. `subscription.paid` llega CADA
   * MES para la MISMA suscripción: una clave única en (evento, recurso_id)
   * tomaría la renovación por un duplicado y la descartaría. La huella añade
   * lo que cambia entre ocurrencias pero no entre reintentos (la próxima
   * cobranza en un pago, la cancelación en una baja).
   */
  huella      text not null,

  estado      text not null default 'recibido' check (estado in (
    'recibido',   -- entró y se guardó
    'procesado',  -- se aplicó a la suscripción
    'huerfano',   -- válido, pero no se supo de qué cuenta era
    'error'       -- llegó algo que no entendimos
  )),

  -- El cuerpo entero, sin tocar. Cuando algo no cuadre, esto es la verdad.
  cuerpo       jsonb not null,
  nota         text,

  -- El código que une la fila con sus líneas de log, y lo que tardamos
  -- (OnePay corta a los 10.000 ms y, si se repite, desactiva el endpoint).
  traza        text,
  duracion_ms  integer,

  recibido_en  timestamptz not null default now(),
  procesado_en timestamptz,

  unique (proveedor, huella)
);

alter table charcu.webhook_eventos enable row level security;
-- Sin políticas: solo lo escribe el servidor (service_role). Hay datos de cobro
-- de otras personas.

create index if not exists webhook_eventos_recurso_idx
  on charcu.webhook_eventos (proveedor, recurso_id);
create index if not exists webhook_eventos_traza_idx
  on charcu.webhook_eventos (traza);
-- Lo que se mira a diario: "¿qué falló últimamente?".
create index if not exists webhook_eventos_pendientes_idx
  on charcu.webhook_eventos (recibido_en desc)
  where estado in ('huerfano', 'error');

comment on table charcu.webhook_eventos is
  'Eventos de CUALQUIER pasarela de pago. El proveedor es un dato, no el nombre de la tabla.';


-- ── 2. LA SUSCRIPCIÓN RECUERDA DE DÓNDE VINO ───────────────────────────────

alter table charcu.subscriptions
  add column if not exists provider                 text,
  add column if not exists external_subscription_id text,
  add column if not exists external_customer_id     text,
  -- Canceló, pero conserva el acceso hasta `current_period_end` (lo pagó).
  add column if not exists canceled_at              timestamptz;

create index if not exists subscriptions_external_idx
  on charcu.subscriptions (provider, external_subscription_id);

comment on column charcu.subscriptions.external_subscription_id is
  'El id de la suscripción en la pasarela: por donde el webhook encuentra a quién activar.';


-- ── 3. A QUÉ ENLACE MANDA CADA BOTÓN DE PAGAR ──────────────────────────────
--
-- En la base y no en el código: Cristian puede cambiar una URL de OnePay sin
-- desplegar. Y con `modo`, porque las migraciones corren igual en QA y en
-- producción: QA (y local) lee los planes del MODO DE PRUEBAS de OnePay;
-- producción, los reales. Lo decide `VERCEL_ENV`, no una variable a mano.
--
-- ⚠️ "Frecuencia: Mensual · Ciclos: 12" en el anual NO es "doce cobros": según
-- el dueño de OnePay (lo confirmó Cristian para Manos Creadoras, 2026-10-16),
-- los dos campos se leen juntos como "cada 12 meses".

create table if not exists charcu.plan_checkout (
  plan_id          text not null,   -- el de `plan_quotas`: 'pro-mensual', 'pro-anual'…
  modo             text not null check (modo in ('pruebas', 'produccion')),
  url              text not null check (url like 'https://pagos.onepay.la/%'),
  -- El id del plan en OnePay: con él, un pago se traduce a nuestro plan_id.
  external_plan_id text not null,
  actualizado_en   timestamptz not null default now(),
  primary key (plan_id, modo)
);

alter table charcu.plan_checkout enable row level security;
-- Los enlaces de pago son públicos (están en el botón): cualquiera los lee.
create policy plan_checkout_lectura on charcu.plan_checkout
  for select to anon, authenticated using (true);
grant select on charcu.plan_checkout to anon, authenticated;

insert into charcu.plan_checkout (plan_id, modo, url, external_plan_id) values
  ('pro-mensual', 'pruebas',
   'https://pagos.onepay.la/plan/01a14ceb-bf2b-72da-acc3-2080ada79db0',
   '01a14ceb-bf2b-72da-acc3-2080ada79db0'),
  ('pro-anual', 'pruebas',
   'https://pagos.onepay.la/plan/01a14cee-febf-710f-a088-04e89a5721d2',
   '01a14cee-febf-710f-a088-04e89a5721d2'),
  ('pro-mensual', 'produccion',
   'https://pagos.onepay.la/plan/01a14c65-d80d-73fe-a03b-775ef60be0eb',
   '01a14c65-d80d-73fe-a03b-775ef60be0eb'),
  ('pro-anual', 'produccion',
   'https://pagos.onepay.la/plan/01a14c69-f7a2-70b1-8be1-05aa190a2142',
   '01a14c69-f7a2-70b1-8be1-05aa190a2142')
on conflict (plan_id, modo) do update
  set url = excluded.url, external_plan_id = excluded.external_plan_id,
      actualizado_en = now();

comment on table charcu.plan_checkout is
  'El enlace de OnePay de cada plan, por modo (pruebas = QA y local; produccion = elcharcu.co).';


-- ── 4. DE UN CORREO A UNA CUENTA ───────────────────────────────────────────
--
-- ⚠️ EL CORREO ES EL ÚNICO PUENTE LA PRIMERA VEZ. El enlace de cobro es
-- genérico y no lleva nada nuestro: cuando alguien paga por primera vez, lo
-- único que une el pago con su cuenta es el correo que escribió en el
-- checkout. Las cuentas viven en `auth.users`, que PostgREST no expone; esta
-- función la consulta y SOLO la puede llamar el servidor: abierta, serviría
-- para averiguar qué correos tienen cuenta.

create or replace function charcu.user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from auth.users
   where lower(email) = lower(trim(p_email))
   limit 1;
$$;

revoke all on function charcu.user_id_by_email(text) from public, anon, authenticated;
grant execute on function charcu.user_id_by_email(text) to service_role;
