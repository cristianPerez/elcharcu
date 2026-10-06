-- ============================================================================
-- Jamón de Bondiola Ahumado: la pregunta de los gramos, con selector
-- (2026-10-06)
--
-- "Ingredientes y proporción" estrena el primer `ask` con hueco: `{gramos}`.
-- La lección lo pinta con `QuantityAsk` (features/quantity-ask): un − y un +
-- para poner la carne que se tiene, y la pregunta sale completa al asistente.
--
-- El nombre de la receta va escrito entero a propósito: así el servidor la
-- reconoce (`findMentionedRecipe`) y El Charcu contesta con sus cantidades.
--
-- La pregunta que tenía esta lección —¿por qué la sal de cura #1 y no la #2?—
-- se pasa al video de pesaje, que es donde se ve pesar la sal de cura. La que
-- tenía ese video ("mis bondiolas no pesan 4,2 kg…") es justo la que ahora
-- resuelve el selector, así que sale.
-- ============================================================================

update charcu.lessons l
   set ask = $t$¿Qué cantidad de cada ingrediente le pongo a la receta de Jamón de Bondiola Ahumado si tengo {gramos} gramos de carne?$t$
  from charcu.modules mo
  join charcu.courses c on c.id = mo.course_id
 where l.module_id = mo.id
   and c.slug      = 'jamon-de-bondiola-ahumado'
   and mo.position = 3
   and l.position  = 0;

update charcu.lessons l
   set ask = $t$El Jamón de Bondiola Ahumado lleva 2,5 g de sal de cura #1 por kilo. ¿Por qué la #1 y no la #2 si la pieza se cura antes de ahumar? ¿Qué pasa exactamente si me paso de esa cantidad, y se puede hacer sin ella?$t$
  from charcu.modules mo
  join charcu.courses c on c.id = mo.course_id
 where l.module_id = mo.id
   and c.slug      = 'jamon-de-bondiola-ahumado'
   and mo.position = 3
   and l.position  = 1;
