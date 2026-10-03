-- ============================================================================
-- La cápsula de la sal de cura, con su guion y sus tres videos (2026-10-03)
--
-- Deja de ser solo texto. Cristian grabó el guion "¿Sal de cura #1 o #2?
-- ¿Sabes cuál necesitas?" en tres videos, y cada uno pasa a ser una lección:
--
--   1. La #1: para lo que se cocina.
--   2. La #2: para las curaciones largas.
--   3. Cuánta usar.
--
-- ⚠️ SE ACTUALIZAN LAS TRES LECCIONES EN SU SITIO, no se borran y se crean de
-- nuevo. En producción hay gente que ya terminó esta cápsula, y su avance
-- cuelga del id de cada lección: borrarlas le quitaría la cápsula hecha y, como
-- la ruta es secuencial, le volvería a cerrar las siguientes. Mismo id, mismo
-- orden, contenido nuevo.
--
-- La tercera lección era "Cuándo NO hace falta" (las piezas enteras sin
-- nitrito). Ese tema ya no está en el guion; lo sigue explicando el curso del
-- lomo curado, que se hace justamente así.
--
-- El cuerpo va en texto plano: la lección lo pinta tal cual, sin markdown.
-- La dosis (2,5 g por kilo) es la misma de `MAX_CURE_1_G_PER_KG`.
-- ============================================================================

update charcu.courses
   set summary = '#1 para lo que se cocina, #2 para las curaciones largas, y cuánta va por kilo.',
       updated_at = now()
 where slug = 'sal-de-cura';

update charcu.modules m
   set title = '¿Sal de cura #1 o #2?',
       summary = 'Parecen iguales, pero no lo son. ¿Sabes cuál necesitas?'
  from charcu.courses c
 where m.course_id = c.id and c.slug = 'sal-de-cura';

-- 1. La #1 -------------------------------------------------------------------
update charcu.lessons l
   set kind = 'video',
       bunny_video_id = '6ec81534-da14-4c59-badb-e2ac0ac1e7fa',
       title = 'Sal de cura #1: para lo que se cocina',
       summary = 'Nitrito, para jamones, salchichas y embutidos cocidos.',
       body = 'Aunque parecen iguales, la #1 y la #2 tienen una diferencia importante.

La sal de cura #1 contiene nitrito y está pensada para productos que tendrán cocción, como jamones, salchichas y embutidos cocidos.

Ayuda a conservar el producto y a desarrollar ese color y ese sabor característicos de los embutidos curados.',
       ask = '¿Qué diferencia hay entre la sal de cura #1 y la #2?',
       file_url = null,
       poster_url = null
  from charcu.modules m join charcu.courses c on c.id = m.course_id
 where l.module_id = m.id and c.slug = 'sal-de-cura'
   and l.id = (
     select l2.id from charcu.lessons l2 join charcu.modules m2 on m2.id = l2.module_id
      where m2.course_id = c.id order by m2.position, l2.position limit 1 offset 0
   );

-- 2. La #2 -------------------------------------------------------------------
update charcu.lessons l
   set kind = 'video',
       bunny_video_id = '713f46dc-4c36-45c9-9aa1-998a24c1b7a3',
       title = 'Sal de cura #2: para las curaciones largas',
       summary = 'Nitrito y nitrato, para salamis y curados de meses.',
       body = 'La sal de cura #2 contiene nitrito y nitrato, y se utiliza principalmente en productos de curación larga, como los salamis.

El nitrato actúa como una reserva de nitrito durante la maduración: se va soltando poco a poco mientras la pieza se cura.',
       ask = '¿Puedo usar sal de cura #2 en algo que voy a cocinar en unos días?',
       file_url = null,
       poster_url = null
  from charcu.modules m join charcu.courses c on c.id = m.course_id
 where l.module_id = m.id and c.slug = 'sal-de-cura'
   and l.id = (
     select l2.id from charcu.lessons l2 join charcu.modules m2 on m2.id = l2.module_id
      where m2.course_id = c.id order by m2.position, l2.position limit 1 offset 1
   );

-- 3. Cuánta usar -------------------------------------------------------------
update charcu.lessons l
   set kind = 'video',
       bunny_video_id = 'f1cebd31-35a7-4ece-99db-439e079f7a0b',
       title = 'Cuánta usar',
       summary = 'Como referencia, 2,5 g por kilo de carne. Y siempre, la dosis del fabricante.',
       body = 'Como referencia, 2,5 gramos por kilo de carne.

Pero ojo: la concentración puede variar entre productos, así que siempre hay que revisar la dosificación del fabricante.

Para recordarlo fácil: #1 para cocción, #2 para curaciones largas.

Y tú, ¿cuál has usado?',
       ask = 'Tengo 3 kg de carne. ¿Cuánta sal de cura le pongo?',
       file_url = null,
       poster_url = null
  from charcu.modules m join charcu.courses c on c.id = m.course_id
 where l.module_id = m.id and c.slug = 'sal-de-cura'
   and l.id = (
     select l2.id from charcu.lessons l2 join charcu.modules m2 on m2.id = l2.module_id
      where m2.course_id = c.id order by m2.position, l2.position limit 1 offset 2
   );
