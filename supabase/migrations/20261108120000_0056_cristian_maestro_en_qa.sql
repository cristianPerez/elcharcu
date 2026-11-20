-- ============================================================================
-- 0056 · CRISTIAN CON EL MAESTRO EN QA, SIN VENCIMIENTO (2026-11-08)
--
-- Pedido de Cristian: acceso completo en su cuenta (`cperez354@gmail.com`)
-- en QA, "por ahora", para revisar los cursos mientras graba los videos que
-- faltan.
--
-- ⚠️ SOLO QA. Va por el id de esa cuenta EN QA (`9932fbe6…`, el mismo de
-- `suscripcion_de_prueba_cristian`). En producción la misma persona tiene
-- otro id, así que allá el `where exists` no encuentra a nadie y esto no
-- hace nada. Para dárselo en producción hay que hacer otra migración con el
-- id de allá, y con su aprobación.
--
--   · `rail = 'interna'`, `provider` null: no es una venta.
--   · 10 años de período = "sin vencimiento" sin cambiar el esquema.
--
-- Para quitarlo: `delete from charcu.subscriptions where user_id =
-- '9932fbe6-7464-48d7-b7ec-59afc9d7a529' and rail = 'interna';`
-- ============================================================================

insert into charcu.subscriptions
  (user_id, status, plan_id, rail, country, current_period_end)
select
  '9932fbe6-7464-48d7-b7ec-59afc9d7a529'::uuid,
  'active',
  'maestro-anual',
  'interna',
  'CO',
  now() + interval '10 years'
where exists (
  select 1 from auth.users where id = '9932fbe6-7464-48d7-b7ec-59afc9d7a529'::uuid
)
on conflict (user_id) do update
  set status                   = 'active',
      plan_id                  = 'maestro-anual',
      rail                     = 'interna',
      provider                 = null,
      external_subscription_id = null,
      external_customer_id     = null,
      external_plan_id         = null,
      canceled_at              = null,
      current_period_end       = now() + interval '10 years',
      updated_at               = now();
