-- ============================================================================
-- 0057 · YORK Y CARLOS VUELVEN AL PLAN GRATIS (2026-11-09)
--
-- Sus planes manuales vencieron y no se renovaron:
--   · York (`arizayorman@hotmail.com`): Pro pagado por Nequi, venció el
--     27 oct a las 00:00 de Bogotá (ver 0055).
--   · Carlos Quintero (`quinterofcarlose@gmail.com`): Pro de cortesía,
--     venció el 1 nov a las 00:00 de Bogotá.
-- La base los seguía teniendo en `active` sin acceso real, y eso inflaba
-- cualquier conteo de suscriptores. Decisión de Cristian: pasarlos a gratis.
--
-- `status = 'free'` y sin plan, como queda cualquier cuenta sin suscripción.
-- `rail` se conserva: es el registro de cómo pagaron, por si renuevan.
--
-- ⚠️ Solo si SIGUEN vencidos: si alguno renovó por OnePay antes de aplicar
-- esto, su fila tiene un período nuevo y no se toca. En una base nueva (o en
-- QA, donde estas cuentas no existen) no hace nada.
-- ============================================================================

update charcu.subscriptions
   set status     = 'free',
       plan_id    = null,
       updated_at = now()
 where user_id in (
         '096f7dcf-a527-46c1-a884-8098ff0d19a8'::uuid,  -- York
         'fc65843b-fd6c-4bf9-860a-c590ecc0b9be'::uuid   -- Carlos Quintero
       )
   and status = 'active'
   and provider is null
   and current_period_end < now();
