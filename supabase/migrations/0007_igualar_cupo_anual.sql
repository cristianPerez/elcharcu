-- ============================================================================
-- El anual da lo mismo que el mensual
--
-- Al pasar la página de precios a un toggle "mensual / anual" del MISMO plan,
-- los dos ciclos tienen que incluir lo mismo: el toggle promete "el mismo
-- plan, más barato si pagas el año". El anual daba 300 preguntas y 50 fotos
-- contra 200 y 30 del mensual, y eso convertía el toggle en dos productos
-- distintos disfrazados de uno.
--
-- La ventaja del anual pasa a ser solo el precio: 8 mensualidades por 12 meses.
-- ============================================================================

update charcu.plan_quotas
   set questions_per_month = 200,
       images_per_month    = 30
 where plan_id = 'anual';
