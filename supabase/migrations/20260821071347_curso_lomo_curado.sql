-- ============================================================================
-- El curso pasa a ser "Lomo de cerdo curado", con sus videos definitivos
--
-- Deja de ser el experimento de la bondiola con un video de prueba repetido y
-- pasa a ser el curso real: 3 módulos, 7 lecciones y los videos que grabó
-- Cristian (2026-08-21).
--
-- El slug cambia de `bondiola-curada` a `lomo-curado`. Se cambia a propósito
-- —una URL que dice "bondiola" en un curso de lomo confunde— y se puede hacer
-- ahora porque el curso solo ha vivido en QA y nadie ha compartido el enlace.
-- El día que haya alumnos, cambiar un slug es romperle el marcador a alguien.
-- ⚠️ `appRoutes.guidedRecipe` apunta a este slug: se actualiza en el mismo
-- commit.
--
-- Los módulos se borran y se vuelven a crear en vez de parchearse: cambian de
-- dos a tres, y las lecciones de cuatro a siete con otro orden. El `cascade` se
-- lleva las lecciones viejas y su progreso — son 3 filas de las pruebas de
-- Cristian, no de alumnos.
--
-- LOS NÚMEROS SON REALES, de la pieza que se grabó: 835 g al empezar, 600 g
-- tras cinco días de sal, y 35% menos al final (543 g). No se inventa ninguno:
-- es lo que el alumno va a comparar contra su propia báscula.
--
-- ⚠️ Este curado va SIN sal de cura, solo sal y azúcar. Es el método
-- tradicional para pieza entera. El prompt del asistente se ajusta en el mismo
-- commit para que no le contradiga el curso a nadie que pregunte.
-- ============================================================================

update charcu.courses
   set slug    = 'lomo-curado',
       title   = 'Lomo de cerdo curado',
       summary = 'La pieza con la que casi todo el mundo empieza: perdona errores, no necesita tripa y en tres semanas ya se come. Deleita tu paladar con este sabor europeo.'
 where slug = 'bondiola-curada';

-- Fuera la estructura vieja. Cascada: se lleva lecciones y progreso.
delete from charcu.modules
 where course_id = (select id from charcu.courses where slug = 'lomo-curado');

-- ----------------------------------------------------------------------------
-- La estructura nueva
-- ----------------------------------------------------------------------------

with curso as (
  select id from charcu.courses where slug = 'lomo-curado'
),
m_bienvenida as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, 'Bienvenida', 'Lo que vas a lograr en tres semanas.', 0 from curso
  returning id
),
m_preparar as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, 'Preparar la pieza',
         'Los cinco primeros días. Aquí es donde se decide si sale bien.', 1
  from curso
  returning id
),
m_paciencia as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, 'Paciencia',
         'Veinte días colgado. Se pesa, no se cuentan días.', 2
  from curso
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, poster_url, bunny_video_id, body, ask)
select * from (
  ---------------------------------------------------------------- Bienvenida
  select
    (select id from m_bienvenida) as module_id,
    'video' as kind,
    'Esto es lo que vas a lograr' as title,
    'Lomo de cerdo, sal, azúcar y tres semanas. Nada más.' as summary,
    0 as position,
    '/curso/bondiola/01-corte.jpg' as poster_url,
    '2fa024cc-a711-468c-b42a-e370699524bd' as bunny_video_id,
    'Mira bien esas lonjas. Salieron de un lomo de cerdo, sal, azúcar y tres semanas de paciencia. Nada más — ni químicos raros, ni equipo de fábrica, ni una cava de curado.

Lo vas a hacer en tu nevera. Y en cada paso te voy diciendo qué mirar, porque lo único que puede salir mal es que nadie te haya contado en qué fijarte.' as body,
    '¿Qué necesito tener en casa antes de empezar un lomo curado?' as ask

  ------------------------------------------------------ Preparar la pieza (1)
  union all select
    (select id from m_preparar), 'video',
    'Escuadrar la pieza',
    'Una pieza pareja se cura pareja. Una despareja, no.',
    0, '/curso/bondiola/01-corte.jpg',
    'f3a57ec6-49fa-4484-a0c8-15ab361cd4e0',
    'Antes de tocar la sal, la pieza tiene que quedar pareja. Se le quitan los bordes sueltos y la grasa desigual, y se le da forma de tubo.

No es por estética: una pieza despareja se cura despareja. Donde es delgada se seca de más y queda dura; donde es gruesa se queda húmeda por dentro. Y lo húmedo por dentro es lo que da problemas.',
    'Mi lomo tiene una punta mucho más delgada que el resto. ¿La corto o lo curo así?'

  ------------------------------------------------------ Preparar la pieza (2)
  union all select
    (select id from m_preparar), 'video',
    'La sal y el azúcar',
    'Mitad y mitad, la pieza enterrada del todo, cinco días.',
    1, '/curso/bondiola/02-sal.jpg',
    '6bca551d-d813-4bf6-990e-1f5cba53389d',
    'Mitad sal, mitad azúcar, y la pieza enterrada por completo — un kilo de cada uno para cubrirla bien. No es una capa por encima: si queda un pedazo al aire, ese pedazo no se cura.

La sal saca el agua y el azúcar redondea el sabor y le quita el filo salado. Cinco días en la nevera, y ya está.

Este lomo entró con 835 g. Apunta el tuyo, que ese número es contra el que vas a medir todo lo demás.',
    '¿Cuánta sal y cuánta azúcar necesito para enterrar un lomo de 835 g?'

  ------------------------------------------------------ Preparar la pieza (3)
  union all select
    (select id from m_preparar), 'video',
    'El secado y el peso inicial',
    'De 835 g a 600 g. Ese número es tu punto de partida.',
    2, '/curso/bondiola/02-sal.jpg',
    '8693ac0e-6ddd-4de8-ac2a-3c7878659063',
    'A los cinco días sale, se le quita toda la sal, se seca bien y se pesa.

Este pasó de 835 g a 600 g: 235 g de pura agua. Esa es la señal de que la sal hizo su trabajo.

Ese número de hoy es tu punto de partida. De aquí en adelante lo pesas cada semana y ves cómo baja.',
    'Mi lomo perdió 235 g en la sal. ¿Es normal o se pasó?'

  ------------------------------------------------------------- Paciencia (1)
  union all select
    (select id from m_paciencia), 'video',
    'Especias y momificado',
    'Coriandro y pimientas, en vez de la paprika de siempre.',
    0, '/curso/bondiola/03-especias.jpg',
    '14c9bb65-a936-45d3-8ac4-a7d41e7cf79d',
    'Aquí se decide a qué va a saber. Hoy cambiamos la paprika de siempre por coriandro y pimientas, que es el perfil de la charcutería alemana.

Para estos 600 g:
· 2,5 g de coriandro molido
· 2 g de mezcla de pimientas
· 0,5 g de ajo en polvo

¿Sin gramera? Una cucharadita rasa de coriandro, media de pimienta y una pizca generosa de ajo.

Se masajea hasta que la costra agarre, se envuelve en una venda y se cuelga en la nevera. Vuelta y pesada cada semana — la venda lo deja respirar y la vuelta evita que se seque de un solo lado.',
    '¿Qué especias le pongo a un lomo de 600 g y en qué cantidad por kilo?'

  ------------------------------------------------------------- Paciencia (2)
  union all select
    (select id from m_paciencia), 'video',
    'Veinte días después',
    '35% menos que al principio. El porcentaje manda, no el calendario.',
    1, '/curso/bondiola/04-colgado.jpg',
    '9767cee6-0bf7-451a-a3c5-1e6925b8eb9b',
    'Veinte días colgado y este llegó a 543 g: un 35% menos que los 835 g del principio. Ahí es cuando está.

El porcentaje manda más que el calendario. Dos lomos del mismo peso en dos neveras distintas no tardan lo mismo: depende de la humedad, del aire y de cuánta grasa traía la pieza. Por eso se pesa, no se cuentan días.

Si le falta, se cuelga otra semana. Esto no se apura.',
    'Mi lomo lleva 20 días y todavía no llegó al 35%. ¿Lo dejo más tiempo?'

  ------------------------------------------------------------- Paciencia (3)
  union all select
    (select id from m_paciencia), 'video',
    'El corte',
    'Lo que había dentro todo este tiempo.',
    2, '/curso/bondiola/01-corte.jpg',
    '2fa024cc-a711-468c-b42a-e370699524bd',
    'Y esto es lo que había dentro todo este tiempo.

Se corta fino y a contrafibra, con el cuchillo bien afilado. Envuelto en tela o en papel, en la parte de abajo de la nevera, aguanta semanas — aunque no te va a durar tanto.

835 g → 600 g → 543 g. Ese recorrido lo hiciste tú.',
    '¿Cómo corto y guardo un lomo curado que ya está listo?'
) as lecciones;
