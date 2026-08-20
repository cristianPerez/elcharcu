-- ============================================================================
-- El cupo se le cobraba a la primera cuenta que usó ese navegador
--
-- Encontrado probando en el celular (2026-08-20): la pantalla decía "3 de 8"
-- pero el historial mostraba 5 conversaciones. Los datos:
--
--   recetas de hoy  → visitor 1cc87fe3 · user 9932fbe6  (cuenta personal)
--   contador        → visitor 1cc87fe3 · user f1d7f773  (cuenta de trabajo)
--
-- Mismo navegador, dueños distintos. Las recetas quedaron en la cuenta con la
-- que se entró hoy, pero el contador seguía atado a la cuenta con la que se
-- había entrado días antes en ese mismo teléfono. Las preguntas se le cobraban
-- a la cuenta equivocada.
--
-- La causa eran dos `coalesce` que preferían al dueño VIEJO:
--
--   consume_quota:        set user_id = coalesce(c.user_id, excluded.user_id)
--   link_visitor_to_user: where visitor_id = … and user_id is null
--
-- El primero se queda con el primer dueño para siempre; el segundo solo
-- escribe si no hay ninguno. Entre los dos, un navegador nunca cambiaba de
-- cuenta.
--
-- Ahora manda quien está usando la app AHORA.
--
-- ⚠️ Con esto, si dos cuentas comparten un teléfono, el consumo del mes de ese
-- navegador pasa entero a la última que entre. No es perfecto —lo perfecto
-- sería un contador por (cuenta, mes) y no por (navegador, mes)—, pero es
-- mucho mejor que cobrarle para siempre a una cuenta que ya no está usando la
-- app. Rediseñar la clave del contador es harina de otro costal.
--
-- ⚠️ Las RECETAS no se reasignan, a propósito: siguen adoptándose solo si no
-- tienen dueño. Reasignarlas le entregaría las conversaciones de una persona a
-- otra por el simple hecho de compartir un teléfono.
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
    -- EL ARREGLO: manda quien está usando la app ahora. Antes era
    -- `coalesce(c.user_id, excluded.user_id)`, que se quedaba con el primero.
    set user_id    = coalesce(excluded.user_id, c.user_id),
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

  if v_used_q + 1 > v_q then
    v_denied := 'preguntas';
  elsif v_images > 0 and v_used_i + v_images > v_i then
    v_denied := 'fotos';
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

-- ----------------------------------------------------------------------------
-- Al entrar: el contador de este navegador pasa a la cuenta que acaba de
-- entrar. Las recetas, solo si no tienen dueño.
-- ----------------------------------------------------------------------------

create or replace function charcu.link_visitor_to_user(p_visitor_id uuid, p_user_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update charcu.usage_counters
     set user_id = p_user_id, updated_at = now()
   where visitor_id = p_visitor_id
     and (user_id is null or user_id <> p_user_id);

  update charcu.recipes
     set user_id = p_user_id
   where visitor_id = p_visitor_id and user_id is null;
$$;

revoke all on function charcu.consume_quota(uuid, uuid, integer, boolean)
  from public, anon, authenticated;
grant execute on function charcu.consume_quota(uuid, uuid, integer, boolean)
  to service_role;
grant execute on function charcu.link_visitor_to_user(uuid, uuid) to service_role;
