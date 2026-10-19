-- ============================================================================
-- 0051 · DE UN TELÉFONO A UNA CUENTA (2026-10-18)
--
-- ⚠️ EL CORREO DEL CHECKOUT NO SIRVE. Con los primeros pagos de prueba se vio
-- que el checkout del plan de OnePay pide el WhatsApp y NO el correo: el aviso
-- llega con `customer.email = "hola@onepay.ai"` (el de OnePay) y el pago quedaba
-- huérfano siempre. Lo que sí trae es `customer.phone`.
--
-- Así que el segundo puente es el WhatsApp del perfil (`profiles.whatsapp`, que
-- se pide en el onboarding). Se comparan los ÚLTIMOS 10 DÍGITOS, para que dé
-- igual si uno lleva el prefijo del país (+57, 57…) y el otro no.
--
-- ⚠️ SOLO SI HAY UNA CUENTA CON ESE NÚMERO. Si dos perfiles comparten teléfono,
-- no se adivina: devuelve null y el pago queda huérfano, guardado y avisado. Es
-- mejor activar a mano que darle la suscripción a la persona equivocada.
--
-- Igual que `user_id_by_email`: solo el servidor. Abierta, serviría para
-- averiguar qué teléfonos tienen cuenta.
-- ============================================================================

create or replace function charcu.user_id_by_phone(p_phone text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  with digits as (
    select right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 10) as tail
  ),
  matches as (
    select p.id
      from charcu.profiles p, digits d
     where length(d.tail) = 10
       and right(regexp_replace(coalesce(p.whatsapp, ''), '\D', '', 'g'), 10) = d.tail
  )
  select case when count(*) = 1 then min(id::text)::uuid end from matches;
$$;

revoke all on function charcu.user_id_by_phone(text) from public, anon, authenticated;
grant execute on function charcu.user_id_by_phone(text) to service_role;
