-- ============================================================================
-- El primer curso, sacado del experimento
--
-- La bondiola curada vivía como constante de TypeScript en
-- `entities/guided-recipe`. Aquí pasa a la base con la estructura de 0011, sin
-- perder nada: cada paso es una lección, y cada lección conserva su `ask` — la
-- duda que casi todo el mundo tiene justo ahí, ya escrita.
--
-- Las lecciones nacen de tipo `texto` porque los videos todavía no existen
-- (Bunny, paso 6). El día que se graben, se les pone `bunny_video_id` y
-- `kind = 'video'`: no hay que rehacer el curso, solo rellenar la columna.
--
-- Va como LIBRE. Es el gancho: el que prueba el curso entero gratis es el que
-- después paga por el resto. Cambiarlo es un `update` de una fila.
-- ============================================================================

with curso as (
  insert into charcu.courses (slug, title, summary, cover_url, level, access, status, position)
  values (
    'bondiola-curada',
    'Bondiola curada',
    'La pieza con la que casi todo el mundo empieza: perdona errores, no necesita tripa y en tres semanas ya se come.',
    '/curso/bondiola/01-corte.jpg',
    'para-empezar',
    'libre',
    'publicado',
    0
  )
  returning id
),
modulo_preparar as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, 'Preparar la pieza', 'Lo que se hace antes de que empiece el curado. Aquí es donde se arruinan las piezas.', 0
  from curso
  returning id
),
modulo_curar as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, 'Curar y esperar', 'Tres semanas en las que no se toca nada, pero hay que saber qué mirar.', 1
  from curso
  returning id
)
insert into charcu.lessons (module_id, kind, title, summary, position, poster_url, body, ask)
select * from (
  select
    (select id from modulo_preparar) as module_id,
    'texto' as kind,
    'Escuadrar la pieza' as title,
    'Se le quita el exceso de grasa y se le da forma pareja. Una pieza despareja se cura despareja: por fuera queda dura y por dentro cruda.' as summary,
    0 as position,
    '/curso/bondiola/01-corte.jpg' as poster_url,
    'Se le quita el exceso de grasa y se le da forma pareja. Una pieza despareja se cura despareja: por fuera queda dura y por dentro cruda. Cuenta unos 20 minutos.' as body,
    'Mi bondiola pesa 1,8 kg y quedó despareja. ¿La escuadro más o la curo así?' as ask
  union all
  select
    (select id from modulo_preparar),
    'texto',
    'La sal y la sal de cura',
    'Aquí es donde se arruinan las piezas. La sal de cura no se calcula a ojo: va por peso, y el tope es 2,5 g por kilo.',
    1,
    '/curso/bondiola/02-sal.jpg',
    'Aquí es donde se arruinan las piezas. La sal de cura no se calcula a ojo: va por peso, y el tope es 2,5 g por kilo. Cuenta unos 15 minutos.',
    '¿Cuánta sal común y cuánta sal de cura #1 para 1,8 kg de bondiola?'
  union all
  select
    (select id from modulo_preparar),
    'texto',
    'Pimentón, ajo y pimienta',
    'El sabor entra ahora. Las especias no conservan: eso lo hacen la sal y el tiempo. Aquí solo se decide a qué va a saber.',
    2,
    '/curso/bondiola/03-especias.jpg',
    'El sabor entra ahora. Las especias no conservan: eso lo hacen la sal y el tiempo. Aquí solo se decide a qué va a saber. Cuenta unos 10 minutos.',
    '¿Qué especias le van a la bondiola y en qué cantidad por kilo?'
  union all
  select
    (select id from modulo_curar),
    'texto',
    'Colgar y esperar',
    'Tres semanas colgada, y hay que perder entre el 30% y el 40% del peso. Si se seca demasiado rápido, se forma costra y el centro queda húmedo.',
    0,
    '/curso/bondiola/04-colgado.jpg',
    'Tres semanas colgada, y hay que perder entre el 30% y el 40% del peso. Si se seca demasiado rápido, se forma costra y el centro queda húmedo. De 3 a 4 semanas.',
    '¿A qué temperatura y humedad cuelgo la bondiola, y cómo lo consigo en casa?'
) as lecciones;
