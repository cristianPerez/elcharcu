-- ============================================================================
-- `course_outline`: `join` en vez de `left join` (2026-08-21)
--
-- La versión de hace un rato salió con `left join charcu.lessons`. Con eso, un
-- módulo sin lecciones devolvía una fila con `lesson_id` y compañía en null, y
-- el tipo generado para TypeScript los declara NO nulos — la firma mentía y el
-- código de la app tenía que defenderse de nulos que el tipo negaba.
--
-- Un módulo vacío no tiene nada que enseñar en el acordeón, así que la respuesta
-- correcta es no devolverlo. La migración anterior ya quedó corregida en disco
-- para una base nueva; esta existe para las que ya la habían corrido (QA).
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
    join charcu.lessons l on l.module_id = m.id
   where c.slug = p_slug
     and c.status = 'publicado'
   order by m.position, l.position;
$$;

revoke all on function charcu.course_outline(text) from public;
grant execute on function charcu.course_outline(text) to anon, authenticated, service_role;
