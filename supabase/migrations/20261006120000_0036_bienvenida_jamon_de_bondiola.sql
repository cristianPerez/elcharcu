-- ============================================================================
-- El Jamón de Bondiola Ahumado estrena su video de bienvenida (2026-10-06)
--
-- Es el PRIMER video grabado para este curso. Hasta hoy los cuatro eran de
-- relleno —los del lomo curado en rueda, ver 0034—, y la bienvenida enseñaba
-- sal cayendo sobre un lomo en un táper: justo lo contrario de "esto es lo que
-- vas a lograr". El nuevo (Bunny "bienvenida 1.mp4", 15 s) es la bondiola ya
-- ahumada cortándose en lonchas.
--
-- ⚠️ SE ACTUALIZA LA LECCIÓN EN SU SITIO, igual que en 0035: el avance de
-- quien ya la vio cuelga de su id. Mismo id, video nuevo.
--
-- Los tres videos del paso a paso siguen siendo de relleno.
-- ============================================================================

update charcu.lessons l
   set bunny_video_id = 'ff6795d8-dc22-4276-8a4e-2b3e4ce3c03a',
       duration_s     = 15
  from charcu.modules mo
  join charcu.courses c on c.id = mo.course_id
 where l.module_id = mo.id
   and c.slug      = 'jamon-de-bondiola-ahumado'
   and mo.position = 0
   and l.position  = 0;
