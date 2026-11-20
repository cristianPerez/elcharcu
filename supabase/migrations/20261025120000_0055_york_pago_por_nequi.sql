-- ============================================================================
-- 0055 · EL PRO DE YORK SE PAGÓ POR NEQUI, NO FUE CORTESÍA (2026-10-25)
--
-- La suscripción de York (`arizayorman@hotmail.com`) se cargó a mano en
-- producción el 2026-09-26 con `rail = 'cortesia'`, sin migración. Cristian
-- aclaró el 2026-10-25 que York PAGÓ su mes, por fuera de la pasarela, por
-- Nequi. Contarlo como regalo escondía el primer pago real de El Charcu y
-- hacía que el aviso de renovación le hablara de "tu mes de regalo".
--
-- Solo cambia `rail`: el plan (`pro-mensual`) y el corte (27 oct, 00:00 en
-- Bogotá) son los que se cobraron. `provider` sigue en null: no entró por
-- ninguna pasarela, así que el webhook de OnePay no la reconoce como suya.
--
-- ⚠️ No rompe una base nueva: en una base vacía la fila no existe y el
-- `update` no toca nada. El `rail = 'cortesia'` evita pisar un pago de OnePay
-- que haya llegado después.
-- ============================================================================

update charcu.subscriptions
   set rail = 'nequi',
       updated_at = now()
 where user_id = '096f7dcf-a527-46c1-a884-8098ff0d19a8'::uuid
   and rail = 'cortesia';
