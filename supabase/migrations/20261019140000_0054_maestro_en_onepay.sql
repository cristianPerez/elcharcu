-- ============================================================================
-- 0054 · EL MAESTRO EN ONEPAY (2026-10-19)
--
-- Los dos planes del Maestro, creados en OnePay igual que los del Pro: USD,
-- impuesto 0 %, frecuencia mensual y el anual con 12 ciclos (que OnePay lee
-- como "cada 12 meses", ver 0050). Con estas filas, los botones del Maestro
-- dejan WhatsApp y van al checkout, sin desplegar nada.
--
-- ⚠️ ANTES DE PRODUCCIÓN, el código que sabe que `maestro-anual` es anual
-- (`periodEnd`). Sin él, un pago del Maestro anual daría un mes de acceso.
-- ============================================================================

insert into charcu.plan_checkout (plan_id, modo, url, external_plan_id) values
  ('maestro-mensual', 'pruebas',
   'https://pagos.onepay.la/plan/01a1548f-49ec-7203-af12-095f3731f380',
   '01a1548f-49ec-7203-af12-095f3731f380'),
  ('maestro-anual', 'pruebas',
   'https://pagos.onepay.la/plan/01a15490-7a2f-7264-b9e3-fd0b923c992e',
   '01a15490-7a2f-7264-b9e3-fd0b923c992e'),
  ('maestro-mensual', 'produccion',
   'https://pagos.onepay.la/plan/01a15492-048f-71fd-9002-79027eafef27',
   '01a15492-048f-71fd-9002-79027eafef27'),
  ('maestro-anual', 'produccion',
   'https://pagos.onepay.la/plan/01a15492-fa58-712d-8eec-1ee06608f64d',
   '01a15492-fa58-712d-8eec-1ee06608f64d')
on conflict (plan_id, modo) do update
  set url = excluded.url, external_plan_id = excluded.external_plan_id,
      actualizado_en = now();
