-- ============================================================================
-- Tope de gasto diario de la IA
--
-- Lleva la cuenta de lo que se gasta en Gemini cada día. Vive en la base y no
-- en memoria a propósito: en producción el servidor se apaga y se reinicia
-- solo, y un contador en memoria se borraría con él.
--
-- Nadie puede leer ni escribir esta tabla desde el navegador: no tiene ninguna
-- política de RLS, así que la única llave que entra es la clave de servicio.
-- ============================================================================

create table charcu.ai_spend (
  day             date primary key default current_date,
  requests        integer not null default 0,
  prompt_tokens   bigint  not null default 0,
  thought_tokens  bigint  not null default 0,
  answer_tokens   bigint  not null default 0,
  cost_usd        numeric(12, 6) not null default 0,
  updated_at      timestamptz not null default now()
);

alter table charcu.ai_spend enable row level security;
-- Sin políticas = nadie desde el cliente. Intencionado.

-- Suma una llamada al día de hoy y devuelve el total acumulado.
-- Es una sola sentencia atómica para que dos peticiones a la vez no se pisen
-- y dejen pasar gasto por encima del tope.
create or replace function charcu.record_ai_spend(
  p_prompt_tokens  bigint,
  p_thought_tokens bigint,
  p_answer_tokens  bigint,
  p_cost_usd       numeric
)
returns numeric
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_total numeric;
begin
  insert into charcu.ai_spend as s
    (day, requests, prompt_tokens, thought_tokens, answer_tokens, cost_usd)
  values
    (current_date, 1, p_prompt_tokens, p_thought_tokens, p_answer_tokens, p_cost_usd)
  on conflict (day) do update set
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

-- Cuánto se lleva gastado hoy. 0 si todavía no se ha llamado.
create or replace function charcu.today_ai_spend()
returns numeric
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select cost_usd from charcu.ai_spend where day = current_date),
    0
  );
$$;

-- Estas funciones mueven dinero: solo el servidor las puede llamar.
revoke all on function charcu.record_ai_spend(bigint, bigint, bigint, numeric)
  from public, anon, authenticated;
revoke all on function charcu.today_ai_spend() from public, anon, authenticated;

grant execute on function charcu.record_ai_spend(bigint, bigint, bigint, numeric)
  to service_role;
grant execute on function charcu.today_ai_spend() to service_role;
