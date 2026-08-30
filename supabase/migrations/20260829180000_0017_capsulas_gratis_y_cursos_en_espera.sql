-- ============================================================================
-- Las cinco cápsulas gratis, y los cursos a lista de espera (2026-08-29)
--
-- Es la 0013 puesta a trabajar: allí se creó `kind`, `lista-de-espera`,
-- `waitlist_goal` y `unlock_mode`; aquí entra el contenido.
--
-- ⚠️ LAS CÁPSULAS NACEN EN TEXTO, NO EN VIDEO, Y ES A PROPÓSITO.
--
-- No hay video grabado y no se va a fingir. La 0012 y la del catálogo ya
-- metieron el mismo placeholder del corte del lomo en 13 lecciones distintas
-- para "ver la estructura"; repetir eso ahora, en lo ÚNICO gratis que va a
-- tener la plataforma el día del lanzamiento, sería que el primer contacto de
-- todo visitante nuevo fuera un video que no habla de lo que promete el título.
--
-- Una lección de `texto` con las cantidades por escrito es contenido de verdad
-- —el propio comentario de `lessons.body` dice que los números son lo que hace
-- falta con las manos en la carne— y el video se añade encima cuando exista,
-- sin tocar esta estructura.
--
-- ⚠️⚠️ CRISTIAN TIENE QUE LEER ESTO ANTES DE PUBLICAR.
--
-- El texto de abajo lo redactó Claude. Las cifras de seguridad salen de sitios
-- ya verificados en este repo (`entities/cure-safety` y el prompt del
-- asistente), no de ninguna parte nueva: 2,5 g/kg de cura #1, 156 ppm, la
-- diferencia entre #1 y #2, la regla de pieza entera contra picado y el 30-40 %
-- de merma. Pero la VOZ y el CRITERIO del oficio son suyos, y la cápsula de sal
-- de cura es exactamente la fila donde una palabra mal puesta llega a alguien
-- que va a darle eso de comer a su familia.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Los cursos que solo tienen video de relleno pasan a LISTA DE ESPERA
--
-- Los cinco cursos llevan el mismo placeholder del corte del lomo en todas sus
-- lecciones (así lo dejó dicho la migración del catálogo). Publicados prometen
-- algo que no está detrás. En lista de espera dicen la verdad —"esto todavía no
-- está grabado"— y además hacen el trabajo de decirnos a cuánta gente le
-- interesa cada uno, que es lo que decide qué se graba primero.
--
-- `lomo-curado` NO entra: es el único con videos reales.
-- ----------------------------------------------------------------------------

update charcu.courses
   set status        = 'lista-de-espera',
       -- 30 personas. Es un número que se alcanza y que justifica un fin de
       -- semana de grabación. Se sube cuando la comunidad crezca.
       waitlist_goal = 30
 where kind = 'curso'
   and slug <> 'lomo-curado';

-- ----------------------------------------------------------------------------
-- 2. Las cápsulas
--
-- `access = 'libre'`: son el anzuelo, se ven sin pagar y sin suscripción.
-- `unlock_mode = 'secuencial'`: se abren en orden. Aquí sí funciona como guía
-- —son cortas y llevan un hilo— y no como peaje. En lo que se PAGA nunca.
--
-- El orden no es casual. Primero la sal de cura, porque el miedo nº1 de este
-- público es enfermar a la familia y esa es la cápsula que lo desarma. Segunda,
-- cómo usar El Charcu: cuanto antes descubra que puede preguntar, antes ve para
-- qué sirve todo esto. Las tres de técnica van después.
-- ----------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, level, access, status, kind, unlock_mode, position)
values
  ('sal-de-cura',
   'Qué saber de la sal de cura',
   'La que de verdad importa. Qué es, cuánta va por kilo, cuándo NO hace falta y por qué la dosis no se improvisa.',
   'para-empezar', 'libre', 'publicado', 'capsula', 'secuencial', 10),

  ('calcular-con-el-charcu',
   'Calcula tus ingredientes con El Charcu',
   'Tienes 3,4 kg y la receta habla de 1 kg. En vez de hacer la regla de tres, se lo preguntas.',
   'para-empezar', 'libre', 'publicado', 'capsula', 'secuencial', 20),

  ('bridar-un-jamon',
   'Cómo bridar un jamón',
   'Por qué se brida y cómo queda parejo. Una pieza mal bridada se seca por fuera y se queda cruda por dentro.',
   'para-empezar', 'libre', 'publicado', 'capsula', 'secuencial', 30),

  ('embutir-un-chorizo',
   'Formas de embutir un chorizo',
   'Con embutidora, con la máquina de moler o sin nada. Y cómo no dejar cuevas de aire, que es donde se pudre.',
   'para-empezar', 'libre', 'publicado', 'capsula', 'secuencial', 40),

  ('amarrar-chorizos',
   'Cómo amarrar los chorizos',
   'El amarre no es adorno: sujeta la tripa, reparte la masa y decide el tamaño de cada unidad.',
   'para-empezar', 'libre', 'publicado', 'capsula', 'secuencial', 50);

-- ----------------------------------------------------------------------------
-- 3. Un módulo por cápsula
--
-- Una cápsula resuelve UNA duda, así que un módulo y ya. El módulo existe
-- igualmente porque la estructura curso ▸ módulo ▸ lección es la misma para
-- las dos cosas: partir el modelo en dos para ahorrarse una fila es lo que
-- lleva a que alguien acabe escribiendo en la tabla equivocada.
-- ----------------------------------------------------------------------------

insert into charcu.modules (course_id, title, summary, position)
select c.id, m.title, '', 10
  from (values
    ('sal-de-cura',            'La cápsula'),
    ('calcular-con-el-charcu', 'La cápsula'),
    ('bridar-un-jamon',        'La cápsula'),
    ('embutir-un-chorizo',     'La cápsula'),
    ('amarrar-chorizos',       'La cápsula')
  ) as m(slug, title)
  join charcu.courses c on c.slug = m.slug;

-- ----------------------------------------------------------------------------
-- 4. Las lecciones
--
-- Cada una lleva su `ask`: la duda que casi todo el mundo tiene justo ahí, ya
-- escrita. Es lo que une la cápsula con el asistente — terminar de leer y que
-- la pregunta sea el siguiente botón. Con cinco cápsulas y ningún video, ese
-- puente ES el producto.
-- ----------------------------------------------------------------------------

insert into charcu.lessons (module_id, kind, title, summary, position, body, ask)
select mo.id, 'texto', l.title, l.summary, l.position, l.body, l.ask
  from (values

    -- ── Sal de cura ────────────────────────────────────────────────────────
    ('sal-de-cura', 'Qué es y qué hace', 10,
     'No es sal con color. Es lo que evita el botulismo, y por eso la dosis no se negocia.',
     E'La sal de cura no sazona: **protege**.\n\nLleva nitrito de sodio —un 6,25 % en la #1— y va teñida de rosado a propósito, para que nadie la confunda con la sal común y se le vaya la mano. Ese nitrito hace tres cosas: frena al *Clostridium botulinum*, que es la bacteria del botulismo; mantiene el color rojo del curado en vez del pardo de la carne cocida; y da el sabor que uno reconoce como "curado".\n\nLa importante es la primera. El botulismo no huele, no se ve y no cambia el sabor. No hay forma de darse cuenta mirando.',
     '¿Qué diferencia hay entre la sal de cura #1 y la #2?'),

    ('sal-de-cura', 'Cuánta va por kilo', 20,
     'El tope es 2,5 g por kilo de carne. Ni para curar más rápido, ni porque la receta de internet diga otra cosa.',
     E'**Máximo 2,5 g de sal de cura #1 por kilo de carne.**\n\nEso son unas 156 partes por millón de nitrito, que es el tope legal del USDA. Por encima de ahí no curas mejor ni más rápido: solo le metes más nitrito del que debería comerse una persona.\n\nY se pesa. En una balanza de gramos, no con cucharitas: una cucharadita rasa y una colmada se llevan casi el doble entre ellas, y aquí ese doble importa.\n\n**#1 o #2, según el tiempo.** La #1 es para curados cortos y para todo lo que se vaya a cocinar o ahumar en caliente. La #2 lleva además nitrato, que se va soltando poco a poco, y es para curados largos en seco de semanas o meses.',
     'Tengo 3 kg de carne. ¿Cuánta sal de cura #1 le pongo?'),

    ('sal-de-cura', 'Cuándo NO hace falta', 30,
     'Una pieza entera puede ir sin nitrito. La carne picada, no. Esa es la línea.',
     E'Hay curados válidos **sin sal de cura**, y no son un atajo: son el método europeo de toda la vida.\n\nUna **pieza entera** de músculo —lomo, bondiola, cecina— curada solo con sal y azúcar funciona porque el interior del músculo está sellado. La sal entra desde fuera hacia dentro y el riesgo es bajo.\n\nLa **carne picada** es otra cosa. Al picarla, ese interior deja de estar sellado y el aire entra con ella, repartido por toda la masa. Chorizos, salames, cualquier embutido: ahí el nitrito no es opcional.\n\n**Y en un curado sin nitrito, lo que vigila la seguridad es la merma.** La pieza tiene que perder entre un 30 % y un 40 % de su peso inicial. Por eso se pesa y no se cuentan días: el porcentaje es el dato, el calendario es una estimación.',
     'Estoy curando un lomo entero sin sal de cura. ¿Cómo sé cuándo está listo?'),

    -- ── Calcular con El Charcu ─────────────────────────────────────────────
    ('calcular-con-el-charcu', 'La receta dice 1 kg y tú tienes 3,4', 10,
     'La regla de tres con las manos sucias es donde se equivoca todo el mundo.',
     E'Casi ninguna receta viene en tus kilos.\n\nDice "por kilo" y tú tienes 3,4. O tienes 800 g. Y toca multiplicar en la cabeza, con las manos llenas de carne, justo cuando el número que estás calculando es el de la sal de cura.\n\nAhí es donde El Charcu sirve de verdad. No es un buscador de recetas: es alguien a quien le dices lo que tienes y te devuelve las cantidades tuyas.\n\n> **Tengo 3,4 kg de carne para chorizo. Dame las cantidades.**\n\nY si te pide un dato antes de contestar —cuántos kilos, qué tipo de sal, qué temperatura hay— no es que no sepa: es que una dosis a ciegas es peligrosa.',
     'Tengo 3,4 kg de carne para chorizo. Dame las cantidades.'),

    ('calcular-con-el-charcu', 'Lo que puedes preguntarle', 20,
     'Dosis, mohos por foto, humedad, tiempos, qué hacer cuando algo se torció.',
     E'No es solo la calculadora. Cuatro cosas que resuelve bien:\n\n**Dosis por tus kilos.** Sal de cura, sal común, especias. Te da el número por kilo y el total tuyo.\n\n**Diagnóstico por foto.** Le mandas la foto del moho, del corte o de la superficie y te dice si se salva o si hay que descartar. Blanco aterciopelado y parejo suele ser noble; verde, negro, gris peludo o con mal olor es parar.\n\n**Ajuste por tu clima.** Manizales no es Buenos Aires y no se cura igual. Dile dónde estás.\n\n**Cuando algo se torció.** Encostramiento, cuevas de aire, interior pardo, tripa que revienta, superficie pegajosa. Descríbelo y te dice qué pasó.\n\nY una regla suya que no se salta: si le pides una dosis de sal de cura por encima del tope, se niega. Aunque insistas.',
     'Le salió un moho blanco a mi chorizo. ¿Lo puedo salvar?'),

    -- ── Bridar un jamón ────────────────────────────────────────────────────
    ('bridar-un-jamon', 'Por qué se brida', 10,
     'Una pieza suelta se seca por fuera antes de curarse por dentro.',
     E'Bridar es atar la pieza para que mantenga su forma mientras cura.\n\nNo es presentación. Una pieza que se deja suelta pierde humedad de forma despareja: las partes finas y los bordes se secan primero y forman una costra, y esa costra impide que salga la humedad del centro. Es el **encostramiento**: seco por fuera, crudo por dentro, y no tiene arreglo una vez pasa.\n\nEl bridado compacta la pieza, iguala su grosor y hace que la merma sea pareja. También le da a la pieza un punto de donde colgarla sin que se deforme con su propio peso.',
     '¿Cómo sé si mi pieza se está encostrando?'),

    ('bridar-un-jamon', 'Cómo queda parejo', 20,
     'Vueltas a distancia igual, tensión firme y constante, y un ojal para colgar.',
     E'Tres cosas que hacen la diferencia:\n\n**Distancia pareja.** Las vueltas se reparten a la misma distancia una de otra a lo largo de toda la pieza. Donde no hay cuerda, la carne se abre; donde hay dos juntas, se marca.\n\n**Tensión firme, no estrangulada.** Tiene que sujetar sin cortar la carne. Si la cuerda se hunde y deja un surco profundo, ahí la pieza va a partirse al secar.\n\n**Un ojal en el extremo.** Es de donde va a colgar semanas. Que sea el extremo más estrecho y que el nudo aguante el peso de la pieza **mojada**, que es cuando más pesa.\n\nY cuerda de algodón o de cáñamo, sin tratar. La sintética no respira y se marca.',
     '¿Qué tipo de cuerda uso para bridar y de qué grosor?'),

    -- ── Embutir un chorizo ─────────────────────────────────────────────────
    ('embutir-un-chorizo', 'Con qué se puede embutir', 10,
     'Embutidora, máquina de moler con embudo, o sin nada. Las tres funcionan.',
     E'No hace falta una embutidora para empezar.\n\n**Embutidora de palanca.** Es lo cómodo. Llenas el cilindro, bajas la palanca y sale parejo. Se controla la velocidad, que es lo que más importa.\n\n**Máquina de moler con embudo.** La que casi todo el mundo tiene. Se le quita la cuchilla y el disco —si los dejas, vuelve a moler la masa y la calientas— y se le pone el embudo. Va más lento y hay que ir con dos manos.\n\n**Sin nada.** Un embudo grande y empujar con el pulgar. Es lento y cansa, pero se hace y sale bien.\n\nLo que sí es igual en las tres: **la masa tiene que estar fría**. Si la grasa se calienta se unta, y una masa untada no llena parejo — deja huecos.',
     'No tengo embutidora. ¿Cómo embuto con lo que tengo en casa?'),

    ('embutir-un-chorizo', 'Las cuevas de aire', 20,
     'Es donde se pudre. Se evitan al llenar y se pinchan si aparecen.',
     E'Una cueva de aire es una bolsa dentro del embutido donde no hay masa.\n\nAhí no llega la sal, hay oxígeno, y es exactamente donde empieza a dañarse la pieza. En un curado largo, una cueva puede echar a perder el chorizo entero.\n\n**Al llenar:** que la tripa se vaya llenando desde el fondo y sin dejar que entre aire por delante de la masa. La tripa se sujeta y se deja correr sola con la presión, no se estira.\n\n**Si ya aparecieron:** se pinchan con una aguja fina y se aprieta con el dedo hacia el agujero para sacar el aire. Aguja fina de verdad — un pinchazo grueso deja una puerta abierta.\n\nY se miran a contraluz antes de colgar. Es más fácil verlas que buscarlas con el dedo.',
     'Me quedaron burbujas de aire en el chorizo. ¿Cómo las saco?'),

    -- ── Amarrar chorizos ───────────────────────────────────────────────────
    ('amarrar-chorizos', 'Para qué sirve el amarre', 10,
     'Sujeta la tripa, decide el tamaño de cada unidad y aguanta el peso al colgar.',
     E'El amarre hace tres trabajos a la vez.\n\n**Cierra.** Los extremos van atados o la masa se sale, sobre todo al cocinar, cuando todo se dilata.\n\n**Divide.** Es lo que decide de qué tamaño queda cada chorizo. Y eso no es un detalle estético: una unidad muy larga se dobla al colgar y se marca en el pliegue.\n\n**Sujeta el peso.** Una ristra colgada aguanta su propio peso durante días o semanas, y lo hace desde los amarres. Si un nudo cede, se cae la ristra entera.',
     '¿De qué largo dejo cada chorizo?'),

    ('amarrar-chorizos', 'Cómo se amarra', 20,
     'Se aprieta la masa, se tuerce y se ata. En ese orden.',
     E'El orden importa y casi todo el mundo lo hace al revés.\n\n**Primero se aprieta la masa** hacia los lados con los dedos, para dejar un tramo de tripa vacío donde va el nudo. Si atas sobre masa llena, la tripa revienta o la masa se desplaza.\n\n**Después se tuerce** ese tramo vacío sobre sí mismo, dos o tres vueltas. Ya ahí queda dividido.\n\n**Y al final se ata**, encima de la torsión. La torsión sola se deshace con el tiempo; el nudo sola corta. Las dos juntas aguantan.\n\nSi vas a colgar la ristra, deja los nudos de las dos puntas más largos: son los que van a soportar todo el peso mojado.',
     '¿Se puede amarrar con la misma tripa en vez de con cuerda?')

  ) as l(slug, title, position, summary, body, ask)
  join charcu.courses c on c.slug = l.slug
  join charcu.modules mo on mo.course_id = c.id and mo.position = 10;
