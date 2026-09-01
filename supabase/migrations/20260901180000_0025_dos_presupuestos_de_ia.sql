-- ============================================================================
-- Dos bolsillos de IA: uno para los que no pagan y otro para los que sí
-- (2026-09-01, pedido de Cristian)
--
-- Hasta hoy el gasto diario era UNA cifra global y el tope, uno solo. Eso tenía
-- un fallo que estaba anotado desde que se puso: `checkBudget()` se comprueba
-- ANTES de mirar la sesión, así que al agotarse el presupuesto del día se
-- agotaba **para todos, incluido quien paga**. Un mal día de tráfico anónimo
-- —o alguien abusando— dejaba sin asistente al único que había puesto dinero.
--
-- Con las 45 recetas indexadas empujando preguntas gratis, eso pasó de teórico
-- a probable, y por eso se separa ahora.
--
-- La cuenta se lleva por (día, público):
--
--   `lead` — sin cuenta o con cuenta sin suscripción. Es la demostración.
--   `pro`  — con suscripción activa. Es el servicio que se pagó.
--
-- Los topes viven en el entorno (`AI_DAILY_BUDGET_LEADS_USD`,
-- `AI_DAILY_BUDGET_PRO_USD`), no aquí: son una decisión de negocio que cambia
-- sin desplegar.
--
-- ⚠️ QUÉ NO ARREGLA. Los dos bolsillos son GLOBALES por público, no por
-- persona: un solo suscriptor puede agotar el de `pro` para los demás
-- suscriptores. Hoy no importa —`subscriptions` está vacía— pero cuando haya
-- varios pagando habrá que decidir si el tope pasa a ser por cuenta.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. La clave pasa a ser (día, público)
--
-- Lo que ya hay se queda como `lead`: es lo que era hasta hoy —gasto de gente
-- sin suscripción, porque no hay ninguna— así que el valor por defecto no
-- inventa nada, describe lo que pasó.
-- ----------------------------------------------------------------------------

alter table charcu.ai_spend
  add column if not exists audience text not null default 'lead'
  check (audience in ('lead', 'pro'));

alter table charcu.ai_spend drop constraint ai_spend_pkey;
alter table charcu.ai_spend add primary key (day, audience);

-- ----------------------------------------------------------------------------
-- 2. Apuntar el gasto, ahora en el bolsillo que toca
--
-- Sigue siendo UNA sentencia atómica: dos peticiones a la vez no pueden pisarse
-- y colar gasto por encima del tope. Ese era el motivo del `on conflict` y no
-- cambia; lo único que cambia es que el conflicto ahora incluye el público.
--
-- La firma vieja se DEJA CAER: mientras existiera, una llamada que se olvidara
-- del público seguiría compilando y sumaría en silencio al bolsillo
-- equivocado, que es peor que un error.
-- ----------------------------------------------------------------------------

drop function if exists charcu.record_ai_spend(bigint, bigint, bigint, numeric);

create or replace function charcu.record_ai_spend(
  p_prompt_tokens  bigint,
  p_thought_tokens bigint,
  p_answer_tokens  bigint,
  p_cost_usd       numeric,
  p_audience       text
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_total    numeric;
  v_audience text := case when p_audience = 'pro' then 'pro' else 'lead' end;
begin
  insert into charcu.ai_spend as s
    (day, audience, requests, prompt_tokens, thought_tokens, answer_tokens, cost_usd)
  values
    (current_date, v_audience, 1, p_prompt_tokens, p_thought_tokens, p_answer_tokens, p_cost_usd)
  on conflict (day, audience) do update set
    requests       = s.requests + 1,
    prompt_tokens  = s.prompt_tokens + excluded.prompt_tokens,
    thought_tokens = s.thought_tokens + excluded.thought_tokens,
    answer_tokens  = s.answer_tokens + excluded.answer_tokens,
    cost_usd       = s.cost_usd + excluded.cost_usd,
    updated_at     = now()
  returning s.cost_usd into v_total;

  return v_total;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. Cuánto lleva gastado hoy ESE público
--
-- ⚠️ Un público NO ve el gasto del otro, y ahí está todo el sentido del
-- cambio: que los anónimos se coman su bolsillo no puede tocar al que paga.
-- ----------------------------------------------------------------------------

drop function if exists charcu.today_ai_spend();

create or replace function charcu.today_ai_spend(p_audience text)
returns numeric
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select cost_usd
       from charcu.ai_spend
      where day = current_date
        and audience = case when p_audience = 'pro' then 'pro' else 'lead' end),
    0
  );
$$;

-- ----------------------------------------------------------------------------
-- Estas funciones mueven dinero: solo el servidor las llama
-- ----------------------------------------------------------------------------

revoke all on function charcu.record_ai_spend(bigint, bigint, bigint, numeric, text)
  from public, anon, authenticated;
grant execute on function charcu.record_ai_spend(bigint, bigint, bigint, numeric, text)
  to service_role;

revoke all on function charcu.today_ai_spend(text) from public, anon, authenticated;
grant execute on function charcu.today_ai_spend(text) to service_role;
