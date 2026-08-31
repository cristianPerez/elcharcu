-- ============================================================================
-- Cápsulas, lista de espera y desbloqueo secuencial (2026-08-29)
--
-- El problema real que resuelve: grabar y editar video tiene bloqueado a
-- Cristian y la plataforma se ve vacía. La salida no es grabar más rápido, es
-- que la escasez juegue a favor.
--
-- ⚠️ LA DIFERENCIA ENTRE CÁPSULA Y CURSO NO ES EL FORMATO.
--
-- `lessons.kind` ya acepta video, pdf, imagen y texto, y un curso también tiene
-- PDFs y textos. Lo que separa a los dos es la PROMESA:
--
--   cápsula → resuelve UNA duda      ("cómo bridar un jamón")
--   curso   → acompaña un PROCESO    ("lomo curado de principio a fin")
--
-- De ahí sale todo lo demás: la cápsula dura 3-6 minutos, es gratis y es el
-- anzuelo; el curso dura días, es de pago y —si no está grabado— abre lista de
-- espera. Nadie hace cola por cuatro minutos.
--
-- Por eso `kind` va en `courses` y NO se crea un modelo de contenido paralelo.
-- La 0011 ya explica a qué lleva eso: dos tablas para lo mismo hacen que
-- alguien acabe escribiendo en la equivocada. Una cápsula es una fila de
-- `courses` con un módulo y una a tres lecciones.
--
-- El carrusel de imágenes queda APLAZADO a propósito (ver ESTADO.md).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. `courses.kind` — la promesa, no el formato
-- ----------------------------------------------------------------------------

alter table charcu.courses
  add column kind text not null default 'curso'
    check (kind in ('capsula', 'curso'));

comment on column charcu.courses.kind is
  'capsula = resuelve una duda (corta, gratis, sin lista de espera). '
  'curso = acompaña un proceso (largo, de pago, con lista de espera). '
  'No describe el formato: eso es lessons.kind.';

-- ----------------------------------------------------------------------------
-- 2. El índice único de `position` pasa a ser por tipo
--
-- Estaba como único GLOBAL. Con cápsulas y cursos conviviendo, la cápsula nº1 y
-- el curso nº1 chocarían aunque se pinten en filas distintas de la pantalla, y
-- el `insert` reventaría sin que se entienda por qué. Cada carril se numera
-- solo.
-- ----------------------------------------------------------------------------

drop index if exists charcu.courses_position_idx;

create unique index courses_kind_position_idx
  on charcu.courses (kind, position);

-- ----------------------------------------------------------------------------
-- 3. `status = 'lista-de-espera'`
--
-- Un curso que no está grabado no se esconde: se muestra con su portada, su
-- temario y cuánta gente lo espera. Un curso invisible no se vende (fue justo
-- la lección de la migración del catálogo, el 2026-08-21).
-- ----------------------------------------------------------------------------

-- `if exists` porque el nombre lo puso Postgres solo (`<tabla>_<columna>_check`)
-- al declararlo en la columna, y un nombre implícito es exactamente la clase de
-- cosa que uno da por segura hasta que la migración se cae en producción.
alter table charcu.courses
  drop constraint if exists courses_status_check;

alter table charcu.courses
  add constraint courses_status_check
    check (status in ('borrador', 'lista-de-espera', 'publicado'));

-- Cuánta gente hace falta para que Cristian se comprometa a grabarlo.
alter table charcu.courses
  add column waitlist_goal integer
    check (waitlist_goal is null or waitlist_goal > 0);

-- ----------------------------------------------------------------------------
-- 4. `unlock_mode` — el desbloqueo secuencial
--
-- `libre`: se ve en cualquier orden. Es lo que hay hoy y sigue siendo el
-- default, porque a quien PAGÓ no se le esconde lo que compró — eso acaba en
-- reembolso, y con razón.
--
-- `secuencial`: la siguiente lección se abre al terminar la anterior. Es para
-- la ruta GRATIS de cápsulas, donde hace de guía y no de peaje.
-- ----------------------------------------------------------------------------

alter table charcu.courses
  add column unlock_mode text not null default 'libre'
    check (unlock_mode in ('libre', 'secuencial'));

-- ----------------------------------------------------------------------------
-- 5. El catálogo también enseña lo que está en lista de espera
--
-- `courses_select_visible` filtraba por `status = 'publicado'` a secas. Sin
-- tocarla, un curso en lista de espera sería invisible y la lista de espera no
-- existiría.
--
-- ⚠️ `can_read_course()` NO se toca. Es la que protege el CONTENIDO, y un curso
-- en lista de espera no tiene contenido que dar: sigue exigiendo 'publicado'.
-- Se enseña el escaparate; la mercancía no sale.
-- ----------------------------------------------------------------------------

drop policy if exists courses_select_visible on charcu.courses;

create policy courses_select_visible on charcu.courses
  for select to anon, authenticated
  using (status in ('publicado', 'lista-de-espera'));

-- El temario también, que es lo que hace desear el curso. `course_outline`
-- devuelve SOLO títulos, resúmenes y orden — nunca `bunny_video_id`, ni `body`,
-- ni `file_url`. Los enlaces de Bunny no van firmados: con el id se vería el
-- video sin pagar.
create or replace function charcu.course_outline(p_slug text)
returns table (
  module_id       uuid,
  module_title    text,
  module_summary  text,
  module_position integer,
  lesson_id       uuid,
  lesson_title    text,
  lesson_summary  text,
  lesson_position integer,
  lesson_kind     text
)
language sql
stable
security definer
set search_path = ''
as $$
  select m.id, m.title, m.summary, m.position,
         l.id, l.title, l.summary, l.position, l.kind
    from charcu.courses c
    join charcu.modules m on m.course_id = c.id
    join charcu.lessons l on l.module_id = m.id
   where c.slug = p_slug
     -- Un borrador no enseña ni su índice. Publicado y lista de espera, sí.
     and c.status in ('publicado', 'lista-de-espera')
   order by m.position, l.position;
$$;

revoke all on function charcu.course_outline(text) from public;
grant execute on function charcu.course_outline(text) to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 6. `course_waitlist` — quién espera qué
--
-- Solo se apunta quien tenga suscripción viva. Es la promesa de la suscripción
-- hecha visible, y filtra el ruido de quien nunca va a pagar.
-- ----------------------------------------------------------------------------

create table charcu.course_waitlist (
  course_id  uuid not null references charcu.courses (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (course_id, user_id)
);

create index course_waitlist_user_idx on charcu.course_waitlist (user_id);

alter table charcu.course_waitlist enable row level security;

-- Cada quien ve en qué colas está. A la lista de OTROS no se llega nunca: el
-- número público sale de `course_waitlist_count()`, que devuelve un entero y
-- ningún nombre. Quién se apuntó a un curso de embutidos es dato personal
-- (Ley 1581 de 2012) y no tiene por qué salir de aquí.
create policy course_waitlist_select_own on charcu.course_waitlist
  for select to authenticated using ((select auth.uid()) = user_id);

-- Borrarse de la cola es suyo y no necesita función: es su propia fila.
create policy course_waitlist_delete_own on charcu.course_waitlist
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, delete on charcu.course_waitlist to authenticated;

-- ----------------------------------------------------------------------------
-- Apuntarse
--
-- Pasa por función y no por `insert` con política, porque hay tres cosas que
-- comprobar y una política de `insert` solo sabe decir sí o no — sin decir cuál
-- de las tres falló, que es justo lo que la pantalla necesita para responder
-- algo útil.
-- ----------------------------------------------------------------------------

create or replace function charcu.join_waitlist(p_course_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_status  text;
begin
  if v_user_id is null then
    raise exception 'sin-sesion';
  end if;

  select status into v_status
    from charcu.courses
   where id = p_course_id;

  if v_status is null then
    raise exception 'curso-no-existe';
  end if;

  -- Apuntarse a algo que ya está publicado no significa nada: ábrelo y ya.
  if v_status <> 'lista-de-espera' then
    raise exception 'curso-no-esta-en-lista-de-espera';
  end if;

  if not charcu.has_active_subscription(v_user_id) then
    raise exception 'necesita-suscripcion';
  end if;

  -- Tocar dos veces el botón no suma dos personas al contador.
  insert into charcu.course_waitlist (course_id, user_id)
  values (p_course_id, v_user_id)
  on conflict (course_id, user_id) do nothing;

  return (
    select count(*)::integer
      from charcu.course_waitlist
     where course_id = p_course_id
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- El contador público
--
-- Devuelve un número y nada más. La barra "18 de 30 esperando" la puede ver
-- cualquiera —es lo que empuja a apuntarse— sin que se filtre una sola
-- identidad.
--
-- ⚠️ Este número NO se infla nunca. Si se hace una vez, el mecanismo entero
-- queda muerto: esta plataforma se vende sobre la confianza en una persona
-- real, y una barra falsa es exactamente lo que la rompe.
-- ----------------------------------------------------------------------------

create or replace function charcu.course_waitlist_count(p_course_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
    from charcu.course_waitlist
   where course_id = p_course_id;
$$;

-- Si el usuario ya está en la cola, para que el botón diga "ya estás dentro" en
-- vez de invitarlo otra vez.
create or replace function charcu.is_in_waitlist(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from charcu.course_waitlist
     where course_id = p_course_id
       and user_id = (select auth.uid())
  );
$$;

revoke all on function charcu.join_waitlist(uuid) from public, anon;
revoke all on function charcu.course_waitlist_count(uuid) from public;
revoke all on function charcu.is_in_waitlist(uuid) from public, anon;

grant execute on function charcu.join_waitlist(uuid) to authenticated, service_role;
grant execute on function charcu.course_waitlist_count(uuid) to anon, authenticated, service_role;
grant execute on function charcu.is_in_waitlist(uuid) to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 7. ¿Puede abrir ESTA lección?
--
-- Con `unlock_mode = 'secuencial'` hay que saber si terminó la anterior. La
-- comprobación vive aquí y no en la pantalla, por lo mismo de siempre (D12):
-- desde el navegador se salta cualquier candado pintado.
--
-- El orden es el de siempre: módulo, y dentro del módulo, lección.
-- ----------------------------------------------------------------------------

create or replace function charcu.can_open_lesson(p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  with target as (
    select l.id, m.course_id, m.position as module_position, l.position as lesson_position
      from charcu.lessons l
      join charcu.modules m on m.id = l.module_id
     where l.id = p_lesson_id
  )
  select
    -- Lo primero, siempre: ¿el curso es suyo de ver?
    charcu.can_read_course(t.course_id)
    and (
      (select unlock_mode from charcu.courses where id = t.course_id) = 'libre'
      -- Secuencial: no queda ninguna lección ANTERIOR sin terminar.
      or not exists (
        select 1
          from charcu.lessons l2
          join charcu.modules m2 on m2.id = l2.module_id
          left join charcu.lesson_progress p
            on p.lesson_id = l2.id and p.user_id = (select auth.uid())
         where m2.course_id = t.course_id
           and (m2.position, l2.position) < (t.module_position, t.lesson_position)
           and p.completed_at is null
      )
    )
  from target t;
$$;

revoke all on function charcu.can_open_lesson(uuid) from public;
grant execute on function charcu.can_open_lesson(uuid) to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 8. Marcar el progreso respeta el candado secuencial
--
-- Sin esto, `save_lesson_progress` seguiría aceptando "terminé la lección 5" de
-- alguien que no ha visto la 1, y el desbloqueo se abriría solo llamando a la
-- ruta a mano. Se cambia `can_read_course` por `can_open_lesson`, que incluye
-- la primera comprobación.
-- ----------------------------------------------------------------------------

create or replace function charcu.save_lesson_progress(
  p_lesson_id uuid,
  p_second    integer default 0,
  p_completed boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_allowed boolean;
begin
  if v_user_id is null then
    raise exception 'sin-sesion';
  end if;

  v_allowed := charcu.can_open_lesson(p_lesson_id);

  if v_allowed is not true then
    raise exception 'leccion-no-permitida';
  end if;

  insert into charcu.lesson_progress (user_id, lesson_id, last_second, completed_at)
  values (
    v_user_id,
    p_lesson_id,
    greatest(coalesce(p_second, 0), 0),
    case when p_completed then now() else null end
  )
  on conflict (user_id, lesson_id) do update
    set last_second = greatest(charcu.lesson_progress.last_second, excluded.last_second),
        -- Una vez terminada, se queda terminada: volver a abrirla para mirar
        -- un detalle no debería descontarle el avance a nadie.
        completed_at = coalesce(charcu.lesson_progress.completed_at, excluded.completed_at),
        updated_at  = now();
end;
$$;
