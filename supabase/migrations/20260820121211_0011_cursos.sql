-- ============================================================================
-- Los cursos: curso ▸ módulo ▸ lección
--
-- Hasta hoy un "curso" era una constante de TypeScript (`entities/guided-recipe`)
-- con una lista plana de pasos. Eso aguanta una receta; con diez es inmanejable
-- y no permite lo que de verdad hace volver a la gente: saber por dónde iba.
--
-- ¿Por qué `lessons` y no `videos`? Porque un curso no es solo video: hay
-- tablas de dosis en PDF, fotos de moho para comparar y pasos que se leen. Si
-- la tabla se llamara `videos`, el día del primer PDF habría filas en `videos`
-- que no son videos, y todo el código que las lee empezaría a mentir. `kind`
-- deja la puerta abierta sin cambiar la estructura.
--
-- El ORDEN es un campo (`position`) en los tres niveles, no el `id`: reordenar
-- un módulo tiene que ser cambiar números, no reescribir claves ajenas.
--
-- El PROGRESO se apunta por lección y se MUESTRA por curso (pedido de Cristian,
-- 2026-08-19). Nunca se guarda un porcentaje: si el curso pasa de 10 a 12
-- lecciones, quien iba al 100% bajaría al 83% y creería que perdió algo.
-- Contando, se recalcula solo.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- courses
-- ----------------------------------------------------------------------------

create table charcu.courses (
  id          uuid primary key default gen_random_uuid(),
  -- Lo que va en la URL. Es estable: cambiarlo rompe enlaces ya compartidos.
  slug        text not null unique,
  title       text not null,
  summary     text not null default '',
  cover_url   text,
  level       text not null default 'para-empezar'
                check (level in ('para-empezar', 'intermedio', 'avanzado')),
  -- La puerta. La vigila RLS aquí abajo, no la pantalla (D12).
  access      text not null default 'pago'
                check (access in ('libre', 'pago')),
  -- Un curso a medio cargar no se le enseña a nadie.
  status      text not null default 'borrador'
                check (status in ('borrador', 'publicado')),
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index courses_position_idx on charcu.courses (position);

create trigger courses_touch_updated_at
  before update on charcu.courses
  for each row execute function charcu.touch_updated_at();

-- ----------------------------------------------------------------------------
-- modules
-- ----------------------------------------------------------------------------

create table charcu.modules (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references charcu.courses (id) on delete cascade,
  title      text not null,
  summary    text not null default '',
  position   integer not null,
  created_at timestamptz not null default now()
);

-- Dos módulos en la misma posición dentro del mismo curso no tiene sentido:
-- el acordeón tendría que inventarse cuál va antes.
create unique index modules_course_position_idx
  on charcu.modules (course_id, position);

-- ----------------------------------------------------------------------------
-- lessons
--
-- Las columnas de origen son excluyentes y las vigila un `check`: una lección
-- de video SIN video no entra en la tabla. La alternativa era un `jsonb`, pero
-- eso muda la validación al TypeScript, y con la política de cero `any` del
-- repo acaba en guardas de tipo por todos lados.
-- ----------------------------------------------------------------------------

create table charcu.lessons (
  id              uuid primary key default gen_random_uuid(),
  module_id       uuid not null references charcu.modules (id) on delete cascade,
  kind            text not null
                    check (kind in ('video', 'pdf', 'imagen', 'texto')),
  title           text not null,
  summary         text not null default '',
  position        integer not null,

  -- Cuánto dura la lección, en segundos. Solo para video; en lo demás es null
  -- porque un PDF no dura nada — lo que dure depende de quien lo lea.
  duration_s      integer check (duration_s is null or duration_s > 0),
  -- Portada. En video es el frame; en el resto, la imagen de la tarjeta.
  poster_url      text,

  -- Origen, según el tipo.
  bunny_video_id  text,   -- kind = 'video'
  file_url        text,   -- kind = 'pdf' | 'imagen'
  body            text,   -- kind = 'texto'

  /**
   * La duda que casi todo el mundo tiene justo aquí, ya escrita.
   *
   * Es lo que une el curso con el asistente: en vez de terminar la lección y
   * quedarte solo con la pregunta, la pregunta es el siguiente botón. Venía
   * del experimento de la bondiola y se conserva.
   */
  ask             text,

  created_at      timestamptz not null default now(),

  constraint lessons_source_matches_kind check (
    case kind
      when 'video'  then bunny_video_id is not null or poster_url is not null
      when 'pdf'    then file_url is not null
      when 'imagen' then file_url is not null
      when 'texto'  then body is not null
    end
  )
);

create unique index lessons_module_position_idx
  on charcu.lessons (module_id, position);

-- ----------------------------------------------------------------------------
-- lesson_progress — una fila por (persona, lección)
--
-- `last_second` y `completed_at` NO son lo mismo: retomar a mitad de un video
-- y darlo por visto son dos preguntas distintas, y hacen falta las dos.
-- ----------------------------------------------------------------------------

create table charcu.lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_id    uuid not null references charcu.lessons (id) on delete cascade,
  -- Por dónde iba, para retomar donde lo dejó.
  last_second  integer not null default 0 check (last_second >= 0),
  -- Null mientras no la haya terminado.
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index lesson_progress_user_idx on charcu.lesson_progress (user_id);

create trigger lesson_progress_touch_updated_at
  before update on charcu.lesson_progress
  for each row execute function charcu.touch_updated_at();

-- ----------------------------------------------------------------------------
-- Quién puede ver qué (D12: la puerta vive en la base)
-- ----------------------------------------------------------------------------

alter table charcu.courses         enable row level security;
alter table charcu.modules         enable row level security;
alter table charcu.lessons         enable row level security;
alter table charcu.lesson_progress enable row level security;

/**
 * ¿Este curso se le puede enseñar a quien pregunta?
 *
 * Publicado, y además: o es libre, o tiene suscripción viva. Se escribe una
 * vez y las tres políticas la usan, para que módulos y lecciones no puedan
 * discrepar del curso al que pertenecen.
 */
create or replace function charcu.can_read_course(p_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from charcu.courses c
    where c.id = p_course_id
      and c.status = 'publicado'
      and (
        c.access = 'libre'
        or charcu.has_active_subscription((select auth.uid()))
      )
  );
$$;

create policy courses_select_visible on charcu.courses
  for select to anon, authenticated using (charcu.can_read_course(id));

create policy modules_select_visible on charcu.modules
  for select to anon, authenticated using (charcu.can_read_course(course_id));

create policy lessons_select_visible on charcu.lessons
  for select to anon, authenticated using (
    exists (
      select 1 from charcu.modules m
      where m.id = module_id and charcu.can_read_course(m.course_id)
    )
  );

-- El progreso es de cada quien y de nadie más.
create policy lesson_progress_select_own on charcu.lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);

-- ----------------------------------------------------------------------------
-- Guardar el progreso
--
-- Pasa por función y no por `insert` directo a propósito: hay que comprobar
-- que esa lección sea suya de ver. Si no, cualquiera marca como completado un
-- curso que no compró y el porcentaje deja de significar nada.
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

  select charcu.can_read_course(m.course_id)
    into v_allowed
    from charcu.lessons l
    join charcu.modules m on m.id = l.module_id
   where l.id = p_lesson_id;

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

-- ----------------------------------------------------------------------------
-- Cuánto lleva de cada curso
--
-- Se CALCULA, nunca se guarda. Y devuelve también cuál es la siguiente lección,
-- que es lo único que permite la pantalla de "sigue donde quedaste" — decirle
-- "vas por el 40%" no le sirve a nadie que abrió la app para continuar.
-- ----------------------------------------------------------------------------

create or replace function charcu.course_progress(p_user_id uuid)
returns table (
  course_id        uuid,
  total_lessons    integer,
  done_lessons     integer,
  percent          integer,
  next_lesson_id   uuid
)
language sql
stable
security definer
set search_path = ''
as $$
  with lessons_by_course as (
    select
      m.course_id,
      l.id as lesson_id,
      m.position as module_position,
      l.position as lesson_position,
      (p.completed_at is not null) as is_done
    from charcu.lessons l
    join charcu.modules m on m.id = l.module_id
    left join charcu.lesson_progress p
      on p.lesson_id = l.id and p.user_id = p_user_id
  ),
  totals as (
    select
      course_id,
      count(*)::integer as total_lessons,
      count(*) filter (where is_done)::integer as done_lessons
    from lessons_by_course
    group by course_id
  ),
  next_up as (
    -- La primera sin terminar, en el orden en que se ven las cosas.
    select distinct on (course_id) course_id, lesson_id
    from lessons_by_course
    where not is_done
    order by course_id, module_position, lesson_position
  )
  select
    t.course_id,
    t.total_lessons,
    t.done_lessons,
    case when t.total_lessons = 0 then 0
         else round(t.done_lessons * 100.0 / t.total_lessons)::integer
    end as percent,
    n.lesson_id as next_lesson_id
  from totals t
  left join next_up n on n.course_id = t.course_id;
$$;

-- ----------------------------------------------------------------------------
-- Permisos
-- ----------------------------------------------------------------------------

grant select on charcu.courses, charcu.modules, charcu.lessons to anon, authenticated;
grant select, insert, update on charcu.lesson_progress to authenticated;

revoke all on function charcu.save_lesson_progress(uuid, integer, boolean)
  from public, anon;
grant execute on function charcu.save_lesson_progress(uuid, integer, boolean)
  to authenticated, service_role;

grant execute on function charcu.can_read_course(uuid) to anon, authenticated, service_role;
grant execute on function charcu.course_progress(uuid) to authenticated, service_role;
