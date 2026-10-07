-- ============================================================================
-- `registrar_receta_recibida`: el visitante y la cuenta, opcionales (2026-10-07)
--
-- Se registra a nombre de UNO de los dos (la cuenta si hay sesión; si no, el
-- visitante). Con `default null` los tipos generados los marcan como
-- opcionales y el código pasa solo el que toca, sin forzar tipos.
-- ============================================================================

create or replace function charcu.registrar_receta_recibida(
  p_slug text,
  p_visitor_id uuid default null,
  p_user_id uuid default null
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into charcu.recetas_recibidas (recipe_slug, visitor_id, user_id)
  select p_slug, p_visitor_id, p_user_id
   where exists (select 1 from charcu.recetario where slug = p_slug and published)
     and (p_visitor_id is not null or p_user_id is not null)
  on conflict do nothing;
$$;

revoke all on function charcu.registrar_receta_recibida(text, uuid, uuid) from public;
grant execute on function charcu.registrar_receta_recibida(text, uuid, uuid) to service_role;
