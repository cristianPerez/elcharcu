-- ============================================================================
-- 0053 · UN PLAN DE ONEPAY QUE NO CONOCEMOS (2026-10-19)
--
-- ⚠️ ANTES SE ADIVINABA. Si el `plan_id` del aviso no estaba en
-- `plan_checkout`, el webhook activaba `pro-mensual` sin decir nada. Le pasó al
-- primer aviso de producción: un plan de prueba de US$ 1 quedó como Pro
-- mensual, y nada en la base guardaba de qué plan venía.
--
-- Ahora no se activa nada. El evento queda `plan_desconocido` para revisarlo a
-- mano y la suscripción guarda el plan de OnePay, así se sabe qué compró.
-- ============================================================================

alter table charcu.subscriptions
  add column if not exists external_plan_id text;

comment on column charcu.subscriptions.external_plan_id is
  'El id del plan en la pasarela, tal cual llegó en el último pago. Se traduce a plan_id con plan_checkout.';

-- El check de 0050 iba en línea, así que Postgres le puso el nombre por defecto.
alter table charcu.webhook_eventos
  drop constraint if exists webhook_eventos_estado_check;
alter table charcu.webhook_eventos
  add constraint webhook_eventos_estado_check check (estado in (
    'recibido',          -- entró y se guardó
    'procesado',         -- se aplicó a la suscripción
    'huerfano',          -- válido, pero no se supo de qué cuenta era
    'plan_desconocido',  -- se sabe de quién es, pero no qué plan compró
    'error'              -- llegó algo que no entendimos
  ));

-- Lo que se mira a diario incluye ahora los planes que no conocemos.
drop index if exists charcu.webhook_eventos_pendientes_idx;
create index webhook_eventos_pendientes_idx
  on charcu.webhook_eventos (recibido_en desc)
  where estado in ('huerfano', 'plan_desconocido', 'error');
