-- ============================================================================
-- Las lecciones de la bondiola pasan a tener video (2026-08-20)
--
-- ⚠️ TEMPORAL: las cuatro apuntan AL MISMO video. Es a propósito — Cristian
-- quiere ver cómo se comporta el reproductor vertical y medir el rendimiento
-- antes de subir los definitivos. Cuando estén, se cambia `bunny_video_id`
-- lección por lección y no hace falta tocar nada más.
--
-- El `summary` NO se pierde al cambiar de tipo: la pantalla lo sigue pintando
-- encima del reproductor. Lo único que deja de verse es `body`, que era el
-- mismo texto con la duración pegada al final.
--
-- El id de la biblioteca (733344) vive en `src/shared/config/video.ts`, no
-- aquí: en la base va solo el id del video, que es lo que cambia por lección.
-- ============================================================================

update charcu.lessons
   set kind           = 'video',
       bunny_video_id = 'ed241fed-668b-4640-93c4-16ba7a020cf9'
 where module_id in (
   select m.id
     from charcu.modules m
     join charcu.courses c on c.id = m.course_id
    where c.slug = 'bondiola-curada'
 );
