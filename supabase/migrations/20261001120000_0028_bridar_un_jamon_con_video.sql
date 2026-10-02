-- ============================================================================
-- La cápsula de bridar pasa de dos lecciones a cuatro, dos de ellas en video
-- (2026-10-01)
--
-- Orden final:
--   10  Por qué se brida               texto   (igual)
--   20  Cuánto hilo le pones           video   NUEVA
--   30  Cómo queda parejo              texto   (era la 20)
--   40  Cómo se brida, paso a paso     video   NUEVA
--
-- La medida va antes del "cómo queda parejo" porque es lo primero que se hace
-- con la pieza delante: cortar el hilo. El video del bridado va al final
-- porque junta todo lo anterior.
--
-- `lessons_module_position_idx` es único y no diferible: por eso se mueve
-- primero la 20 a la 30 (que está libre) y luego se inserta en la 20.
--
-- Se engancha por slug y posición del módulo, como el resto: los uuid los
-- genera la base y en una base vacía no se conocen.
-- ============================================================================

update charcu.lessons l
   set position = 30
  from charcu.modules mo
  join charcu.courses c on c.id = mo.course_id
 where l.module_id = mo.id
   and c.slug      = 'bridar-un-jamon'
   and mo.position = 10
   and l.position  = 20;

insert into charcu.lessons
  (module_id, kind, title, summary, position, bunny_video_id, ask)
select mo.id, 'video', l.title, l.summary, l.position, l.bunny_video_id, l.ask
  from (values
    ('Cuánto hilo le pones', 20,
     'Se mide sobre la pieza antes de cortar. Quedarse corto a mitad del bridado obliga a empezar de nuevo.',
     'cc530a6d-fe22-4583-b912-e332599ccaff',
     '¿Cuánto hilo necesito para bridar una pieza de 2 kg?'),

    ('Cómo se brida, paso a paso', 40,
     'El bridado completo, de la primera vuelta al ojal para colgar.',
     '8cd7c4f5-c6a6-447d-8a56-e09c5ba0eae0',
     'Se me afloja el hilo mientras brido. ¿Qué estoy haciendo mal?')
  ) as l(title, position, summary, bunny_video_id, ask)
  join charcu.courses c  on c.slug = 'bridar-un-jamon'
  join charcu.modules mo on mo.course_id = c.id and mo.position = 10;
