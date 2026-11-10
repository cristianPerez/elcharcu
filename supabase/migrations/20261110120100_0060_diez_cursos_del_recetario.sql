-- ============================================================================
-- 0060 · DIEZ CURSOS NUEVOS DEL RECETARIO, UNO POR MIÉRCOLES (2026-11-10)
--
-- ⚠️ GENERADA por scripts/cursos-desde-recetario.ts. Se cambia el script y se
-- vuelve a generar, no se edita a mano.
--
-- Siguen el calendario de la 0059: el primero sale el 27 de enero de 2027 y
-- después uno cada miércoles. Entran como lista-de-espera con su releases_on:
-- se ve el temario, el contenido está cerrado para todos y se puede pedir el
-- aviso. Las lecciones de video no tienen video todavía, solo la foto de la
-- receta. El texto sale tal cual de la receta, que ya está revisada.
--
-- Por slug y con on conflict: volver a aplicarla no duplica nada. Son cursos
-- nuevos, sin progreso de nadie, así que se rehacen sus módulos.
-- ============================================================================

-- --------------------------------------------------------------------------

-- Chorizo Parrillero Clásico · sale el 2027-01-27

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$chorizo-parrillero$t$, $t$Chorizo Parrillero Clásico$t$, $t$El comodín de la parrilla — cerdo jugoso, ajo, comino y cebolla, equilibrado para agradar a todos.$t$, $t$/recipes/chorizo-parrillero.jpg$t$,
   'para-empezar', 'pago', 'curso', 'lista-de-espera', 'libre', 200,
   'chorizos', '{embutir-amarrar}', date '2027-01-27')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$chorizo-parrillero$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$chorizo-parrillero$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$El chorizo de todos los días, bien hecho.$t$, 0,
   $t$El parrillero clásico es la receta base que todo charcutero debería dominar: un chorizo fresco, jugoso y equilibrado, sin un sabor que domine sobre los demás. Ajo, comino y un toque de cebolla lo hacen redondo y familiar. Es el punto de partida para entender cómo la grasa, la sal y la temperatura definen un buen embutido.

«El parrillero clásico enseña lo esencial: si dominas el balance de sal, grasa y frío, dominas cualquier chorizo.»$t$, $t$/recipes/chorizo-parrillero.jpg$t$, null, null, $t$La receta de Chorizo Parrillero Clásico está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$chorizo-parrillero$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$80% carne y 20% grasa es el balance parrillero universal.$t$, 0,
   $t$• Carne de cerdo (pierna o paleta): 800 g (80%)
• Grasa de cerdo (papada o tocino): 200 g (20%)
• Sal: 20 g (2%)
• Ajo fresco triturado: 10 g (1%)
• Pimentón dulce: 10 g (1%)
• Comino: 3 g (0.3%)
• Cebolla en polvo: 5 g (0.5%)
• Pimienta negra: 3 g (0.3%)
• Azúcar: 3 g (0.3%)
• Agua helada: 30 ml (3%)

80% carne y 20% grasa es el balance parrillero universal. Sube la grasa un par de puntos si buscas más jugosidad, sin pasar del rango artesanal.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Domínalo y escalas la receta a cualquier cantidad.

Mezcla los secos antes de moler para repartir sal y especias de forma pareja. La cebolla en polvo evita el exceso de humedad de la fresca.$t$, null, null, null, $t$Estoy haciendo Chorizo Parrillero Clásico y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$chorizo-parrillero$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$El nutri y la carne fría$t$, $t$Mezcla todos los secos hasta integrarlos (el “nutri”).$t$, 0,
   $t$- Mezcla todos los secos hasta integrarlos (el “nutri”).
- Corta la carne y la grasa en cubos y mantenlas entre 0 y 4 °C.$t$, $t$/recipes/chorizo-parrillero.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Moler y amasar$t$, $t$Muele con disco de 8 mm.$t$, 1,
   $t$- Muele con disco de 8 mm.
- Agrega los secos y mezcla hasta una masa homogénea y pegajosa.$t$, $t$/recipes/chorizo-parrillero.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Agua helada y embutido$t$, $t$Incorpora el agua helada poco a poco mientras amasas.$t$, 2,
   $t$- Incorpora el agua helada poco a poco mientras amasas.
- Embute en tripa natural de cerdo, calibre 32–35 mm, y forma los chorizos.$t$, $t$/recipes/chorizo-parrillero.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Reposo antes de asar$t$, $t$Refrigera entre 12 y 24 horas antes de asar.$t$, 3,
   $t$- Refrigera entre 12 y 24 horas antes de asar.$t$, $t$/recipes/chorizo-parrillero.jpg$t$, null, null, $t$Hice Chorizo Parrillero Clásico. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$chorizo-parrillero$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$20–25 minutos a fuego medio, girando con frecuencia para un dorado parejo.$t$, 0,
   $t$Parrilla
20–25 minutos a fuego medio, girando con frecuencia para un dorado parejo.

Sartén
Fuego medio-bajo hasta dorar por todos los lados; reposar antes de cortar.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Trabaja entre 0 y 4 °C.$t$, 1,
   $t$El frío manda
Trabaja entre 0 y 4 °C. Si la grasa se calienta, se unta y el chorizo pierde textura.

No sobremezclar
Para en cuanto la masa quede pegajosa; amasar de más endurece el resultado.

Reposo con sentido
Las 12–24 h en frío asientan la sal y desarrollan el sabor antes de cocinar.

Para no fallar
• Mantén la carne fría durante todo el proceso.
• Evita sobremezclar para conservar buena textura.
• Usa carne fresca y grasa firme.
• No pinches los chorizos durante la cocción.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un chorizo jugoso, parejo y de sabor redondo, sin picos de sal ni de especia.$t$, 2,
   null, null, null, $t$/recipes/chorizo-parrillero.jpg$t$, $t$Te voy a mandar una foto de mi Chorizo Parrillero Clásico (tripa de Natural de cerdo, cal. 32–35 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Panceta Curada y Ahumada (Bacon) · sale el 2027-02-03

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$panceta-ahumada$t$, $t$Panceta Curada y Ahumada (Bacon)$t$, $t$El curado que se cocina — panceta de cerdo curada en seco y ahumada en frío con manzano, lista para la sartén.$t$, $t$/recipes/panceta-ahumada.jpg$t$,
   'intermedio', 'pago', 'curso', 'lista-de-espera', 'libre', 210,
   'jamones-curados', '{curado,ahumado}', date '2027-02-03')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$panceta-ahumada$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$panceta-ahumada$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Panceta curada en seco, ahumada y lista para cocinar.$t$, 0,
   $t$El bacon casero no es solo panceta con humo: es una pieza curada varios días antes de ver el ahumadero. La panceta de cerdo se frota con una cura seca de sal, azúcar y sal de cura, reposa en frío hasta absorber el sabor, se seca sin tapar hasta formar una película pegajosa y se ahúma a baja temperatura con manzano o nogal. A diferencia del resto de curados de esta colección, esta pieza no se come cruda: siempre se cocina antes de servir.

«El bacon no es solo panceta con humo: es una pieza curada días antes de ver el ahumadero.»$t$, $t$/recipes/panceta-ahumada.jpg$t$, null, null, $t$La receta de Panceta Curada y Ahumada (Bacon) está para 1.5 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$panceta-ahumada$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$El azúcar moreno al 3% suaviza el salado y ayuda a dorar en la sartén.$t$, 0,
   $t$• Panceta de cerdo (con o sin piel): 1500 g (100%)
• Sal: 39 g (2.6%)
• Sal de cura #1 (Prague Powder #1): 3.75 g (0.25%)
• Azúcar moreno: 45 g (3%)
• Pimienta negra molida: 4.5 g (0.3%)

El azúcar moreno al 3% suaviza el salado y ayuda a dorar en la sartén. La sal de cura #1 (no #2) es la correcta aquí porque esta pieza se ahúma en caliente y se cocina — no cura meses al aire.

El porcentaje es el peso sobre el peso de la panceta. Valores por kilo: sal 26 g, sal de cura #1 2.5 g, azúcar moreno 30 g, pimienta negra 3 g.

A diferencia de otros curados de esta colección, esta panceta se cocina siempre antes de comer — la sal de cura #1 es la indicada para curados que luego se cocinan o ahúman en caliente.$t$, null, null, null, $t$Panceta Curada y Ahumada (Bacon) lleva Sal de cura #1 (Prague Powder #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$panceta-ahumada$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Frotar y curar en frío$t$, $t$Mezcla sal, sal de cura #1, azúcar y pimienta; frota bien toda la pieza.$t$, 0,
   $t$- Mezcla sal, sal de cura #1, azúcar y pimienta; frota bien toda la pieza.
- Cura en una bolsa cerrada en frío (0–4 °C) 5–7 días, volteando cada día.$t$, $t$/recipes/panceta-ahumada.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Enjuagar y formar la película$t$, $t$Enjuaga el exceso de curado bajo agua fría y seca con papel.$t$, 1,
   $t$- Enjuaga el exceso de curado bajo agua fría y seca con papel.
- Deja secar sin tapar en la nevera 12–24 h hasta que la superficie quede pegajosa (la película que fija el humo).$t$, $t$/recipes/panceta-ahumada.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Ahumar y enfriar$t$, $t$Ahúma en frío o a baja temperatura (71–93 °C) con manzano, nogal o cerezo, hasta 65–68 °C internos.$t$, 2,
   $t$- Ahúma en frío o a baja temperatura (71–93 °C) con manzano, nogal o cerezo, hasta 65–68 °C internos.
- Deja enfriar y reposar en frío antes de cortar en lonchas.$t$, $t$/recipes/panceta-ahumada.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Cocinarla antes de comer$t$, $t$Cocina siempre antes de comer — a la sartén o al horno hasta dorar.$t$, 3,
   $t$- Cocina siempre antes de comer — a la sartén o al horno hasta dorar.$t$, $t$/recipes/panceta-ahumada.jpg$t$, null, null, $t$Estoy curando mi Panceta Curada y Ahumada (Bacon) (la receta dice 5–7 días en frío). ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$panceta-ahumada$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$En lonchas finas, a fuego medio hasta dorar y quedar crujiente en los bordes.$t$, 0,
   $t$A la sartén
En lonchas finas, a fuego medio hasta dorar y quedar crujiente en los bordes.

Al horno
Sobre rejilla a 190 °C, 15–20 min, para un dorado parejo sin tanta grasa salpicada.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Durante el curado, voltea la pieza a diario para que la sal y el curado penetren parejo.$t$, 1,
   $t$Voltea cada día
Durante el curado, voltea la pieza a diario para que la sal y el curado penetren parejo.

Forma la película antes de ahumar
El secado en frío sin tapar crea una superficie pegajosa que retiene mejor el humo.

No te pases de temperatura
Un ahumado demasiado caliente cuece la grasa antes de tiempo; mantente en 71–93 °C.

Para no fallar
• Cura siempre en frío, nunca a temperatura ambiente.
• No omitas la sal de cura #1 en un ahumado en caliente.
• Deja formar la película pegajosa antes de ahumar.
• Cocina siempre esta pieza antes de comerla — a diferencia de un curado tradicional, no se come cruda.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: lonchas vetadas de carne y grasa, con un ahumado suave y un salado justo — el bacon casero no se parece al de bolsa.$t$, 2,
   null, null, null, $t$/recipes/panceta-ahumada.jpg$t$, $t$Te voy a mandar una foto de mi Panceta Curada y Ahumada (Bacon) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Chorizo Criollo Argentino · sale el 2027-02-10

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$chorizo-criollo-argentino$t$, $t$Chorizo Criollo Argentino$t$, $t$El alma del asado y el choripán — mezcla de cerdo y res, molido grueso, poco condimento y mucho fuego.$t$, $t$/recipes/chorizo-criollo-argentino.jpg$t$,
   'para-empezar', 'pago', 'curso', 'lista-de-espera', 'libre', 220,
   'chorizos', '{embutir-amarrar}', date '2027-02-10')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$chorizo-criollo-argentino$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$chorizo-criollo-argentino$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$El chorizo del asado y el choripán.$t$, 0,
   $t$El chorizo criollo es el protagonista silencioso de todo asado argentino. A diferencia del español, no busca el pimentón ni el curado: es fresco, de molido grueso, con un condimento discreto que deja hablar a la carne. Mezcla clásica de cerdo y vacuno, un toque de vino y a la parrilla. Simple, honesto, imbatible en un buen choripán.

«El criollo no compite con la carne del asado: la acompaña. Por eso el condimento es discreto y la mano, corta.»$t$, $t$/recipes/chorizo-criollo-argentino.jpg$t$, null, null, $t$La receta de Chorizo Criollo Argentino está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$chorizo-criollo-argentino$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$60% cerdo, 20% res y 20% grasa es la base del criollo tradicional.$t$, 0,
   $t$• Carne de cerdo (paleta): 600 g (60%)
• Carne de res (roast/aguja): 200 g (20%)
• Grasa de cerdo: 200 g (20%)
• Sal: 20 g (2%)
• Ajo fresco triturado: 10 g (1%)
• Pimentón dulce: 6 g (0.6%)
• Pimienta negra: 3 g (0.3%)
• Ají molido (opcional): 3 g (0.3%)
• Nuez moscada: 1 g (0.1%)
• Vino blanco seco: 50 ml (5%)

60% cerdo, 20% res y 20% grasa es la base del criollo tradicional. Puedes subir el cerdo si buscas un chorizo más suave, o el vacuno para más carácter.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Es la misma proporción para 1 kg o para 10.

Pesa los secos y mézclalos antes de moler. Un criollo no lleva muchas especias: lo que importa es que las pocas que lleva estén parejas.$t$, null, null, null, $t$Estoy haciendo Chorizo Criollo Argentino y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$chorizo-criollo-argentino$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Los secos y la carne fría$t$, $t$Mezcla todos los secos (sal, ajo, pimentón, pimienta, ají y nuez moscada).$t$, 0,
   $t$- Mezcla todos los secos (sal, ajo, pimentón, pimienta, ají y nuez moscada).
- Corta las carnes y la grasa en cubos y mantenlas entre 0 y 4 °C.$t$, $t$/recipes/chorizo-criollo-argentino.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Moler grueso y amasar con vino$t$, $t$Muele con disco grueso de 8–10 mm para conservar la mordida.$t$, 1,
   $t$- Muele con disco grueso de 8–10 mm para conservar la mordida.
- Integra los secos y luego el vino frío, amasando lo justo.$t$, $t$/recipes/chorizo-criollo-argentino.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Embutir y atar$t$, $t$Embute en tripa natural de cerdo, calibre 32–34 mm.$t$, 2,
   $t$- Embute en tripa natural de cerdo, calibre 32–34 mm.
- Forma los chorizos y ata en el largo deseado.$t$, $t$/recipes/chorizo-criollo-argentino.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Reposo antes de la parrilla$t$, $t$Refrigera al menos 12 horas antes de llevar a la parrilla.$t$, 3,
   $t$- Refrigera al menos 12 horas antes de llevar a la parrilla.$t$, $t$/recipes/chorizo-criollo-argentino.jpg$t$, null, null, $t$Hice Chorizo Criollo Argentino. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$chorizo-criollo-argentino$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$25–30 minutos a fuego medio, girando; la clave es cocción pareja sin apurar el fuego.$t$, 0,
   $t$Parrilla
25–30 minutos a fuego medio, girando; la clave es cocción pareja sin apurar el fuego.

Choripán
Abierto a la mitad los últimos minutos, en pan crujiente y con chimichurri.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$El criollo se distingue por su textura: disco grueso y no sobremezclar.$t$, 1,
   $t$Molido grueso
El criollo se distingue por su textura: disco grueso y no sobremezclar. Debe verse la carne, no una pasta.

Poco condimento
Menos es más. El pimentón aquí es color y fondo, no protagonista como en el español.

A fuego medio
Ásalo lento y entero; si lo abres “mariposa”, hazlo recién sobre las brasas para que no se seque.

Para no fallar
• Mantén las carnes frías durante todo el proceso.
• Usa disco grueso y amasa lo mínimo.
• No pinches el chorizo en la parrilla.
• Deja reposar 12 h para que el sabor se asiente.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un chorizo jugoso y de mordida firme, que dora parejo y no se deshace.$t$, 2,
   null, null, null, $t$/recipes/chorizo-criollo-argentino.jpg$t$, $t$Te voy a mandar una foto de mi Chorizo Criollo Argentino (tripa de Natural de cerdo, cal. 32–34 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Pastrami Ahumado · sale el 2027-02-17

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$pastrami$t$, $t$Pastrami Ahumado$t$, $t$El curado que se ahúma y se cuece al vapor — pecho de res en salmuera, especiado en pimienta y cilantro, ahumado hasta tierno.$t$, $t$/recipes/pastrami.jpg$t$,
   'avanzado', 'pago', 'curso', 'lista-de-espera', 'libre', 230,
   'jamones-cocidos', '{curado,ahumado,coccion}', date '2027-02-17')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$pastrami$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$pastrami$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Pecho de res en salmuera, ahumado y cocido al vapor.$t$, 0,
   $t$El pastrami es el único curado de esta colección que termina en la olla de vapor, no en el cuchillo directo. Un pecho de res se cura varios días sumergido en una salmuera con sal de cura, se cubre en una costra generosa de pimienta y cilantro en grano, se ahúma hasta los 74 °C internos y finalmente se cuece al vapor hasta quedar tierno. De tradición judía-rumana y símbolo del deli neoyorquino, se sirve siempre caliente, en lonchas gruesas sobre pan de centeno — el broche especiado de esta colección de curados.

«El pastrami es el único curado de esta colección que termina en la olla de vapor, no en el cuchillo directo.»$t$, $t$/recipes/pastrami.jpg$t$, null, null, $t$La receta de Pastrami Ahumado está para 2.5 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$pastrami$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$La salmuera lleva un 7% de sal sobre el peso de la carne, disuelta en igual peso de agua fría; la costra de…$t$, 0,
   $t$• Pecho de res (brisket): 2500 g (100%)
• Agua fría (para la salmuera): 2500 ml (100%)
• Sal: 175 g (7%)
• Sal de cura #1 (Prague Powder #1): 6.25 g (0.25%)
• Azúcar morena: 65 g (2.6%)
• Pimienta negra en grano (para la costra): 30 g (1.2%)
• Cilantro en grano (para la costra): 30 g (1.2%)
• Ajo en polvo: 10 g (0.4%)

La salmuera lleva un 7% de sal sobre el peso de la carne, disuelta en igual peso de agua fría; la costra de pimienta y cilantro se aplica después, ya escurrida la pieza.

El porcentaje es el peso sobre el peso del pecho de res. Valores por kilo: agua 1000 ml, sal 70 g, sal de cura #1 2.5 g, azúcar 26 g, pimienta 12 g, cilantro 12 g, ajo 4 g.

Este es un curado en salmuera, no en seco — la sal de cura #1 es indispensable, disuelta en agua junto con sal y azúcar antes de sumergir la pieza.$t$, null, null, null, $t$Pastrami Ahumado lleva Sal de cura #1 (Prague Powder #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$pastrami$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$La salmuera y la pieza$t$, $t$Disuelve la sal, la sal de cura #1 y el azúcar en el agua fría hasta obtener la salmuera.$t$, 0,
   $t$- Disuelve la sal, la sal de cura #1 y el azúcar en el agua fría hasta obtener la salmuera.
- Sumerge el pecho de res por completo, con un peso encima para que no flote.$t$, $t$/recipes/pastrami.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Curar y enjuagar$t$, $t$Cura en frío 5–10 días, según el grosor de la pieza.$t$, 1,
   $t$- Cura en frío 5–10 días, según el grosor de la pieza.
- Retira de la salmuera, enjuaga bien y seca con papel.$t$, $t$/recipes/pastrami.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$La costra y el ahumado$t$, $t$Machaca pimienta y cilantro en grano y cubre toda la pieza formando la costra.$t$, 2,
   $t$- Machaca pimienta y cilantro en grano y cubre toda la pieza formando la costra.
- Ahúma a unos 135 °C hasta que la pieza alcance 74 °C internos.$t$, $t$/recipes/pastrami.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Al vapor y a la mesa$t$, $t$Cuece al vapor hasta que esté tierna al pinchar, y sirve caliente en lonchas.$t$, 3,
   $t$- Cuece al vapor hasta que esté tierna al pinchar, y sirve caliente en lonchas.$t$, $t$/recipes/pastrami.jpg$t$, null, null, $t$Hice Pastrami Ahumado (con ahumado: Aprox. 135 °C, hasta 74 °C internos). ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$pastrami$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Caliente, en lonchas gruesas, sobre pan de centeno con mostaza — el clásico neoyorquino.$t$, 0,
   $t$En sándwich
Caliente, en lonchas gruesas, sobre pan de centeno con mostaza — el clásico neoyorquino.

En tabla caliente
Servido recién cortado, con encurtidos ácidos que equilibran lo especiado y ahumado.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Mantén el pecho siempre sumergido en la salmuera; una zona fuera del líquido no cura bien.$t$, 1,
   $t$Un peso sobre la pieza
Mantén el pecho siempre sumergido en la salmuera; una zona fuera del líquido no cura bien.

Costra generosa
No escatimes en pimienta y cilantro — es la firma visual y de sabor del pastrami.

El vapor final no es opcional
Sin la cocción al vapor, la pieza queda fibrosa y dura; es lo que la hace tierna.

Para no fallar
• Cura siempre en frío y con la pieza totalmente sumergida.
• No omitas la sal de cura #1 en una salmuera de varios días.
• Aplica la costra de especias generosa y justo antes de ahumar.
• Termina siempre al vapor — es el paso que da la textura final.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: lonchas fibrosas y tiernas, con un anillo rosado y una costra especiada — el único curado de la colección que se sirve caliente.$t$, 2,
   null, null, null, $t$/recipes/pastrami.jpg$t$, $t$Te voy a mandar una foto de mi Pastrami Ahumado para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Chorizo Verde de Toluca · sale el 2027-02-24

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$chorizo-verde-mexicano$t$, $t$Chorizo Verde de Toluca$t$, $t$El fresco verde de Toluca — tomatillo, chiles verdes, cilantro y perejil molidos con la carne.$t$, $t$/recipes/chorizo-verde-mexicano.jpg$t$,
   'intermedio', 'pago', 'curso', 'lista-de-espera', 'libre', 240,
   'chorizos', '{embutir-amarrar}', date '2027-02-24')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$chorizo-verde-mexicano$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$chorizo-verde-mexicano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$El chorizo verde que conquistó a Toluca.$t$, 0,
   $t$El chorizo verde es la joya de Toluca: un embutido fresco de color intenso, hecho con una pasta de tomatillo, chiles verdes, cilantro y perejil. Cada familia guarda su receta, pero todas coinciden en el chile serrano, el cilantro y el tomatillo como base. La espinaca o acelga refuerzan el verde, y las especias — comino, clavo, orégano — le dan profundidad. Se cocina fresco, nunca se cura.

«El verde de Toluca no es un chorizo teñido: la carne y la pasta verde se muelen juntas, y ahí nace su color y su acidez.»$t$, $t$/recipes/chorizo-verde-mexicano.jpg$t$, null, null, $t$La receta de Chorizo Verde de Toluca está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$chorizo-verde-mexicano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$80% carne y 20% grasa, con la pasta verde al 15% del total.$t$, 0,
   $t$• Carne de cerdo (pierna o paleta): 800 g (80%)
• Grasa de cerdo: 200 g (20%)
• Pasta verde (tomatillo, chile serrano, cilantro, perejil, espinaca): 150 g (15%)
• Ajo fresco triturado: 15 g (1.5%)
• Sal: 20 g (2%)
• Vinagre blanco: 30 ml (3%)
• Comino: 3 g (0.3%)
• Orégano seco: 2 g (0.2%)
• Pimienta negra: 2 g (0.2%)
• Clavo molido: 1 g (0.1%)

80% carne y 20% grasa, con la pasta verde al 15% del total. Más pasta intensifica el color y la acidez, pero también la humedad: escúrrela para poder embutir.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Al ser fresco, no lleva sal de cura, pero sí se consume cocinado y pronto.

Licúa primero la pasta verde y escúrrela un poco: demasiada humedad dificulta el embutido. Ajusta el picante con la cantidad de serrano.$t$, null, null, null, $t$Estoy haciendo Chorizo Verde de Toluca y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$chorizo-verde-mexicano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$La pasta verde y los secos$t$, $t$Licúa la pasta verde (tomatillo, chiles, cilantro, perejil, espinaca) y escúrrela.$t$, 0,
   $t$- Licúa la pasta verde (tomatillo, chiles, cilantro, perejil, espinaca) y escúrrela.
- Mezcla los secos: sal, comino, orégano, pimienta y clavo.$t$, $t$/recipes/chorizo-verde-mexicano.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Cortar y moler$t$, $t$Corta la carne y la grasa en cubos, muy fríos (0–4 °C).$t$, 1,
   $t$- Corta la carne y la grasa en cubos, muy fríos (0–4 °C).
- Muele la carne y la grasa con disco de 8 mm.$t$, $t$/recipes/chorizo-verde-mexicano.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Teñir la masa y embutir$t$, $t$Integra la pasta verde, el ajo, los secos y el vinagre; amasa hasta teñir la masa.$t$, 2,
   $t$- Integra la pasta verde, el ajo, los secos y el vinagre; amasa hasta teñir la masa.
- Embute en tripa fina de cerdo (28–32 mm) y forma los chorizos.$t$, $t$/recipes/chorizo-verde-mexicano.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Reposo y consumo$t$, $t$Refrigera 12–24 h; consúmelo fresco en pocos días.$t$, 3,
   $t$- Refrigera 12–24 h; consúmelo fresco en pocos días.$t$, $t$/recipes/chorizo-verde-mexicano.jpg$t$, null, null, $t$Hice Chorizo Verde de Toluca. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$chorizo-verde-mexicano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Desmenuzado a fuego medio hasta secar la humedad; ideal para tacos y huevos.$t$, 0,
   $t$Sartén
Desmenuzado a fuego medio hasta secar la humedad; ideal para tacos y huevos.

Comal
En trozos sobre comal caliente, girando hasta dorar por fuera.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$La humedad es el enemigo del embutido.$t$, 1,
   $t$Escurre la pasta
La humedad es el enemigo del embutido. Escurre bien la pasta verde para que la masa ligue.

Frío constante
Trabaja entre 0 y 4 °C; la pasta fría ayuda a mantener la grasa firme.

Fresco, no curado
El verde es un chorizo fresco: refrigéralo y cocínalo en pocos días, o congélalo.

Para no fallar
• Escurre bien la pasta verde antes de mezclar.
• Mantén la carne y la grasa frías.
• Consúmelo fresco en pocos días o congélalo.
• Ajusta el picante con la cantidad de chile serrano.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un chorizo de verde vivo, fresco y ácido, con el picor justo.$t$, 2,
   null, null, null, $t$/recipes/chorizo-verde-mexicano.jpg$t$, $t$Te voy a mandar una foto de mi Chorizo Verde de Toluca (tripa de Natural de cerdo, cal. 28–32 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Biltong · sale el 2027-03-03

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$biltong$t$, $t$Biltong$t$, $t$El curado exprés sudafricano — res en vinagre, sal y cilantro tostado, secada al aire en pocos días.$t$, $t$/recipes/biltong.jpg$t$,
   'para-empezar', 'pago', 'curso', 'lista-de-espera', 'libre', 250,
   'jamones-curados', '{curado}', date '2027-03-03')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$biltong$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$biltong$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Tiras de res curadas con vinagre y secadas al aire.$t$, 0,
   $t$El biltong es el curado más rápido de la colección — y el único que no necesita ni sal de cura ni ahumado. Tiras de res cortadas a favor de la fibra se cubren en vinagre, sal y cilantro tostado, curan una noche en frío y se cuelgan en un espacio bien ventilado apenas cuatro días, hasta que no ceden al apretarlas con los dedos. La acidez del vinagre, el frío inicial y un secado corto —de días, no de meses— bastan para su conservación segura, muy distinto de los curados largos del resto de esta colección.

«El biltong es el curado más rápido de la colección — y el único que no necesita ni sal de cura ni ahumado.»$t$, $t$/recipes/biltong.jpg$t$, null, null, $t$La receta de Biltong está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$biltong$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$El cilantro tostado al 1.5% es la firma aromática del biltong — tuéstalo justo antes de machacarlo para un…$t$, 0,
   $t$• Falda o cadera de res (en tiras): 1000 g (100%)
• Vinagre de vino tinto o balsámico: 100 ml (10%)
• Sal gruesa: 26 g (2.6%)
• Cilantro en grano tostado y machacado: 15 g (1.5%)
• Pimienta negra molida: 5 g (0.5%)
• Azúcar morena (opcional): 10 g (1%)

El cilantro tostado al 1.5% es la firma aromática del biltong — tuéstalo justo antes de machacarlo para un aroma más intenso.

El porcentaje es el peso sobre el peso de la carne. Valores por kilo: vinagre 100 ml, sal 26 g, cilantro 15 g, pimienta 5 g, azúcar 10 g.

A diferencia de los curados largos de esta colección, el biltong tradicional no lleva sal de cura: el vinagre, el frío y un secado corto de días —no meses— bastan para su conservación segura.$t$, null, null, null, $t$Estoy haciendo Biltong y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$biltong$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$El cilantro y las tiras$t$, $t$Tuesta los granos de cilantro en una sartén seca y machácalos grueso.$t$, 0,
   $t$- Tuesta los granos de cilantro en una sartén seca y machácalos grueso.
- Corta la carne en tiras de 2–3 cm de grosor, a favor de la fibra.$t$, $t$/recipes/biltong.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Vinagre y especias$t$, $t$Cubre las tiras con el vinagre, dejando que penetre unos minutos.$t$, 1,
   $t$- Cubre las tiras con el vinagre, dejando que penetre unos minutos.
- Frota con sal, cilantro tostado, pimienta y azúcar.$t$, $t$/recipes/biltong.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Curar y colgar$t$, $t$Cura tapado en frío durante una noche.$t$, 2,
   $t$- Cura tapado en frío durante una noche.
- Cuelga las tiras en un espacio bien ventilado, con un ventilador si es posible.$t$, $t$/recipes/biltong.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$El secado$t$, $t$Seca unos 4 días, hasta que no ceda al presionar con los dedos.$t$, 3,
   $t$- Seca unos 4 días, hasta que no ceda al presionar con los dedos.$t$, $t$/recipes/biltong.jpg$t$, null, null, $t$Estoy curando mi Biltong (la receta dice Una noche en frío). ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$biltong$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Se come tal cual, cortado en lonchas finas o desmenuzado con los dedos.$t$, 0,
   $t$Como snack
Se come tal cual, cortado en lonchas finas o desmenuzado con los dedos.

En ensaladas
Rallado o en tiras finas, aporta un salado ácido intenso a ensaladas frescas.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Facilita colgar las tiras y da la textura característica al morder, deshebrada en el sentido correcto.$t$, 1,
   $t$Corta a favor de la fibra
Facilita colgar las tiras y da la textura característica al morder, deshebrada en el sentido correcto.

Ventilación, no calor
El biltong seca con aire en movimiento, no con calor; un ventilador es más útil que una fuente de calor.

Ajusta el punto a tu gusto
Menos días de secado dan un biltong más tierno y húmedo; más días, uno más firme y concentrado.

Para no fallar
• Usa un vinagre de calidad — su acidez es parte de la conservación, no solo del sabor.
• Cuelga las tiras sin que se toquen entre sí para un secado parejo.
• Revisa a diario apretando la carne para encontrar tu punto ideal.
• Consume en un plazo razonable y consérvalo en frío una vez seco.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: tiras oscuras y aromáticas, ácidas por el vinagre y perfumadas de cilantro tostado — listas en días, no en meses.$t$, 2,
   null, null, null, $t$/recipes/biltong.jpg$t$, $t$Te voy a mandar una foto de mi Biltong para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Chistorra · sale el 2027-03-10

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$chistorra$t$, $t$Chistorra$t$, $t$Navarra en formato fino — muy jugosa, pimentón y ajo, oreada pocos días y hecha a la sartén o brasa.$t$, $t$/recipes/chistorra.jpg$t$,
   'intermedio', 'pago', 'curso', 'lista-de-espera', 'libre', 260,
   'chorizos', '{embutir-amarrar,curado}', date '2027-03-10')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$chistorra$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$chistorra$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Fina, roja y jugosa; lista en pocos días.$t$, 0,
   $t$La chistorra es el chorizo fresco-oreado de Navarra y el País Vasco: fina, muy jugosa y roja por el pimentón. No es un curado largo — se orea apenas unos días y se cocina. Su calibre delgado la hace ideal para la sartén, la brasa o el pincho. Rica en grasa, con ajo y pimentón al frente, es pura contundencia en poco diámetro.

«La chistorra no busca curar: busca jugosidad. Por eso lleva más grasa y menos tiempo que un chorizo de bodega.»$t$, $t$/recipes/chistorra.jpg$t$, null, null, $t$La receta de Chistorra está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$chistorra$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$70% magro y 30% tocino: la chistorra es deliberadamente grasa, y eso es lo que la hace jugosa al cocinarla.$t$, 0,
   $t$• Carne de cerdo (magro): 700 g (70%)
• Tocino de cerdo: 300 g (30%)
• Pimentón dulce: 25 g (2.5%)
• Ajo fresco triturado: 15 g (1.5%)
• Sal: 22 g (2.2%)
• Sal de cura #1 (nitrificante): 2.5 g (0.25%)
• Pimienta negra: 3 g (0.3%)
• Agua helada: 20 ml (2%)

70% magro y 30% tocino: la chistorra es deliberadamente grasa, y eso es lo que la hace jugosa al cocinarla. No bajes mucho la grasa o pierde su carácter.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y tocino. La sal de cura #1 protege durante el oreo corto: 2,5 g por kilo es el estándar y también el techo, nunca más. La regla general del oficio: #1 para lo corto y para todo lo que se cocina —que es el caso de la chistorra—, #2 solo para curados largos en seco, de semanas o meses.

Aquí va sal de cura #1, no #2. La #1 lleva nitrito, que actúa desde el primer día y es lo que hace falta en un oreo de 1–3 días. La #2 lleva además nitrato, que necesita semanas para convertirse en nitrito: en tres días no te protege de nada. Muele fino: la chistorra es de textura homogénea, no de grano grueso.$t$, null, null, null, $t$Chistorra lleva Sal de cura #1 (nitrificante). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$chistorra$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Los secos y la carne fría$t$, $t$Mezcla los secos aparte: pimentón, sal, sal de cura #1, ajo y pimienta.$t$, 0,
   $t$- Mezcla los secos aparte: pimentón, sal, sal de cura #1, ajo y pimienta. Hacerlo en un bol antes de tocar la carne es lo único que garantiza que la sal de cura quede repartida pareja.
- Corta magro y tocino en cubos, muy fríos (0–2 °C).$t$, $t$/recipes/chistorra.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Moler fino y ligar$t$, $t$Muele fino con disco de 6 mm.$t$, 1,
   $t$- Muele fino con disco de 6 mm.
- Integra los secos con el agua helada; amasa hasta ligar bien.$t$, $t$/recipes/chistorra.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Embutir en tripa fina$t$, $t$Embute en tripa fina de cordero (20–22 mm) sin bolsas de aire.$t$, 2,
   $t$- Embute en tripa fina de cordero (20–22 mm) sin bolsas de aire.
- Forma rollos o tiras largas.$t$, $t$/recipes/chistorra.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$El oreo$t$, $t$Orea 1–3 días a 12–15 °C antes de cocinar.$t$, 3,
   $t$- Orea 1–3 días a 12–15 °C antes de cocinar.$t$, $t$/recipes/chistorra.jpg$t$, null, null, $t$Estoy curando mi Chistorra. ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$chistorra$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Fuego medio 5–7 minutos; suelta su grasa y queda dorada y melosa.$t$, 0,
   $t$Sartén
Fuego medio 5–7 minutos; suelta su grasa y queda dorada y melosa.

Brasa o pincho
En pincho sobre brasa, rápido; ideal en pan como bocado.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$La chistorra es de textura homogénea; el disco de 6 mm da su mordida característica.$t$, 1,
   $t$Muele fino
La chistorra es de textura homogénea; el disco de 6 mm da su mordida característica.

Calibre delgado
La tripa de cordero (20–22 mm) es clave: define su formato fino y su cocción rápida.

Oreo corto, y por eso sal de cura #1
Unos días a 12–15 °C bastan; no es un curado largo. Y como es corto y además se cocina, la sal que corresponde es la #1: el nitrito actúa de inmediato. La #2 ahí no hace nada.

Para no fallar
• Usa buena proporción de tocino: la jugosidad es su firma.
• Muele fino con disco de 6 mm.
• Orea solo unos días; siempre se consume cocinada.
• Emplea tripa fina de cordero para el calibre correcto.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: una chistorra fina, roja y jugosa, que al calor suelta su grasa y se vuelve melosa.$t$, 2,
   null, null, null, $t$/recipes/chistorra.jpg$t$, $t$Te voy a mandar una foto de mi Chistorra (tripa de Natural de cordero, cal. 20–22 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Jamón de Pierna Horneado · sale el 2027-03-17

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$jamon-pierna-horneado$t$, $t$Jamón de Pierna Horneado$t$, $t$El jamón cocido casero hecho al horno en vez de en agua — pierna de cerdo en salmuera, envuelta y horneada, prensada y reposada hasta quedar jugosa y lista para fetear.$t$, $t$/recipes/jamon-pierna-horneado.jpg$t$,
   'intermedio', 'pago', 'curso', 'lista-de-espera', 'libre', 270,
   'jamones-cocidos', '{curado,coccion}', date '2027-03-17')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$jamon-pierna-horneado$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$jamon-pierna-horneado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Pierna en salmuera, horneada envuelta y prensada en frío.$t$, 0,
   $t$De una pierna de cerdo de 4 kilos y medio, deshuesada y sin cuero, salen más de 2 kilos de jamón cocido casero — y realmente solo lleva tiempo, no es difícil. La pieza se sumerge en una salmuera de agua, azúcar, sal y sal de cura durante 5 a 6 días, se ata bien compacta y se cocina envuelta al horno en lugar del tradicional baño de agua a 80 °C. Un prensado y un reposo en frío toda la noche terminan el trabajo: al día siguiente aparece ese color rosado clásico y una textura jugosa, lista para cortar.

«Cuantas más vetas y textura tenga el jamón, de mejor calidad es — si lo ves muy liso, desconfía.»$t$, $t$/recipes/jamon-pierna-horneado.jpg$t$, null, null, $t$La receta de Jamón de Pierna Horneado está para 4 kg (pierna deshuesada). Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$jamon-pierna-horneado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$La salmuera lleva un 7% de sal sobre el peso de la carne, disuelta en igual peso de agua fría — la misma…$t$, 0,
   $t$• Pierna de cerdo (deshuesada, sin cuero): 4000 g (100%)
• Agua fría (para la salmuera): 4000 ml (100%)
• Sal: 280 g (7%)
• Sal de cura #1 (Prague Powder #1): 10 g (0.25%)
• Azúcar: 104 g (2.6%)

La salmuera lleva un 7% de sal sobre el peso de la carne, disuelta en igual peso de agua fría — la misma lógica que un curado en salmuera de cualquier pieza grande. El azúcar suaviza el salado sin competir con el sabor del jamón.

El porcentaje es el peso sobre el peso de la pierna. Valores por kilo: agua 1000 ml, sal 70 g, sal de cura #1 2.5 g, azúcar 26 g.

La clave está en que la pieza quede realmente bien sumergida en la salmuera, cubriendo todas sus partes — usa un peso encima si hace falta para que no flote.$t$, null, null, null, $t$Jamón de Pierna Horneado lleva Sal de cura #1 (Prague Powder #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 10 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$jamon-pierna-horneado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Deshuesar y la salmuera$t$, $t$Deshuesa la pierna de cerdo y retira el cuero — es la parte más laboriosa, pero deja la carne lista para la…$t$, 0,
   $t$- Deshuesa la pierna de cerdo y retira el cuero — es la parte más laboriosa, pero deja la carne lista para la salmuera.
- Prepara la salmuera disolviendo el agua, la sal, la sal de cura y el azúcar.
- Sumerge la pieza por completo en la salmuera, cubriendo todas sus partes; usa un peso encima si hace falta para que no flote.$t$, $t$/recipes/jamon-pierna-horneado.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Curar, lavar y atar$t$, $t$Cura en la nevera entre 5 y 6 días.$t$, 1,
   $t$- Cura en la nevera entre 5 y 6 días.
- Pasado el tiempo, retira la pieza, lávala bien bajo agua fría y sécala por completo.
- Átala con rejilla para jamón o con hilo de matambre, dándole una forma compacta y cilíndrica.$t$, $t$/recipes/jamon-pierna-horneado.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Envolver, hornear y prensar$t$, $t$Envuelve la pieza en una capa de papel manteca y otra de papel aluminio.$t$, 2,
   $t$- Envuelve la pieza en una capa de papel manteca y otra de papel aluminio.
- Hornea a temperatura controlada (similar a un baño de agua a 80 °C) durante unas 3 horas, hasta que la pieza alcance 68–70 °C internos.
- Deja atemperar, ponle un peso encima y refrigera toda la noche.$t$, $t$/recipes/jamon-pierna-horneado.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$El jamón listo$t$, $t$Al día siguiente, desenvuelve: tendrás un jamón cocido de color rosado y textura jugosa, listo para fetear…$t$, 3,
   $t$- Al día siguiente, desenvuelve: tendrás un jamón cocido de color rosado y textura jugosa, listo para fetear con máquina o cuchillo.$t$, $t$/recipes/jamon-pierna-horneado.jpg$t$, null, null, $t$Estoy curando mi Jamón de Pierna Horneado. ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$jamon-pierna-horneado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Envuelto en papel manteca y aluminio, a temperatura controlada, unas 3 horas hasta el punto interno.$t$, 0,
   $t$Al horno (esta receta)
Envuelto en papel manteca y aluminio, a temperatura controlada, unas 3 horas hasta el punto interno.

A baño de agua (tradicional)
Sumergido en agua a 80 °C hasta alcanzar el punto interno — el método clásico del jamón cocido.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Cubre por completo con la salmuera y usa un peso si es necesario — cualquier zona expuesta al aire no cura…$t$, 1,
   $t$La pieza debe quedar bien sumergida
Cubre por completo con la salmuera y usa un peso si es necesario — cualquier zona expuesta al aire no cura parejo.

El prensado marca la textura
El peso y el reposo toda la noche en frío son los que le dan al jamón esa textura firme y fácil de fetear.

Más vetas, mejor calidad
Un jamón con vetas y textura visibles al corte es buena señal; si lo ves demasiado liso, algo no está bien.

Para no fallar
• No omitas la sal de cura — es la que da el color rosado clásico y la seguridad del curado.
• Verifica que la pieza quede totalmente cubierta por la salmuera durante los 5–6 días.
• No te saltes el prensado ni el reposo en frío — son los que dan la textura final.
• Congela lo que no vayas a consumir pronto; rinde para varias semanas.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: más de 2 kilos de jamón cocido casero, de color rosado clásico y textura jugosa — todo por una fracción de lo que cuesta comprarlo ya hecho.$t$, 2,
   null, null, null, $t$/recipes/jamon-pierna-horneado.jpg$t$, $t$Te voy a mandar una foto de mi Jamón de Pierna Horneado para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Merguez · sale el 2027-03-24

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$merguez$t$, $t$Merguez$t$, $t$El fino y picante del Magreb — cordero, harissa y comino, rojo intenso y a la brasa.$t$, $t$/recipes/merguez.jpg$t$,
   'intermedio', 'pago', 'curso', 'lista-de-espera', 'libre', 280,
   'embutidos-frescos', '{embutir-amarrar}', date '2027-03-24')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$merguez$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$merguez$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Cordero especiado, delgado y picante.$t$, 0,
   $t$El merguez es el embutido fresco del norte de África: de cordero (a veces con res), delgado, rojo y picante. Su color y su fuego vienen de la harissa y el pimentón, sobre una base de comino, cilantro y ajo. Se asa a la brasa hasta chisporrotear y se sirve con pan, cuscús o en bocadillo. Un chorizo especiado, intenso y de calibre fino.

«El merguez es el chorizo del cordero: cambia la carne, cambia el mundo de especias, pero la técnica es la misma.»$t$, $t$/recipes/merguez.jpg$t$, null, null, $t$La receta de Merguez está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$merguez$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$70% carne y 30% grasa de cordero da jugosidad y el sabor característico.$t$, 0,
   $t$• Carne de cordero: 700 g (70%)
• Grasa de cordero o res: 300 g (30%)
• Harissa: 40 g (4%)
• Pimentón picante: 20 g (2%)
• Ajo fresco triturado: 15 g (1.5%)
• Comino molido: 10 g (1%)
• Cilantro molido: 8 g (0.8%)
• Sal: 20 g (2%)
• Pimienta negra: 3 g (0.3%)
• Agua helada: 20 ml (2%)

70% carne y 30% grasa de cordero da jugosidad y el sabor característico. La harissa y el pimentón definen color y picor; ajústalos según tu tolerancia.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Al ser fresco, se cocina y se consume pronto, sin sal de cura.

La harissa aporta color y picor; ajústala a tu gusto. El comino y el cilantro molido son la base aromática.$t$, null, null, null, $t$Estoy haciendo Merguez y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$merguez$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Los secos y la carne fría$t$, $t$Mezcla los secos: pimentón, comino, cilantro, sal y pimienta.$t$, 0,
   $t$- Mezcla los secos: pimentón, comino, cilantro, sal y pimienta.
- Corta la carne y la grasa en cubos, muy fríos (0–4 °C).$t$, $t$/recipes/merguez.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Moler y la harissa$t$, $t$Muele con disco de 6–8 mm.$t$, 1,
   $t$- Muele con disco de 6–8 mm.
- Integra la harissa, el ajo, los secos y el agua; amasa hasta una masa roja y homogénea.$t$, $t$/recipes/merguez.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Reposo y embutido$t$, $t$Deja reposar en frío 12–24 h para que las especias se integren.$t$, 2,
   $t$- Deja reposar en frío 12–24 h para que las especias se integren.
- Embute en tripa fina de cordero (20–24 mm).$t$, $t$/recipes/merguez.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$A la brasa$t$, $t$Refrigera; consúmelo fresco a la brasa en pocos días.$t$, 3,
   $t$- Refrigera; consúmelo fresco a la brasa en pocos días.$t$, $t$/recipes/merguez.jpg$t$, null, null, $t$Hice Merguez. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$merguez$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$A fuego vivo, girando, hasta chisporrotear; su calibre fino se hace en minutos.$t$, 0,
   $t$Brasa
A fuego vivo, girando, hasta chisporrotear; su calibre fino se hace en minutos.

Con cuscús
Clásico junto a cuscús y verduras, o en bocadillo con harissa.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Es la que da el sabor auténtico.$t$, 1,
   $t$Grasa de cordero
Es la que da el sabor auténtico. Si te resulta fuerte, mézclala con grasa de res.

Harissa al gusto
Regula el picor con la cantidad de harissa; también aporta color y profundidad.

Calibre fino
La tripa de cordero (20–24 mm) es esencial para su formato delgado y cocción rápida.

Para no fallar
• Usa grasa de cordero para el sabor auténtico.
• Ajusta el picor con la harissa.
• Emplea tripa fina de cordero.
• Consúmelo fresco a la brasa.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un merguez delgado, rojo y picante, jugoso al morder y con el aroma del comino y el cilantro.$t$, 2,
   null, null, null, $t$/recipes/merguez.jpg$t$, $t$Te voy a mandar una foto de mi Merguez (tripa de Natural de cordero, cal. 20–24 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Fuet Catalán · sale el 2027-03-31

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques, releases_on)
values
  ($t$fuet$t$, $t$Fuet Catalán$t$, $t$Curado fino con flor blanca — cerdo, pimienta y ajo suave, madurado hasta su moho noble exterior.$t$, $t$/recipes/fuet.jpg$t$,
   'avanzado', 'pago', 'curso', 'lista-de-espera', 'libre', 290,
   'chorizos', '{embutir-amarrar,curado}', date '2027-03-31')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques,
  releases_on = excluded.releases_on, waitlist_goal = null, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$fuet$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$fuet$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Delgado, con flor blanca y sabor delicado.$t$, 0,
   $t$El fuet es el embutido curado catalán por excelencia: delgado, sin pimentón, con un sabor delicado de cerdo, pimienta y ajo suave. Su seña visual es la flor blanca — el moho noble (penicillium) que lo recubre y protege durante el curado, aportando aroma. Se cura relativamente rápido por su calibre fino, y se come en rodajas finas como aperitivo.

«La flor blanca del fuet no es un defecto: es el moho noble que protege el curado y le da su aroma inconfundible.»$t$, $t$/recipes/fuet.jpg$t$, null, null, $t$La receta de Fuet Catalán está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$fuet$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$80% magro y 20% tocino da un fuet firme pero tierno.$t$, 0,
   $t$• Carne de cerdo (magro): 800 g (80%)
• Tocino de cerdo: 200 g (20%)
• Sal: 26 g (2.6%)
• Pimienta negra molida: 4 g (0.4%)
• Ajo fresco triturado: 5 g (0.5%)
• Sal de cura (nitrificante, #2): 2.5 g (0.25%)
• Vino blanco seco: 20 ml (2%)

80% magro y 20% tocino da un fuet firme pero tierno. El condimento es mínimo a propósito: el fuet es sutileza, no potencia.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y tocino. La sal de cura al 0.25% es el estándar seguro.

El fuet es delicado, así que el condimento es discreto. La sal de cura es obligatoria; la flor blanca se favorece con humedad y aireación.$t$, null, null, null, $t$Fuet Catalán lleva Sal de cura (nitrificante, #2). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$fuet$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Los secos y la carne fría$t$, $t$Mezcla los secos: sal, sal de cura, pimienta y ajo.$t$, 0,
   $t$- Mezcla los secos: sal, sal de cura, pimienta y ajo.
- Corta magro y tocino en cubos, muy fríos (0–2 °C).$t$, $t$/recipes/fuet.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Moler y ligar con vino$t$, $t$Muele con disco de 6–8 mm.$t$, 1,
   $t$- Muele con disco de 6–8 mm.
- Integra los secos y el vino; amasa hasta ligar.$t$, $t$/recipes/fuet.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$Embutir y el moho noble$t$, $t$Embute firme en tripa de 34–38 mm sin bolsas de aire.$t$, 2,
   $t$- Embute firme en tripa de 34–38 mm sin bolsas de aire.
- Opcional: aplica cultivo de moho noble en la superficie.$t$, $t$/recipes/fuet.jpg$t$, null, null, null),
  ((select id from m), 'video', $t$La curación$t$, $t$Cura a 12–15 °C y 80–85% de humedad, 3–5 semanas, hasta que aparezca la flor blanca.$t$, 3,
   $t$- Cura a 12–15 °C y 80–85% de humedad, 3–5 semanas, hasta que aparezca la flor blanca.$t$, $t$/recipes/fuet.jpg$t$, null, null, $t$Estoy curando mi Fuet Catalán (la receta dice 3–5 semanas). ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$fuet$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Curado, como aperitivo o en bocadillo; su sabor delicado pide cortes finos.$t$, 0,
   $t$En rodajas finas
Curado, como aperitivo o en bocadillo; su sabor delicado pide cortes finos.

En tabla
Junto a queso y pan; marida con vinos blancos y cavas.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$El penicillium noble protege y aromatiza.$t$, 1,
   $t$Flor blanca
El penicillium noble protege y aromatiza. Favorécelo con buena humedad y algo de aireación.

Condimento sutil
El fuet no lleva pimentón; su gracia es la delicadeza. No lo sobrecondimentes.

Curado controlado
12–15 °C y humedad alta. Sin control, aparecen mohos indeseados en vez de la flor noble.

Para no fallar
• Favorece la flor blanca con humedad y aireación.
• Mantén el condimento sutil, sin pimentón.
• No omitas la sal de cura.
• Controla temperatura y humedad para evitar mohos indeseados.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un fuet delgado, cubierto de flor blanca, de sabor delicado y textura tierna.$t$, 2,
   null, null, null, $t$/recipes/fuet.jpg$t$, $t$Te voy a mandar una foto de mi Fuet Catalán (tripa de Natural de cerdo, cal. 34–38 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);
