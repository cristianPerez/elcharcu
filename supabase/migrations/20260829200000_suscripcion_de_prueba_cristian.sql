-- ============================================================================
-- ⚠️ DATO DE PRUEBA — suscripción manual para la cuenta de Cristian
--                     (2026-08-29)
--
-- Pedido de Cristian: poder revisar la experiencia de pago antes de que exista
-- pasarela. OnePay está aplazado (D21) y `charcu.subscriptions` está vacía, así
-- que hoy TODO el mundo es `aprendiz` y ningún curso de pago se abre para
-- nadie — ni para él.
--
-- Esto es exactamente el "carril manual" que describe el plan de lanzamiento:
-- el interruptor del negocio ya existe y solo hay que llenar la tabla. Aquí se
-- llena a mano, para una sola cuenta, para poder mirar.
--
-- ⚠️ POR QUÉ VA EN UN ARCHIVO Y NO EN SQL SUELTO POR EL PANEL.
--
-- Porque el repo lo manda desde el 2026-08-14 ("un cambio = un archivo, nunca
-- SQL suelto") y porque una suscripción regalada por debajo de la mesa es
-- justo el tipo de cosa que nadie recuerda haber hecho tres semanas después,
-- cuando alguien pregunte por qué esa cuenta ve los cursos de pago.
--
-- ⚠️ POR QUÉ NO ROMPE UNA BASE NUEVA.
--
-- Va con un `where exists` contra `auth.users`. En una base recién creada ese
-- id no existe, así que la migración no inserta nada y pasa sin error. Sin esa
-- guarda, el `insert` reventaría por la clave foránea y dejaría el `db push`
-- roto para siempre.
--
-- ⚠️ CÓMO SE QUITA, que es lo importante:
--
--     delete from charcu.subscriptions
--      where user_id = '9932fbe6-7464-48d7-b7ec-59afc9d7a529'
--        and rail = 'manual';
--
-- El `rail = 'manual'` distingue esta fila de cualquier suscripción de verdad
-- que llegue después por OnePay. Cuando la pasarela esté conectada, esta fila
-- SE BORRA: si se queda, esa cuenta seguiría teniendo acceso gratis y el primer
-- cobro real fallaría contra un `on conflict (user_id)` que ya está ocupado.
--
-- Plan elegido: `pro-mensual`, no `maestro-anual`. Es lo que va a tener la
-- mayoría, así que lo que Cristian revise es lo que va a ver su cliente. Y trae
-- 200 preguntas al mes, que sobran para revisar sin chocar con el muro de cupo
-- a mitad de la prueba.
-- ============================================================================

insert into charcu.subscriptions
  (user_id, status, plan_id, rail, country, current_period_end)
select
  '9932fbe6-7464-48d7-b7ec-59afc9d7a529'::uuid,
  'active',
  'pro-mensual',
  -- El `check` de la columna no restringe `rail`; 'manual' deja escrito que
  -- esto no entró por ninguna pasarela.
  'manual',
  'co',
  now() + interval '30 days'
where exists (
  select 1 from auth.users
   where id = '9932fbe6-7464-48d7-b7ec-59afc9d7a529'::uuid
)
on conflict (user_id) do update
  set status             = 'active',
      plan_id            = 'pro-mensual',
      rail               = 'manual',
      current_period_end = now() + interval '30 days',
      updated_at         = now();
