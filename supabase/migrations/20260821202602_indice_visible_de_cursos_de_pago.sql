-- ============================================================================
-- El ÍNDICE de un curso de pago se puede ver; su contenido no (2026-08-21)
--
-- Pedido de Cristian: que se vean los módulos y las lecciones de un curso de
-- pago, y que el muro aparezca al INTENTAR ABRIR una lección. Ver la tabla de
-- contenidos es lo que hace desear el curso; un candado sin nada detrás no
-- vende, solo frustra.
--
-- ⚠️ POR QUÉ UNA FUNCIÓN Y NO ABRIR LA RLS DE `lessons`.
--
-- Si se relajara la política de `lessons`, cualquiera podría leer la tabla por
-- la API y sacar `bunny_video_id` — y los enlaces de Bunny hoy NO van firmados,
-- así que con ese id se ve el video sin pagar. Se regalaría el producto por
-- enseñar el índice.
--
-- Esta función devuelve SOLO lo que se pinta en el acordeón: títulos, resúmenes
-- y orden. Nunca `bunny_video_id`, ni `body`, ni `file_url`, ni `ask`. Es la
-- diferencia entre enseñar la carta y regalar el plato.
--
-- Las políticas de `modules` y `lessons` NO se tocan: siguen cerradas con
-- `can_read_course()`, que es quien protege el contenido de verdad.
-- ============================================================================

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
    -- `join` y no `left join`: un módulo sin lecciones no tiene nada que
    -- enseñar, y con `left join` la fila saldría con todo en null y obligaría a
    -- que el tipo de TypeScript admitiera nulos que en la práctica no se pintan.
    join charcu.lessons l on l.module_id = m.id
   where c.slug = p_slug
     -- Un curso en borrador no enseña ni su índice.
     and c.status = 'publicado'
   order by m.position, l.position;
$$;

revoke all on function charcu.course_outline(text) from public;
grant execute on function charcu.course_outline(text) to anon, authenticated, service_role;
