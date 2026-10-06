-- ============================================================================
-- Jamón de Bondiola Ahumado: "Terminar" pasa a ser solo el corte (2026-10-06)
--
-- Cristian pidió que el módulo final sea el video del día siguiente —afilar
-- y cortar— y que se quiten las tres lecciones que tenía, salidas de la
-- receta escrita:
--
--   · Cómo cocinarlo y servirlo   texto
--   · Lo que dice el charcutero   texto
--   · Así tiene que quedar        imagen
--
-- Se borran. Antes de hacerlo se miró producción: NADIE tenía avance en
-- ninguna de las tres (`lesson_progress` vacío para sus ids), así que el
-- `on delete cascade` no le quita nada a nadie.
--
-- "Al día siguiente: afilar y cortar" se MUEVE, no se borra y se crea: se le
-- cambia el módulo y conserva su id, y con él el avance de quien ya la vio.
-- Con esto el curso queda en 10 lecciones.
-- ============================================================================

delete from charcu.lessons l
 using charcu.modules mo, charcu.courses c
 where l.module_id = mo.id
   and mo.course_id = c.id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 5;

update charcu.lessons l
   set module_id = fin.id,
       position  = 0
  from charcu.modules paso
  join charcu.courses c   on c.id = paso.course_id
  join charcu.modules fin on fin.course_id = c.id and fin.position = 5
 where l.module_id = paso.id
   and c.slug      = 'jamon-de-bondiola-ahumado'
   and paso.position = 4
   and l.position    = 4;

update charcu.modules mo
   set summary = 'Al día siguiente, el corte.'
  from charcu.courses c
 where c.id = mo.course_id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 5;

-- El paso a paso ya no llega hasta el corte.
update charcu.modules mo
   set summary = 'Del rub al choque térmico, en orden.'
  from charcu.courses c
 where c.id = mo.course_id
   and c.slug = 'jamon-de-bondiola-ahumado'
   and mo.position = 4;
