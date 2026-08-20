-- ============================================================================
-- El tope de RECETAS se aplicaba a todos los mensajes, no solo al abrir una
--
-- El fallo, encontrado probando en el celular (2026-08-20): alguien escribía
-- "Verde" dentro de una conversación que ya tenía abierta y le contestaba el
-- muro — "con el plan gratis puedes llevar una receta a la vez" — en vez del
-- asistente.
--
-- La condición era:
--
--     elsif v_r is not null and v_used_r + v_recipes > v_r then
--
-- Cuando el mensaje NO abre receta nueva, `v_recipes` vale 0, así que la
-- comprobación quedaba `usadas + 0 > tope`. En cuanto `recipes_used` pasaba
-- del límite —y puede pasarlo, porque cuenta creaciones del mes y el tope es
-- de 1— **todos** los mensajes siguientes quedaban bloqueados. El asistente se
-- volvía mudo para siempre, incluso dentro del chat que ya estaba abierto.
--
-- El arreglo es una guarda: el tope de recetas solo mira cuando de verdad se
-- va a crear una. Los otros dos topes se quedan igual — preguntas siempre suma
-- 1, y fotos ya se saltaba solo cuando `v_images` era 0.
-- ============================================================================

create or replace function charcu.consume_quota(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_images     integer default 0,
  p_new_recipe boolean default false
)
returns table (
  allowed         boolean,
  denied_by       text,
  plan            text,
  questions_used  integer,
  images_used     integer,
  recipes_used    integer,
  questions_limit integer,
  images_limit    integer,
  recipes_limit   integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan    text := charcu.effective_plan(p_user_id);
  v_period  text := charcu.current_period_key();
  v_images  integer := greatest(coalesce(p_images, 0), 0);
  v_recipes integer := case when coalesce(p_new_recipe, false) then 1 else 0 end;
  v_q integer; v_i integer; v_r integer;
  v_used_q integer := 0; v_used_i integer := 0; v_used_r integer := 0;
  v_row_id uuid;
  v_denied text := null;
begin
  select q.questions_per_month, q.images_per_month, q.recipes_per_month
    into v_q, v_i, v_r
  from charcu.plan_quotas q where q.plan_id = v_plan;

  insert into charcu.usage_counters as c (visitor_id, user_id, period_key)
  values (p_visitor_id, p_user_id, v_period)
  on conflict (visitor_id, period_key) do update
    set user_id    = coalesce(c.user_id, excluded.user_id),
        updated_at = now()
  returning c.id into v_row_id;

  if p_user_id is not null then
    select coalesce(sum(c.questions_used), 0), coalesce(sum(c.images_used), 0),
           coalesce(sum(c.recipes_used), 0)
      into v_used_q, v_used_i, v_used_r
    from charcu.usage_counters c
    where c.user_id = p_user_id and c.period_key = v_period;
  else
    select c.questions_used, c.images_used, c.recipes_used
      into v_used_q, v_used_i, v_used_r
    from charcu.usage_counters c where c.id = v_row_id;
  end if;

  -- Se dice CUÁL de los tres topes cerró la puerta: la pantalla necesita
  -- saberlo para no enseñar el muro equivocado.
  if v_used_q + 1 > v_q then
    v_denied := 'preguntas';
  elsif v_images > 0 and v_used_i + v_images > v_i then
    v_denied := 'fotos';
  -- ⚠️ `v_recipes > 0` es EL arreglo: sin esa guarda, seguir hablando en la
  -- receta que ya tienes abierta chocaba contra el tope de recetas.
  elsif v_recipes > 0 and v_r is not null and v_used_r + v_recipes > v_r then
    v_denied := 'recetas';
  end if;

  if v_denied is not null then
    return query select false, v_denied, v_plan, v_used_q, v_used_i, v_used_r, v_q, v_i, v_r;
    return;
  end if;

  update charcu.usage_counters c
     set questions_used = c.questions_used + 1,
         images_used    = c.images_used + v_images,
         recipes_used   = c.recipes_used + v_recipes,
         updated_at     = now()
   where c.id = v_row_id;

  return query select true, null::text, v_plan,
                      v_used_q + 1, v_used_i + v_images, v_used_r + v_recipes,
                      v_q, v_i, v_r;
end;
$$;

revoke all on function charcu.consume_quota(uuid, uuid, integer, boolean)
  from public, anon, authenticated;
grant execute on function charcu.consume_quota(uuid, uuid, integer, boolean)
  to service_role;
