-- ============================================================================
-- Pedidos de cursos (2026-10-03)
--
-- El rediseño de "Cursos maestros" tiene dos formas de decir "quiero esto":
--
--   · "Quiero un curso de quesos" — en una categoría que todavía no tiene
--     cursos. Es un voto: se guarda la CATEGORÍA y nada más.
--   · "¿Qué pieza quieres aprender?" — texto libre, para lo que no cabe en
--     ninguna categoría ("pastrami", "chorizo español").
--
-- Es la misma pregunta que responde la lista de espera —qué grabar primero—
-- pero ANTES de que el curso exista, así que vive aparte: `course_waitlist`
-- cuelga de un curso concreto y aquí todavía no hay curso.
--
-- ⚠️ A diferencia de la lista de espera (0021), esto lo puede hacer CUALQUIERA
-- con cuenta, pague o no. Pedir no crea ninguna expectativa de fecha —el texto
-- de la pantalla lo dice: "el más pedido se graba primero"— y la demanda de
-- quien todavía no paga es justo la que hace falta para saber qué lo haría
-- pagar.
--
-- Nadie lee los pedidos de otros: ni el contador sale de aquí. Es una señal
-- para Cristian, no un número público.
-- ============================================================================

create table if not exists charcu.course_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category    text
                check (category in (
                  'chorizos', 'jamones-curados', 'jamones-cocidos', 'embutidos-frescos', 'quesos'
                )),
  body        text check (char_length(body) between 3 and 280),
  created_at  timestamptz not null default now(),
  -- Un pedido dice o QUÉ CATEGORÍA o QUÉ PIEZA; vacío no significa nada.
  constraint course_requests_something check (category is not null or body is not null)
);

comment on table charcu.course_requests is
  'Cursos que la gente pide antes de que existan: votos por categoría y propuestas libres.';

-- Votar dos veces la misma categoría no cuenta doble. Las propuestas libres
-- sí se pueden repetir: cada una es un texto distinto.
create unique index if not exists course_requests_one_vote_per_category
  on charcu.course_requests (user_id, category)
  where category is not null and body is null;

create index if not exists course_requests_category_idx
  on charcu.course_requests (category);

alter table charcu.course_requests enable row level security;

-- Cada quien escribe los suyos, y solo como sí mismo.
create policy course_requests_insert_own on charcu.course_requests
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- Y lee solo los suyos: para pintar "✓ Lo pediste" y nada más.
create policy course_requests_select_own on charcu.course_requests
  for select to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert on charcu.course_requests to authenticated;
grant all on charcu.course_requests to service_role;
