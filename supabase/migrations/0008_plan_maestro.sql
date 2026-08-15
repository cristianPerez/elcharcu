-- ============================================================================
-- Tercer plan (Maestro) y los identificadores por ciclo
--
-- La página de precios pasa a tres planes: el de en medio es el que se quiere
-- vender y el grande está para que se entienda que lo es. El Maestro da el
-- triple de todo y va dirigido a quien vive de esto.
--
-- Los identificadores cambian de `mensual`/`anual` a `<plan>-<ciclo>`, porque
-- con dos planes de pago "mensual" ya no dice cuál. Es lo que viajará a
-- Hotmart y lo que devolverá el webhook, así que tiene que ser inequívoco.
-- Se puede reescribir sin cuidado: todavía no hay ninguna suscripción.
-- ============================================================================

delete from charcu.plan_quotas where plan_id in ('mensual', 'anual');

insert into charcu.plan_quotas (plan_id, questions_per_month, images_per_month) values
  ('pro-mensual',     200, 30),
  ('pro-anual',       200, 30),
  ('maestro-mensual', 600, 90),
  ('maestro-anual',   600, 90)
on conflict (plan_id) do update
  set questions_per_month = excluded.questions_per_month,
      images_per_month    = excluded.images_per_month;

-- El plan de reserva ante un `plan_id` desconocido ya no puede ser `mensual`:
-- ese identificador dejó de existir. Sigue el mismo criterio de antes — si
-- alguien pagó, se le da servicio aunque no reconozcamos su plan.
create or replace function charcu.effective_plan(p_user_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_plan text;
begin
  if p_user_id is null then
    return 'aprendiz';
  end if;

  select s.plan_id into v_plan
  from charcu.subscriptions s
  where s.user_id = p_user_id
    and s.status = 'active'
    and (s.current_period_end is null or s.current_period_end > now());

  if v_plan is null then
    return 'aprendiz';
  end if;

  if not exists (select 1 from charcu.plan_quotas q where q.plan_id = v_plan) then
    return 'pro-mensual';
  end if;

  return v_plan;
end;
$$;
