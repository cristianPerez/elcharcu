-- ============================================================================
-- 0059 · CALENDARIO DE ESTRENOS: UN CURSO NUEVO CADA MIÉRCOLES (2026-11-10)
--
-- Decisión de Cristian: los cursos que todavía tienen videos de relleno (los
-- del lomo curado, en rueda, desde la 0034) dejan de estar publicados y pasan
-- a "Próximamente" con una fecha firme. El primero sale en 8 días, el
-- miércoles 18 de noviembre, y después uno por semana hasta el último.
--
--   · `releases_on` es la PROMESA que se le hace a quien paga ("sale el
--     miércoles 18"). Es una fecha, no una hora, y no publica nada sola: el
--     día del estreno el curso se publica con sus videos reales, a mano.
--   · Se usa el estado `lista-de-espera` que ya existía: enseña el temario,
--     cierra el contenido para todos (RLS) y deja apuntarse para el aviso. Ya
--     no hace falta una meta de gente (`waitlist_goal`) porque hay fecha.
--   · Los tres que ya estaban en lista de espera (longaniza, chorizo paisa,
--     chorizo de ajo) entran al final del calendario.
--   · Quedan publicados los que tienen videos de verdad: lomo curado, jamón
--     de bondiola y chorizos de jalapeño.
--   · `kielbasa-de-mozzarella-y-jalapeno` pasa a `borrador`: su receta es la
--     que ahora enseña el curso de jalapeño, cheddar y mozzarella (0058).
--     Tener los dos sería prometer el mismo curso dos veces.
--   · El progreso de quien abrió estos cursos no se borra: vuelve a estar
--     cuando se publiquen.
--
-- Los diez cursos nuevos sacados del recetario siguen en la 0060, del 27 de
-- enero en adelante.
-- ============================================================================

alter table charcu.courses
  add column if not exists releases_on date;

comment on column charcu.courses.releases_on is
  'Día en que se estrena el curso (lo que se le promete a quien paga). No publica nada solo: el estreno se hace a mano, cambiando status a publicado.';

update charcu.courses c
   set status        = 'lista-de-espera',
       releases_on   = cal.releases_on,
       waitlist_goal = null,
       updated_at    = now()
  from (values
    ('chorizo-santarrosano',            date '2026-11-18'),
    ('salchichon-cervecero-colombiano', date '2026-11-25'),
    ('kielbasa-polaca',                 date '2026-12-02'),
    ('salami-de-res',                   date '2026-12-09'),
    ('kielbasa-de-pollo',               date '2026-12-16'),
    ('charqui-de-res',                  date '2026-12-23'),
    ('queso-burrata',                   date '2026-12-30'),
    ('longaniza-colombiana',            date '2027-01-06'),
    ('chorizo-paisa',                   date '2027-01-13'),
    ('chorizo-de-ajo',                  date '2027-01-20')
  ) as cal (slug, releases_on)
 where c.slug = cal.slug;

update charcu.courses
   set status = 'borrador', updated_at = now()
 where slug = 'kielbasa-de-mozzarella-y-jalapeno';
