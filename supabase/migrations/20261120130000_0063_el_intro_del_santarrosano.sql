-- ============================================================================
-- 0063 · EL INTRO DEL SANTARROSANO TAMBIÉN DICE PIERNA (2026-11-20)
--
-- La 0062 cambió los ingredientes a "pierna de cerdo picada a cuchillo", pero
-- el párrafo de entrada de la receta seguía con el texto viejo: "700 g de
-- carne magra de cerdo", sin mencionar el cuchillo. Es lo primero que se lee
-- en la página, justo encima de una tabla que dice otra cosa.
-- ============================================================================

update charcu.recetario
   set content = content || jsonb_build_object(
         'intro', $t$🔥 Así se prepara uno de los chorizos más tradicionales de Colombia: el chorizo santarrosano, el de Santa Rosa de Cabal. 🌭

700 g de pierna de cerdo y 300 g de tocino, los dos picados a cuchillo. Esa es la receta entera, y el cuchillo es la mitad del trabajo: corta la grasa en vez de aplastarla, y por eso el chorizo queda jugoso, de grano grueso y perfecto para la parrilla.$t$
       ),
       updated_at = now()
 where slug = $t$chorizo-santarrosano$t$;
