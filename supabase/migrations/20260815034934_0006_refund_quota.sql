-- ============================================================================
-- Devolver el cupo cuando la respuesta no llegó
--
-- El cupo se descuenta ANTES de llamar a Gemini, que es lo correcto: si se
-- descontara después, dos pestañas a la vez podrían colarse. El problema es
-- que si Gemini falla, el visitante se queda sin esa pregunta por un error
-- que no es suyo. Se vio en pruebas: dos llamadas seguidas devolvieron 502 y
-- el contador igual subió.
--
-- Esta función deshace ese cobro. Nunca baja de cero, por si llega dos veces.
-- ============================================================================

create or replace function charcu.refund_quota(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_images     integer default 0
)
returns void
language sql
security definer
set search_path = ''
as $$
  update charcu.usage_counters
     set questions_used = greatest(questions_used - 1, 0),
         images_used    = greatest(images_used - greatest(coalesce(p_images, 0), 0), 0),
         updated_at     = now()
   where visitor_id = p_visitor_id
     and period_key = charcu.current_period_key();
$$;

revoke all on function charcu.refund_quota(uuid, uuid, integer) from public, anon, authenticated;
grant execute on function charcu.refund_quota(uuid, uuid, integer) to service_role;
