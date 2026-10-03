-- ============================================================================
-- Diez recetas pasan a ser cursos de El Charcu Pro (2026-10-03)
--
-- ⚠️ GENERADA por `scripts/cursos-desde-recetas.ts`. No se edita a mano: se
-- cambia la receta o el script y se vuelve a generar en una migración nueva.
--
-- Cada receta es un mini curso con la forma del lomo curado: Bienvenida (video),
-- Antes de empezar (texto: ingredientes y proporción), Paso a paso (videos de
-- dos o tres pasos) y Terminar (texto de cocción y consejos, imagen final).
--
--   · Acceso `pago`, estado `publicado`: salen en Cursos maestros como PRO y
--     el contenido solo lo abre quien tiene suscripción (RLS, D12).
--   · ⚠️ LOS VIDEOS SON DE RELLENO, los del lomo curado en rueda, hasta que
--     Cristian grabe los de cada curso. El TEXTO sí es el definitivo: sale de
--     la receta, que ya está revisada (incluidas las dosis de sal de cura).
--   · Las preguntas para El Charcu (`ask`) son las mismas de la página de la
--     receta (`recipeDoubts`).
--   · `chorizo-santarrosano` ya existía en lista de espera con un guion de 14
--     lecciones sin grabar. Se rehace desde su receta (decisión de Cristian):
--     se borran sus módulos —sin progreso de nadie, estaba cerrado— y su lista
--     de espera se conserva.
--   · Categoría y técnicas: propuesta, igual que en la 0029.
--
-- Por slug y con `on conflict`: aguanta un `db push` sobre una base vacía y
-- volver a aplicarse no duplica nada.
-- ============================================================================

-- --------------------------------------------------------------------------

-- Chorizos Picantes de Jalapeño y Queso Cheddar

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$chorizos-picantes-jalapeno-queso-cheddar$t$, $t$Chorizos Picantes de Jalapeño y Queso Cheddar$t$, $t$Chorizos frescos de cerdo con jalapeño picado y cubos de cheddar, inspirados en el chorizo jalapeño-cheddar y el chorizo mexicano con queso.$t$, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$,
   'intermedio', 'pago', 'curso', 'publicado', 'libre', 60,
   'chorizos', '{embutir-amarrar}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Cerdo, jalapeño y cheddar en una mezcla fresca y contundente.$t$, 0,
   $t$Esta receta toma la idea clásica del chorizo jalapeño con queso y la aterriza en una versión de cerdo bien sazonada: carne de cerdo, grasa, jalapeño fresco y cheddar en cubos. El resultado es un chorizo fresco, pensado para embutir y cocinar, con mordida jugosa, picante limpio y pequeños bolsillos de queso derretido al dorarse.

«El truco está en mantener el queso frío y los cubos pequeños: así el cheddar perfuma la mordida sin desaparecer por completo.»$t$, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, $t$La receta de Chorizos Picantes de Jalapeño y Queso Cheddar está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$La base es 80/20 de carne y grasa, con jalapeño al 6% y cheddar al 12%.$t$, 0,
   $t$• Carne de cerdo (paleta o pierna): 800 g (80%)
• Grasa de cerdo: 200 g (20%)
• Jalapeño fresco, sin semillas y picado fino: 60 g (6%)
• Queso cheddar curado, en cubos fríos: 120 g (12%)
• Sal: 18 g (1.8%)
• Pimienta negra: 2 g (0.2%)
• Ajo fresco triturado: 5 g (0.5%)
• Cebolla en polvo: 3 g (0.3%)
• Comino molido: 2 g (0.2%)
• Orégano seco: 2 g (0.2%)
• Vinagre blanco: 25 ml (2.5%)

La base es 80/20 de carne y grasa, con jalapeño al 6% y cheddar al 12%. El queso suma riqueza y volumen, pero conviene mantenerlo en cubos fríos para que el embutido no se compacte de más.

Es un chorizo fresco: no lleva sal de cura. Se mezcla, se embute y se cocina pronto o se congela para uso posterior.

Usa cheddar bien frío, cortado en cubos pequeños, y jalapeños sin exceso de humedad. Eso ayuda a embutir sin que la mezcla se rompa.$t$, null, null, null, $t$Estoy haciendo Chorizos Picantes de Jalapeño y Queso Cheddar y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$El queso y el jalapeño$t$, $t$Enfría el queso cheddar y córtalo en cubos pequeños.$t$, 0,
   $t$1. Enfría el queso cheddar y córtalo en cubos pequeños.

2. Retira semillas y venas del jalapeño, pícalo fino y escurre el exceso de líquido.$t$, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, null),
  ((select id from m), 'video', $t$Especias y molienda$t$, $t$Mezcla sal, pimienta, ajo, cebolla en polvo, comino y orégano.$t$, 1,
   $t$3. Mezcla sal, pimienta, ajo, cebolla en polvo, comino y orégano.

4. Muele la carne de cerdo y la grasa con disco de 8 mm.$t$, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, null),
  ((select id from m), 'video', $t$Amasar, el cheddar y embutir$t$, $t$Incorpora especias, jalapeño y vinagre; amasa hasta que la mezcla quede pegajosa.$t$, 2,
   $t$5. Incorpora especias, jalapeño y vinagre; amasa hasta que la mezcla quede pegajosa.

6. Añade el cheddar al final, mezcla lo justo y embute en tripa natural de cerdo.$t$, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, null),
  ((select id from m), 'video', $t$Reposo y cocción$t$, $t$Reposa 8–12 horas en refrigeración y cocina antes de servir.$t$, 3,
   $t$7. Reposa 8–12 horas en refrigeración y cocina antes de servir.$t$, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, $t$Hice Chorizos Picantes de Jalapeño y Queso Cheddar. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$chorizos-picantes-jalapeno-queso-cheddar$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Dorado lento en rodajas o enteros, hasta que el cheddar empiece a asomar.$t$, 0,
   $t$Sartén
Dorado lento en rodajas o enteros, hasta que el cheddar empiece a asomar.

Parrilla
A fuego medio, girando con frecuencia para que el queso no escape.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Si el cheddar se calienta demasiado, se aplasta y se pierde en la masa.$t$, 1,
   $t$Queso frío
Si el cheddar se calienta demasiado, se aplasta y se pierde en la masa.

Jalapeño escurrido
Menos agua significa una textura más limpia y mejor embutido.

Cocción suave
Cocínalo a fuego medio para que el queso funda sin reventar la tripa.

Para no fallar
• Mantén todo muy frío antes de embutir.
• No picates demasiado fino el jalapeño para que conserve presencia.
• Usa cheddar curado para mejor sabor y estructura.
• Cocina a fuego medio para evitar que se rompa la tripa.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado es un chorizo fresco de cerdo con picor nítido, aroma de ajo y el contraste cremoso del cheddar.$t$, 2,
   null, null, null, $t$/recipes/chorizos-picantes-jalapeno-queso-cheddar.jpg$t$, $t$Te voy a mandar una foto de mi Chorizos Picantes de Jalapeño y Queso Cheddar (tripa de Natural de cerdo, cal. 32–36 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Chorizo Santarrosano

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$chorizo-santarrosano$t$, $t$Chorizo Santarrosano$t$, $t$Uno de los chorizos más tradicionales de Colombia — carne magra de cerdo y tocino en equilibrio, jugoso y perfecto para la parrilla.$t$, $t$/recipes/chorizo-santarrosano.jpg$t$,
   'para-empezar', 'pago', 'curso', 'publicado', 'libre', 70,
   'chorizos', '{embutir-amarrar}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$chorizo-santarrosano$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$chorizo-santarrosano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$El chorizo tradicional de Santa Rosa, jugoso y directo a la parrilla.$t$, 0,
   $t$🔥 Así se prepara uno de los chorizos más tradicionales de Colombia: el chorizo santarrosano. 🌭

Con una mezcla sencilla pero llena de sabor: 700 g de carne magra de cerdo y 300 g de tocino, logramos un chorizo jugoso, con excelente textura y perfecto para la parrilla.

«El santarrosano es la prueba de que la tradición no necesita complicarse: carne, tocino y las especias justas.»$t$, $t$/recipes/chorizo-santarrosano.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, $t$La receta de Chorizo Santarrosano está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$chorizo-santarrosano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$70% carne magra y 30% tocino es el balance santarrosano tradicional: suficiente grasa para lograr jugosidad…$t$, 0,
   $t$• Carne magra de cerdo: 700 g (70%)
• Tocino: 300 g (30%)
• Sal: 18 g (1.8%)
• Sal de cura (Prague Powder #1): 2.5 g (0.25%)
• Ajo fresco: 18 g (1.8%)
• Cebolla larga finamente picada: 25 g (2.5%)
• Pimienta negra molida: 2 g (0.2%)
• Comino molido: 2 g (0.2%)
• Paprika dulce: 2 g (0.2%)

70% carne magra y 30% tocino es el balance santarrosano tradicional: suficiente grasa para lograr jugosidad sin perder firmeza en la parrilla.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. Domínalo y escalas la receta a cualquier cantidad.

Condimentos para 1 kg de carne (700 g de carne magra de cerdo y 300 g de tocino).$t$, null, null, null, $t$Chorizo Santarrosano lleva Sal de cura (Prague Powder #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 5 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$chorizo-santarrosano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Mezclar y embutir$t$, $t$Mezclar la carne magra, el tocino, la sal, la sal de cura, el ajo, la cebolla larga y las especias hasta…$t$, 0,
   $t$1. Mezclar la carne magra, el tocino, la sal, la sal de cura, el ajo, la cebolla larga y las especias hasta integrar bien.

2. Embutir la mezcla en tripa natural.$t$, $t$/recipes/chorizo-santarrosano.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, null),
  ((select id from m), 'video', $t$Secar y reposar$t$, $t$Dejar secar una noche a temperatura ambiente, en un lugar fresco y protegido.$t$, 1,
   $t$3. Dejar secar una noche a temperatura ambiente, en un lugar fresco y protegido.

4. Reposar 24 horas más en refrigeración.$t$, $t$/recipes/chorizo-santarrosano.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, null),
  ((select id from m), 'video', $t$A la parrilla$t$, $t$Al día siguiente, asar, freír o cocinar.$t$, 2,
   $t$5. Al día siguiente, asar, freír o cocinar.$t$, $t$/recipes/chorizo-santarrosano.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, $t$Hice Chorizo Santarrosano. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$chorizo-santarrosano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$A fuego medio, girando con frecuencia hasta dorar parejo por todos los lados.$t$, 0,
   $t$Parrilla
A fuego medio, girando con frecuencia hasta dorar parejo por todos los lados.

Sartén o freír
Fuego medio-bajo hasta dorar y cocinar por completo; también se puede cocinar antes de dorar.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Pesa la sal de cura (Prague Powder #1) con exactitud: es clave para la seguridad y el color del embutido.$t$, 1,
   $t$Precisión con la sal de cura
Pesa la sal de cura (Prague Powder #1) con exactitud: es clave para la seguridad y el color del embutido.

Cebolla fresca, picada fina
Pícala lo más fino posible para que se integre sin dejar bolsas de humedad en la mezcla.

Respeta el doble reposo
El secado a temperatura ambiente y las 24 h en frío que siguen son las que asientan el sabor tradicional.

Para no fallar
• Mantén la carne y el tocino fríos durante todo el proceso.
• Pesa la sal de cura con precisión.
• Respeta el secado a temperatura ambiente antes de refrigerar.
• No pinches los chorizos durante la cocción.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$Al día siguiente tendrás unos chorizos listos para asar, freír o cocinar, con un sabor tradicional que nunca pasa de moda.$t$, 2,
   null, null, null, $t$/recipes/chorizo-santarrosano.jpg$t$, $t$Te voy a mandar una foto de mi Chorizo Santarrosano (tripa de Natural) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Salchichón Cervecero Colombiano

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$salchichon-cervecero-colombiano$t$, $t$Salchichón Cervecero Colombiano$t$, $t$El cervecero de toda la vida, hecho en casa — pollo, bondiola y panceta, especiado con ajo y comino y cocido hasta 75 °C para tajarlo frío.$t$, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$,
   'intermedio', 'pago', 'curso', 'publicado', 'libre', 80,
   'chorizos', '{embutir-amarrar,ahumado,coccion}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$salchichon-cervecero-colombiano$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$salchichon-cervecero-colombiano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Pollo, bondiola y panceta; especiado, cocido y tajado en frío.$t$, 0,
   $t$El salchichón cervecero es el embutido de la nevera colombiana: el de las arepas, el sándwich y la picada. Esta versión lo hace artesanal y le da un giro europeo — pechuga de pollo para la base magra, bondiola de cerdo para el sabor y panceta para la grasa que lo mantiene jugoso. Ajo, comino, pimienta y paprika le dan el perfil especiado que reconoces en cada tajada. Se embute en tripa de colágeno, se cocina u ahúma hasta los 75 °C internos y se enfría bien antes de cortar. Nada de humo frío: aquí se termina cocido.

«El cervecero no se cura: se cocina. Por eso la clave está en la temperatura interna, no en el calendario.»$t$, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, $t$La receta de Salchichón Cervecero Colombiano está para 1 kg de carne. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$salchichon-cervecero-colombiano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$40% pollo, 30% bondiola y 30% panceta: el pollo aporta el magro, la bondiola el sabor y la panceta la grasa.$t$, 0,
   $t$• Pechuga de pollo: 400 g (40%)
• Bondiola de cerdo: 300 g (30%)
• Panceta de cerdo sin piel: 300 g (30%)
• Sal: 16 g (1.6%)
• Sal de cura #1 (opcional, recomendada si ahúmas): 2.5 g (0.25%)
• Azúcar: 2 g (0.2%)
• Ajo: 4 g (0.4%)
• Comino: 1 g (0.1%)
• Pimienta: 2 g (0.2%)
• Paprika: 2 g (0.2%)
• Agua helada: 70 ml (7%)

40% pollo, 30% bondiola y 30% panceta: el pollo aporta el magro, la bondiola el sabor y la panceta la grasa. Si bajas la panceta, el salchichón queda seco y se desmorona al tajarlo.

El porcentaje junto a cada ingrediente es su peso sobre el kilo de carne. Por kilo: sal 16 g, azúcar 2 g, ajo 4 g, comino 1 g, pimienta 2 g, paprika 2 g y 70 ml de agua helada. El agua no es relleno: es lo que permite formar la emulsión y lo que se pierde en parte durante la cocción.

Si usas sal de cura, la cantidad depende de la concentración de nitrito del producto: no uses la misma dosis para sales de cura distintas. Con la Prague Powder #1 estándar (6,25% de nitrito), 2,5 g por kilo es el estándar y también el techo — y baja entonces la sal común a 14 g para no pasarte de sal. Es la #1, no la #2: esto se cocina y se come en días, no se cura durante semanas.$t$, null, null, null, $t$Salchichón Cervecero Colombiano lleva Sal de cura #1 (opcional, recomendada si ahúmas). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 8 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$salchichon-cervecero-colombiano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Los secos y el frío$t$, $t$Mezcla los secos aparte: sal, sal de cura si la usas, azúcar, ajo, comino, pimienta y paprika.$t$, 0,
   $t$1. Mezcla los secos aparte: sal, sal de cura si la usas, azúcar, ajo, comino, pimienta y paprika. Repartirlos bien es lo único que garantiza una salazón pareja.

2. Corta el pollo, la bondiola y la panceta en cubos y déjalos muy fríos (0–2 °C).$t$, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, null),
  ((select id from m), 'video', $t$Moler y formar la emulsión$t$, $t$Muele con disco de 4–6 mm, manteniendo la carne casi congelada.$t$, 1,
   $t$3. Muele con disco de 4–6 mm, manteniendo la carne casi congelada.

4. Agrega los secos y el agua helada; amasa hasta que la masa quede pegajosa y ligada — esa es la emulsión.$t$, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, null),
  ((select id from m), 'video', $t$La temperatura de la masa y el embutido$t$, $t$Vigila la temperatura de la masa: no debe pasar de 8–10 °C.$t$, 2,
   $t$5. Vigila la temperatura de la masa: no debe pasar de 8–10 °C. Si se calienta, al frío otra vez.

6. Embute en tripa de colágeno (45–60 mm) bien apretado, sin bolsas de aire, y ata los extremos.$t$, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$, $t$2fa024cc-a711-468c-b42a-e370699524bd$t$, null, null),
  ((select id from m), 'video', $t$Cocción a 75 °C y enfriado$t$, $t$Cocina u ahúma entre 80 y 150 °C hasta que el centro marque 75 °C.$t$, 3,
   $t$7. Cocina u ahúma entre 80 y 150 °C hasta que el centro marque 75 °C.

8. Enfría rápido y refrigera varias horas antes de cortar: frío, taja firme y bonito.$t$, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, $t$Hice Salchichón Cervecero Colombiano. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$salchichon-cervecero-colombiano$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Entre 80 y 150 °C, humo suave, hasta los 75 °C en el centro.$t$, 0,
   $t$Ahumador
Entre 80 y 150 °C, humo suave, hasta los 75 °C en el centro. Aquí sí lleva sal de cura #1.

Horno
Entre 80 y 150 °C hasta los 75 °C internos; una bandeja con agua ayuda a que no se reseque.

A la sartén, ya frío
Tajadas gruesas doradas un minuto por lado, para arepa o sándwich.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Pollo y panceta pierden la emulsión con el calor.$t$, 1,
   $t$Todo muy frío
Pollo y panceta pierden la emulsión con el calor. Trabaja casi congelado y no alargues el amasado.

El termómetro manda
No lo saques por tiempo: sácalo a 75 °C internos. Menos es inseguro; más lo reseca.

Sal de cura solo si ahúmas
Si lo vas a ahumar a baja temperatura, la #1 es lo correcto. Si lo horneas y lo comes en pocos días, puedes ir sin ella — pero nunca con la #2.

Frío antes del cuchillo
Tajarlo tibio lo desarma. Refrigéralo entero y córtalo al día siguiente.

Para no fallar
• Mantén la masa por debajo de 8–10 °C durante todo el proceso.
• Embute apretado: las bolsas de aire dejan huecos al tajar.
• Cocina hasta 75 °C internos, medidos con termómetro.
• Enfría y refrigera antes de cortar.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un salchichón cervecero casero, jugoso y aromático, de corte compacto y parejo.$t$, 2,
   null, null, null, $t$/recipes/salchichon-cervecero-colombiano.jpg$t$, $t$Te voy a mandar una foto de mi Salchichón Cervecero Colombiano (tripa de Colágeno, cal. 45–60 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Salami de Res

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$salami-de-res$t$, $t$Salami de Res$t$, $t$Fermentado y curado en seco — 100% res, con cultivo iniciador, dextrosa y una merma del 35% que lo cambia todo.$t$, $t$/recipes/salami-de-res.jpg$t$,
   'avanzado', 'pago', 'curso', 'publicado', 'libre', 90,
   'chorizos', '{embutir-amarrar,curado}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$salami-de-res$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$salami-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Estilo europeo, con lo que se consigue en Colombia.$t$, 0,
   $t$El salami de res es el curado más exigente de esta casa, y también el que más enseña. No basta con salar y colgar: aquí entra un cultivo iniciador que se come la dextrosa y acidifica la masa, bajando el pH hasta 5,3 o menos. Esa acidez es la primera barrera de seguridad; la segunda es la sal de cura #2, y la tercera es la merma. Se hace 100% res —brisket con su grasa, o magro más grasa de res— y eso cambia el resultado: la grasa de res funde más alto que la de cerdo, es más firme y de sabor más marcado. El salami sale menos untuoso y más profundo que uno italiano de cerdo.

«En un salami, la seguridad no la da un solo ingrediente: la dan tres barreras juntas — la acidez, el nitrito y la merma. Saltarse una es saltárselas todas.»$t$, $t$/recipes/salami-de-res.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, $t$La receta de Salami de Res está para 1 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$salami-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$80% magro y 20% grasa.$t$, 0,
   $t$• Carne de res magra (bola, chuck o pulpa): 800 g (80%)
• Grasa de res (brisket o cobertura): 200 g (20%)
• Sal: 28 g (2.8%)
• Sal de cura #2 (nitrificante de curado largo): 2.5 g (0.25%)
• Dextrosa (alimento del cultivo): 5 g (0.5%)
• Cultivo iniciador de fermentación lenta (T-SPX) — guardado en congelador: 0.25 g (0.025%)
• Pimienta negra molida: 3 g (0.3%)
• Pimienta negra en grano: 3 g (0.3%)
• Ajo en polvo: 2 g (0.2%)
• Vino tinto seco: 20 ml (2%)
• Agua sin cloro (para hidratar el cultivo): 20 ml (2%)

80% magro y 20% grasa. Con menos grasa el salami queda seco y quebradizo; con más, la grasa de res —que funde alto— se siente cerosa al paladar. Si consigues brisket con su grasa, sale la proporción sola.

El porcentaje junto a cada ingrediente es su peso sobre el total de carne y grasa. La sal sube a 2.8% —más que en un curado de cerdo— porque la res lo pide y porque durante la fermentación la sal también frena lo que no queremos. La sal de cura al 0.25% es el estándar seguro y el techo: nunca más.

Aquí la sal de cura NO es opcional ni negociable: es carne PICADA en curado LARGO. Va la #2, que además de nitrito lleva nitrato y lo va soltando durante semanas. Y el cultivo iniciador no es un lujo de purista: hace DOS trabajos. Acidifica —sin él no baja el pH, y sin acidez falta una de las tres barreras— y además es quien convierte el nitrato de la #2 en nitrito. Sin cultivo, la #2 se queda a medias: por eso estos dos ingredientes van juntos y no se sustituyen el uno al otro.$t$, null, null, null, $t$Salami de Res lleva Sal de cura #2 (nitrificante de curado largo). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 10 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$salami-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$El cultivo y la molienda en frío$t$, $t$Saca el cultivo del CONGELADOR —ahí es donde vive, a −17 °C o menos— y hidrátalo en 20 ml de agua SIN cloro,…$t$, 0,
   $t$1. Saca el cultivo del CONGELADOR —ahí es donde vive, a −17 °C o menos— y hidrátalo en 20 ml de agua SIN cloro, 20–30 min. Dos formas de matarlo antes de empezar: el cloro del agua de la llave, y tenerlo guardado en un cajón de la cocina. Son bacterias vivas: a temperatura ambiente se van muriendo, y un cultivo muerto no avisa.

2. Corta magro y grasa en cubos y llévalos al congelador hasta que estén a −2/0 °C, casi cristalizados.

3. Muele con disco de 6–8 mm. Si la grasa se empieza a untar, para y vuelve a enfriar.$t$, $t$/recipes/salami-de-res.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, null),
  ((select id from m), 'video', $t$Los secos, el cultivo y el embutido$t$, $t$Mezcla los secos aparte: sal, sal de cura #2, dextrosa, pimientas y ajo.$t$, 1,
   $t$4. Mezcla los secos aparte: sal, sal de cura #2, dextrosa, pimientas y ajo. Pesa en balanza de gramos, nunca con cucharas. ⚠️ El cultivo va aparte y necesita OTRA balanza: son 0,25 g, y una balanza de gramos no los distingue de cero. Hace falta una de 0,01 g — quedarse corto de cultivo es lo que hace que el pH no baje.

5. Integra los secos, el vino y el cultivo hidratado. Amasa hasta que la masa quede pegajosa y ligada.

6. Embute firme en tripa de 55–60 mm, sin bolsas de aire. Pincha las que veas a contraluz.$t$, $t$/recipes/salami-de-res.jpg$t$, $t$2fa024cc-a711-468c-b42a-e370699524bd$t$, null, null),
  ((select id from m), 'video', $t$Pesar y fermentar hasta pH 5,3$t$, $t$PESA cada pieza y apunta el peso.$t$, 2,
   $t$7. PESA cada pieza y apunta el peso. Sin ese número no hay forma de saber cuándo está listo.

8. Fermenta a 18–24 °C y 85–90% de humedad HASTA QUE EL pH BAJE A 5,3 O MENOS. Manda el pH, no el reloj: el T-SPX es un cultivo lento y suele tardar entre 48 y 72 horas, no un día. Si a las 24 h no ha bajado, no ha fallado nada — todavía va. Lo que dice el sobre de TU cultivo manda sobre este número.

9. ⚠️ NO PASES A CURADO SIN HABER LLEGADO A pH 5,3. Si a las 72 h sigue por encima, el lote se descarta: sin acidez falta una de las tres barreras, y eso no lo arreglan semanas de bodega. Colgar un salami que no acidificó es curar el problema dentro. Con el pH ya abajo, pasa a 12–14 °C y 75–80% de humedad, 4–10 semanas.$t$, $t$/recipes/salami-de-res.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, null),
  ((select id from m), 'video', $t$Curado: manda el 35 %$t$, $t$Está listo cuando perdió el 35% de su peso inicial.$t$, 3,
   $t$10. Está listo cuando perdió el 35% de su peso inicial. Se pesa; no se cuentan días.$t$, $t$/recipes/salami-de-res.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, $t$Estoy curando mi Salami de Res (la receta dice 4–10 semanas, hasta 35% de merma). ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$salami-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Curado, cortado casi transparente.$t$, 0,
   $t$En lonchas finas
Curado, cortado casi transparente. Es como se come: en frío, sin cocinar.

En tabla
Con queso curado y pan. La res pide un tinto con cuerpo.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$La acidez es la primera de las tres barreras, y es la única que no se ve, no se huele y no se adivina.$t$, 1,
   $t$Sin medidor de pH, esta receta no se hace
La acidez es la primera de las tres barreras, y es la única que no se ve, no se huele y no se adivina. No es un accesorio recomendable: es el instrumento que te dice si el lote es seguro. Si no tienes medidor, haz otra receta de esta casa y deja el salami para cuando lo tengas.

La grasa de res no es la de cerdo
Funde más alto, es más firme, tira a amarilla y su sabor es fuerte. Es lo que hace distinto a este salami. Si quieres algo más suave y untuoso, cambia la grasa por tocino de cerdo.

Se pesa, no se cuenta
35% de merma. En las primeras semanas solo pierde un 10–20%; el resto llega despacio. Un calendario miente, la balanza no.

Moho blanco sí, el resto no
El blanco aterciopelado y parejo es noble y se limpia. Verde, negro, gris peludo, viscoso o con mal olor: se descarta la pieza entera.

Para no fallar
• No omitas la sal de cura #2: es carne picada en curado largo.
• Guarda el cultivo en el congelador, no en un cajón: son bacterias vivas.
• Hidrata el cultivo en agua sin cloro, o no fermenta.
• Pesa el cultivo en balanza de 0,01 g: 0,25 g no se pesan en una de gramos.
• Pesa la pieza al embutir y apunta el número.
• Fermenta hasta pH 5,3 o menos, tarde lo que tarde. Si a las 72 h no bajó, se descarta.
• Da el salami por terminado por merma (35%), nunca por calendario.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: un salami firme, de corte marmoleado, ligeramente ácido y de sabor a res profundo.$t$, 2,
   null, null, null, $t$/recipes/salami-de-res.jpg$t$, $t$Te voy a mandar una foto de mi Salami de Res (tripa de Colágeno o natural de res, cal. 55–60 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Kielbasa Polaca de Cerdo y Res

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$kielbasa-polaca$t$, $t$Kielbasa Polaca de Cerdo y Res$t$, $t$La kielbasa auténtica — cerdo y res, ajo, pimienta y mejorana. Sin paprika, sin mostaza, sin mezclas de especias innecesarias: curada, ahumada y cocida como en Polonia.$t$, $t$/recipes/kielbasa-polaca.jpg$t$,
   'intermedio', 'pago', 'curso', 'publicado', 'libre', 100,
   'chorizos', '{embutir-amarrar,curado,ahumado,coccion}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$kielbasa-polaca$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$kielbasa-polaca$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Cerdo y res con ajo, pimienta y mejorana: el perfil clásico polaco.$t$, 0,
   $t$La kielbasa polaca tradicional no lleva paprika, ni mostaza, ni coriandro, ni chile. Lleva cuatro cosas: sal, sal de cura, ajo y pimienta — y la mejorana, que es la firma aromática que distingue a la polaca de cualquier otra salchicha ahumada de Europa. Todo lo demás sobra. Esta fórmula vuelve a esa base: 70% cerdo y 30% res, un curado en frío de dos o tres días antes de moler, un amasado vigoroso hasta que la masa quede pegajosa, y un ahumado progresivo hasta el dorado característico. El resultado es una salchicha en herradura, firme y jugosa, que sabe a carne, ajo y humo — exactamente lo que debe saber.

«La verdadera kielbasa polaca: cerdo y res, ajo, pimienta y mejorana. Sin mezclas de especias innecesarias.»$t$, $t$/recipes/kielbasa-polaca.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, $t$La receta de Kielbasa Polaca de Cerdo y Res está para 1 kg de masa. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$kielbasa-polaca$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$70/30 cerdo y res: el cerdo aporta la grasa —sin ella la res deja la masa seca— y la res aporta cuerpo y un…$t$, 0,
   $t$• Carne de cerdo (paleta, con su grasa): 700 g (70%)
• Carne de res (magra): 300 g (30%)
• Agua o hielo triturado: 80–100 ml (8–10%)
• Sal: 18 g (1.8%)
• Sal de cura #1 (Prague Powder #1): 2.5 g (0.25%)
• Ajo fresco machacado: 2.5–3 g (0.25–0.3%)
• Pimienta negra molida: 2 g (0.2%)
• Mejorana seca: 0.5–1 g (0.05–0.1%)

70/30 cerdo y res: el cerdo aporta la grasa —sin ella la res deja la masa seca— y la res aporta cuerpo y un color más intenso. El agua o hielo al 8–10% no es relleno: es lo que permite que el amasado extraiga la proteína y la masa ligue de verdad.

El porcentaje es el peso sobre el total de carne. Valores por kilo: cerdo 700 g, res 300 g, sal 18 g, sal de cura #1 2,5 g, ajo fresco 2,5–3 g, pimienta negra 2 g, mejorana 0,5–1 g, agua o hielo 80–100 ml. Los 2,5 g de Prague Powder #1 por kilo equivalen a 156 ppm de nitrito de entrada, el nivel estándar para un embutido cocido.

La sal de cura Prague Powder #1 es obligatoria: esta salchicha pasa horas en el ahumador a temperaturas bajas antes de cocerse, y esa franja es justo donde el nitrito hace falta. A 2,5 g por kilo aporta el nivel estándar de nitrito de entrada de un embutido cocido, además del color rosado y el sabor curado. No la sustituyas ni la reduzcas.$t$, null, null, null, $t$Kielbasa Polaca de Cerdo y Res lleva Sal de cura #1 (Prague Powder #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 10 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$kielbasa-polaca$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Frío, sal de cura y molienda$t$, $t$Mantén las carnes muy frías, casi congeladas, y córtalas en cubos.$t$, 0,
   $t$1. Mantén las carnes muy frías, casi congeladas, y córtalas en cubos.

2. Mezcla la carne con la sal y la sal de cura, y deja reposar 2 a 3 días en refrigeración a 0–4 °C.

3. Muele el cerdo y la res con molienda media, disco de 8 mm.$t$, $t$/recipes/kielbasa-polaca.jpg$t$, $t$2fa024cc-a711-468c-b42a-e370699524bd$t$, null, null),
  ((select id from m), 'video', $t$Especias, amasado y embutido$t$, $t$Agrega el ajo, la pimienta, la mejorana y el agua o hielo triturado.$t$, 1,
   $t$4. Agrega el ajo, la pimienta, la mejorana y el agua o hielo triturado.

5. Amasa vigorosamente hasta que la masa quede pegajosa y bien ligada — es el paso que decide la textura final.

6. Embute en tripa natural de cerdo de 30–32 mm, sin dejar bolsas de aire.$t$, $t$/recipes/kielbasa-polaca.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, null),
  ((select id from m), 'video', $t$Secar, ahumar y cocinar$t$, $t$Forma las herraduras o los eslabones y deja que la superficie se seque al tacto antes del ahumado.$t$, 2,
   $t$7. Forma las herraduras o los eslabones y deja que la superficie se seque al tacto antes del ahumado.

8. Ahúma progresivamente, subiendo la temperatura poco a poco, hasta obtener el color dorado característico.

9. Cocina hasta que el centro alcance 68–70 °C; para mayor margen doméstico, llévala a 71 °C.$t$, $t$/recipes/kielbasa-polaca.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, null),
  ((select id from m), 'video', $t$Enfriar y guardar$t$, $t$Enfría rápidamente con agua fría, seca la superficie y refrigera.$t$, 3,
   $t$10. Enfría rápidamente con agua fría, seca la superficie y refrigera.$t$, $t$/recipes/kielbasa-polaca.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, $t$Estoy curando mi Kielbasa Polaca de Cerdo y Res (la receta dice 2–3 días en frío (0–4 °C)). ¿Qué debería ver, tocar y oler estos días, qué señal quiere decir que hay que tirarlo, y cómo sé que ya está?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$kielbasa-polaca$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$El método propio de la receta: humo progresivo hasta el dorado y cocción hasta 68–70 °C internos.$t$, 0,
   $t$Ahumada y cocida
El método propio de la receta: humo progresivo hasta el dorado y cocción hasta 68–70 °C internos. Queda lista para comer.

A la parrilla
Ya cocida, solo dorar unos minutos para reforzar el tostado antes de servir.

En bigos o con chucrut
El uso clásico polaco: en guiso con col fermentada, donde la mejorana y el ajo se lucen.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Si la tripa está húmeda, el humo se deposita manchado y el color sale disparejo.$t$, 1,
   $t$La superficie seca antes del humo
Si la tripa está húmeda, el humo se deposita manchado y el color sale disparejo. Deja que la superficie se seque al tacto — es el paso que más se salta la gente.

Ajo fresco, no en polvo
En la kielbasa polaca el ajo se machaca fresco. El polvo da un sabor plano y no es lo que buscas aquí.

Sube el humo por escalones
Ahumar progresivamente —no de golpe a temperatura alta— evita que la grasa se funda antes de tiempo y que la salchicha quede arrugada y seca.

Menos es más
La tentación de añadir paprika o coriandro es real. No lo hagas: la kielbasa polaca se define tanto por lo que lleva como por lo que no lleva.

Para no fallar
• No omitas la sal de cura #1: el ahumado a baja temperatura la hace obligatoria.
• Respeta el curado de 2 a 3 días antes de moler — ahí se asienta el color y el sabor.
• Mantén la carne y la masa por debajo de 4 °C durante todo el proceso.
• Amasa hasta que la masa se pegue a la mano: si no liga, la salchicha queda desmoronada.
• Cocina hasta 68–70 °C internos, verificados con termómetro; 71 °C si quieres margen.
• Enfría rápido con agua fría y refrigera de inmediato.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: una herradura de color dorado ahumado, firme al tacto y rosada al corte, con el grano de la molienda de 8 mm bien visible.$t$, 2,
   null, null, null, $t$/recipes/kielbasa-polaca.jpg$t$, $t$Te voy a mandar una foto de mi Kielbasa Polaca de Cerdo y Res (tripa de Natural de cerdo, cal. 30–32 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Kielbasa de Mozzarella y Jalapeño

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$kielbasa-de-mozzarella-y-jalapeno$t$, $t$Kielbasa de Mozzarella y Jalapeño$t$, $t$Kielbasa ahumada de textura artesanal — 70% picada a cuchillo — con cubos de mozzarella y jalapeño encurtido, trabajada en dos días.$t$, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$,
   'intermedio', 'pago', 'curso', 'publicado', 'libre', 110,
   'chorizos', '{embutir-amarrar,ahumado,coccion}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$kielbasa-de-mozzarella-y-jalapeno$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$kielbasa-de-mozzarella-y-jalapeno$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Picada a cuchillo, con queso y jalapeño, ahumada en dos días.$t$, 0,
   $t$Una kielbasa de estructura, no de emulsión: el 70% de la carne va picada a cuchillo y solo el 30% molida fina, que es la que liga y sostiene. Se trabaja en dos días — el primero solo carne, condimentos y agua, amasando hasta la liga y ocho horas de reposo en frío; el segundo se incorporan la mozzarella en cubos y el jalapeño encurtido bien escurrido, con la mano suave, para que lleguen enteros al corte. Después, secado de la tripa y ahumado progresivo. El queso funde dentro y el jalapeño corta la grasa; al tajarla se ven los cubos blancos y el verde repartidos en una masa de grano grueso.

«El queso y el jalapeño no son adorno: son agua y grasa dentro de una tripa cerrada. Por eso aquí manda la presión, no la prisa.»$t$, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$, $t$2fa024cc-a711-468c-b42a-e370699524bd$t$, null, $t$La receta de Kielbasa de Mozzarella y Jalapeño está para 2 kg de carne. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$kielbasa-de-mozzarella-y-jalapeno$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$70% picada a cuchillo y 30% molida fina: esa es la receta.$t$, 0,
   $t$• Carne de cerdo picada a cuchillo: 1400 g (70%)
• Carne de cerdo molida fina: 600 g (30%)
• Sal: 30 g (1.5%)
• Sal de cura #1 (Cure #1): 5 g (0.25%)
• Azúcar: 3.3 g (0.17%)
• Ajo en polvo: 2.7 g (0.14%)
• Pimienta negra: 1.75 g (0.09%)
• Coriandro molido: 1 g (0.05%)
• Paprika dulce: 1 g (0.05%)
• Nuez moscada: 0.2 g (0.01%)
• Agua helada: 100 ml (5%)
• Mozzarella en cubos de 5–7 mm, muy fría: 120 g (6%)
• Jalapeño encurtido, escurrido, seco y picado: 140 g (7%)

70% picada a cuchillo y 30% molida fina: esa es la receta. El grano grueso da la mordida artesanal y el molido fino la liga que sostiene todo. Si subes el molido fino se va hacia la emulsión y pierde el carácter; si lo bajas, la salchicha se desarma al tajarla.

El porcentaje es el peso sobre los 2 kg de carne. Valores por kilo: sal 15 g, sal de cura #1 2,5 g, azúcar 1,65 g, ajo en polvo 1,35 g, pimienta negra 0,88 g, coriandro 0,5 g, paprika 0,5 g, nuez moscada 0,1 g, agua helada 50 ml, mozzarella 60 g y jalapeño 70 g. Los 2,5 g de Prague Powder #1 por kilo equivalen a 156 ppm de nitrito de entrada, el nivel estándar para un embutido cocido — y también el techo. Si tu sal de cura tiene otra concentración de nitrito, la dosis no es la misma.

La mozzarella y el jalapeño entran el segundo día, nunca en el amasado del primero: si se amasan con la masa se deshacen y sueltan su agua dentro. El jalapeño hay que escurrirlo y secarlo de verdad — el líquido del encurtido es lo que después revienta la tripa.$t$, null, null, null, $t$Kielbasa de Mozzarella y Jalapeño lleva Sal de cura #1 (Cure #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 13 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$kielbasa-de-mozzarella-y-jalapeno$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Día 1: dos texturas y la liga$t$, $t$Día 1 — Pica 1400 g de cerdo a cuchillo y muele finos los 600 g restantes.$t$, 0,
   $t$1. Día 1 — Pica 1400 g de cerdo a cuchillo y muele finos los 600 g restantes. Todo muy frío.

2. Día 1 — Junta las dos texturas de carne en un bol.

3. Día 1 — Agrega la sal, el Cure #1, el ajo en polvo, la pimienta negra, el coriandro, la nuez moscada, la paprika dulce, el azúcar y los 100 ml de agua helada.

4. Día 1 — Amasa hasta desarrollar la liga: la masa tiene que quedar pegajosa y cohesiva, agarrándose a la mano. Aquí no se escatima.$t$, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, null),
  ((select id from m), 'video', $t$Día 2: el queso y el jalapeño$t$, $t$Día 1 — Cubre y refrigera 8 horas.$t$, 1,
   $t$5. Día 1 — Cubre y refrigera 8 horas.

6. Día 2 — Saca la masa y trabájala muy fría; si se ha templado, al congelador un rato antes de seguir.

7. Día 2 — Añade los 120 g de mozzarella en cubos de 5–7 mm y los 140 g de jalapeño encurtido, muy bien escurrido y secado.

8. Día 2 — Mezcla suavemente, solo hasta repartir: los cubos de queso y el jalapeño tienen que llegar enteros, sin romperse.$t$, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, null),
  ((select id from m), 'video', $t$Embutir, secar y ahumar$t$, $t$Día 2 — Embute sin sobrellenar la tripa.$t$, 2,
   $t$9. Día 2 — Embute sin sobrellenar la tripa. Deja margen: el queso fundido y el vapor van a empujar desde dentro.

10. Día 2 — Deja secar la superficie de la tripa hasta que esté seca al tacto, antes de meter humo.

11. Ahúma y cocina de forma progresiva, subiendo la temperatura por escalones y sin golpes de calor.

12. Controla con sonda en el centro de la pieza más gruesa y cocina hasta 72 °C internos, parejos en toda la salchicha.$t$, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, null),
  ((select id from m), 'video', $t$Enfriar y cortar$t$, $t$Enfría rápido, seca la superficie y refrigera antes de cortar.$t$, 3,
   $t$13. Enfría rápido, seca la superficie y refrigera antes de cortar.$t$, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, $t$Hice Kielbasa de Mozzarella y Jalapeño (con ahumado: Progresivo, sin golpes de calor). ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$kielbasa-de-mozzarella-y-jalapeno$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$El método de la receta: humo progresivo, sin temperaturas excesivas, hasta 72 °C en el centro.$t$, 0,
   $t$Ahumada y cocida
El método de la receta: humo progresivo, sin temperaturas excesivas, hasta 72 °C en el centro. Queda lista para comer.

A la parrilla
Ya cocida, solo dorar unos minutos a fuego medio. Fuego fuerte revienta la tripa por el queso.

A la sartén, ya fría
Tajadas gruesas doradas un minuto por lado; el queso se tuesta en el corte.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Escúrrelo y sécalo con papel hasta que no suelte nada.$t$, 1,
   $t$El jalapeño, seco de verdad
Escúrrelo y sécalo con papel hasta que no suelte nada. El líquido del encurtido se convierte en vapor dentro de la tripa, y ese vapor es presión.

No sobrellenes la tripa
Es el error que revienta estas salchichas. La mozzarella funde y ocupa más, el agua se evapora y no hay a dónde ir. Embute con margen.

Calor progresivo, nunca de golpe
Una temperatura alta de entrada funde el queso antes de que la masa cuaje: la tripa cede por el punto más lleno. Sube por escalones.

El queso y el jalapeño, el Día 2
El amasado del Día 1 es solo carne, condimentos y agua. Si metes las inclusiones ahí, se deshacen y engrasan la masa.

La superficie seca antes del humo
Con la tripa húmeda el humo se deposita manchado y el color sale disparejo.

Para no fallar
• Escurre y seca el jalapeño encurtido antes de incorporarlo.
• Mantén la masa muy fría los dos días.
• Embute sin sobrellenar y deja secar la tripa antes del humo.
• Sube la temperatura por escalones y mide con sonda hasta 72 °C internos.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: una kielbasa de grano grueso, jugosa y picante, con los cubos de mozzarella fundidos y el jalapeño repartido a la vista en cada tajada.$t$, 2,
   null, null, null, $t$/recipes/kielbasa-de-mozzarella-y-jalapeno.jpg$t$, $t$Te voy a mandar una foto de mi Kielbasa de Mozzarella y Jalapeño (tripa de Natural de cerdo, cal. 32–38 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Kielbasa de Pollo Ahumada

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$kielbasa-de-pollo$t$, $t$Kielbasa de Pollo Ahumada$t$, $t$Salchicha ahumada de pollo estilo alemán — pechuga y cerdo curados, ahumado lento en barril, jugosa y delicada.$t$, $t$/recipes/kielbasa-de-pollo.jpg$t$,
   'avanzado', 'pago', 'curso', 'publicado', 'libre', 120,
   'chorizos', '{embutir-amarrar,ahumado,coccion}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$kielbasa-de-pollo$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$kielbasa-de-pollo$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Pollo curado y ahumado, estilo salchicha blanca.$t$, 0,
   $t$La kielbasa de pollo es una salchicha ahumada, ligera y jugosa, inspirada en la salchicha blanca alemana. La pechuga de pollo, con un apoyo de cerdo para la jugosidad, se cura tres días antes de especiarse y ahumarse lento en barril. El resultado es un embutido de sabor delicado, textura tersa y un ahumado suave que no tapa la carne. Una alternativa magra a los embutidos de cerdo, sin renunciar al oficio.

«El pollo pide respeto: poca grasa y mucho cuidado. El curado y el frío hacen que quede jugoso, no seco.»$t$, $t$/recipes/kielbasa-de-pollo.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, $t$La receta de Kielbasa de Pollo Ahumada está para 2 kg. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$kielbasa-de-pollo$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$85% pechuga de pollo y 15% cerdo: el cerdo aporta la grasa que al pollo le falta, clave para que no quede…$t$, 0,
   $t$• Pechuga de pollo: 1700 g (85%)
• Carne de cerdo: 300 g (15%)
• Sal: 33 g (1.65%)
• Sal de cura #1 (Prague Powder #1): 5 g (0.25%)
• Leche en polvo: 40 g (2%)
• Ajo en polvo: 3.6 g (0.18%)
• Pimienta blanca: 3.6 g (0.18%)
• Coriandro molido: 2.4 g (0.12%)
• Azúcar: 3.6 g (0.18%)
• Nuez moscada: 0.6 g (0.03%)

85% pechuga de pollo y 15% cerdo: el cerdo aporta la grasa que al pollo le falta, clave para que no quede seco. La leche en polvo ayuda a retener humedad y ligar la emulsión.

El porcentaje es el peso sobre el total de carne. Valores por kilo: sal 16,5 g, sal de cura 2,5 g, ajo 1,8 g, pimienta blanca 1,8 g, coriandro 1,2 g, nuez moscada 0,3 g, leche en polvo 20 g, azúcar 1,8 g.

Este embutido se cura 3 días antes de especiar. La sal de cura Prague Powder #1 es obligatoria para un ahumado cocido a baja temperatura.$t$, null, null, null, $t$Kielbasa de Pollo Ahumada lleva Sal de cura #1 (Prague Powder #1). ¿Cuánta va exactamente para la carne que tengo, qué pasa si me paso, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$kielbasa-de-pollo$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Curar tres días y moler$t$, $t$Cura la pechuga y el cerdo 3 días en frío (0–4 °C) con la sal y la sal de cura #1.$t$, 0,
   $t$1. Cura la pechuga y el cerdo 3 días en frío (0–4 °C) con la sal y la sal de cura #1.

2. Procesa la carne curada: muele con disco de 4–6 mm, bien fría.$t$, $t$/recipes/kielbasa-de-pollo.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, null),
  ((select id from m), 'video', $t$Especias y emulsión en frío$t$, $t$Agrega las especias, la leche en polvo y el azúcar; amasa hasta una emulsión fina y pegajosa.$t$, 1,
   $t$3. Agrega las especias, la leche en polvo y el azúcar; amasa hasta una emulsión fina y pegajosa.

4. Mantén la masa entre 0 y 4 °C durante todo el amasado.$t$, $t$/recipes/kielbasa-de-pollo.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, null),
  ((select id from m), 'video', $t$Embutir y reposar$t$, $t$Embute en tripa natural de cerdo (32–36 mm) y forma las clásicas herraduras.$t$, 2,
   $t$5. Embute en tripa natural de cerdo (32–36 mm) y forma las clásicas herraduras.

6. Deja reposar toda la noche en frío para asentar el sabor.$t$, $t$/recipes/kielbasa-de-pollo.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, null),
  ((select id from m), 'video', $t$Ahumado lento hasta 75 °C$t$, $t$Ahúma lento en barril a baja temperatura hasta cocer (73–75 °C internos).$t$, 3,
   $t$7. Ahúma lento en barril a baja temperatura hasta cocer (73–75 °C internos).$t$, $t$/recipes/kielbasa-de-pollo.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, $t$Hice Kielbasa de Pollo Ahumada (con ahumado: Lento, en barril). ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$kielbasa-de-pollo$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$A baja temperatura hasta alcanzar 73–75 °C en el centro; queda cocida y lista para comer.$t$, 0,
   $t$Ahumado en barril
A baja temperatura hasta alcanzar 73–75 °C en el centro; queda cocida y lista para comer.

A la parrilla
Ya ahumada, solo dorar unos minutos para reforzar el sabor antes de servir.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$El pollo es magro; si la masa se calienta, pierde emulsión y queda seca.$t$, 1,
   $t$Todo muy frío
El pollo es magro; si la masa se calienta, pierde emulsión y queda seca. Trabaja casi congelada.

Sal de cura #1
Obligatoria en ahumados cocidos a baja temperatura: previene el riesgo de botulismo.

Ahumado suave
El pollo no necesita mucho humo; un ahumado lento y ligero realza sin tapar la carne.

Para no fallar
• Cura 3 días antes de especiar.
• No omitas la sal de cura #1 en un ahumado cocido.
• Mantén la carne fría para conservar la emulsión.
• Cocina hasta 73–75 °C internos para un consumo seguro.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: una kielbasa tersa, jugosa y de ahumado delicado, más ligera que las de cerdo.$t$, 2,
   null, null, null, $t$/recipes/kielbasa-de-pollo.jpg$t$, $t$Te voy a mandar una foto de mi Kielbasa de Pollo Ahumada (tripa de Natural de cerdo, cal. 32–36 mm) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Jamón de Bondiola Ahumado

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$jamon-de-bondiola-ahumado$t$, $t$Jamón de Bondiola Ahumado$t$, $t$Bondiola curada, bridada como jamón y ahumada lento con leña de guayabo hasta los 75 °C internos — para cortar en lonchas finas.$t$, $t$/recipes/jamon-de-bondiola-ahumado.jpg$t$,
   'intermedio', 'pago', 'curso', 'publicado', 'libre', 130,
   'jamones-cocidos', '{curado,ahumado,coccion}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$jamon-de-bondiola-ahumado$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$jamon-de-bondiola-ahumado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Bondiola convertida en jamón, con humo de guayabo.$t$, 0,
   $t$¿Bondiola convertida en jamón? La duda es razonable: la bondiola es una pieza con vetas de grasa, nada que ver con el músculo magro y compacto del que se hacen los jamones clásicos. Y justo ahí está la gracia — esa grasa entreverada se funde durante el ahumado y deja una loncha jugosa donde un jamón de pierna quedaría seco. El proceso es de tres tiempos: se cura empacada al vacío, se brida para que tome la forma cilíndrica, y se ahúma lento con leña de guayabo hasta los 75 °C internos. El guayabo es lo que le da el carácter: un humo dulce y redondo, mucho menos agresivo que el de maderas duras como el roble.

«Yo también tenía mis dudas, hasta que lo probé: la grasa de la bondiola es justo lo que impide que un jamón ahumado quede seco.»$t$, $t$/recipes/jamon-de-bondiola-ahumado.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, $t$La receta del Jamón de Bondiola Ahumado está para 1 kg y cura 1 día por kilo. Mi bondiola pesa otra cosa: ¿cómo reescalo los 27,43 g de mezcla y cuántos días la dejo al vacío? ¿Conviene partirla en dos?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$jamon-de-bondiola-ahumado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$La sal fina al 1,63% es lo que hace que quede sabroso sin salarse, y la sal de cura al 0,25% es el estándar…$t$, 0,
   $t$• Bondiola de cerdo (pieza entera): 1000 g (100%)
• Sal fina: 16,26 g (1,63%)
• Sal de cura #1 (Prague Powder #1): 2,5 g (0,25%)
• Azúcar: 2,51 g (0,25%)
• Ajo en polvo: 1,51 g (0,15%)
• Pimienta negra molida: 1,20 g (0,12%)
• Paprika dulce: 1,20 g (0,12%)
• Coriandro molido: 1,00 g (0,10%)
• Chile quebrado: 1,00 g (0,10%)
• Nuez moscada: 0,25 g (0,025%)
• Pellets o astillas de guayabo: al gusto (—)
• Pita o cabuya para bridar: 1 madeja (—)

La sal fina al 1,63% es lo que hace que quede sabroso sin salarse, y la sal de cura al 0,25% es el estándar seguro y también el techo: nunca más. El azúcar no está para endulzar — redondea la sal y ayuda al color durante el ahumado.

Valores por kilo de bondiola: sal fina 16,26 g · sal de cura #1 2,5 g · azúcar 2,51 g · ajo en polvo 1,51 g · pimienta negra 1,20 g · paprika dulce 1,20 g · coriandro 1,00 g · chile quebrado 1,00 g · nuez moscada 0,25 g. Total de la mezcla: 27,43 g por kilo. Aquí la sal de cura NO es opcional: la pieza pasa horas entre 30 y 60 °C mientras sube al centro, que es justo el rango donde el Clostridium botulinum trabaja mejor.

Estas cantidades son para 1 kg de bondiola. La mezcla completa son 27,43 g por kilo — pesa la pieza antes de nada, porque todo se calcula sobre su peso real y no sobre el que dice la receta.$t$, null, null, null, $t$El Jamón de Bondiola Ahumado lleva 2,5 g de sal de cura #1 por kilo. ¿Por qué la #1 y no la #2 si la pieza se cura antes de ahumar? ¿Qué pasa exactamente si me paso de esa cantidad, y se puede hacer sin ella?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 9 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$jamon-de-bondiola-ahumado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Pesar, mezclar y masajear$t$, $t$Pesa la bondiola y calcula la mezcla sobre ese peso.$t$, 0,
   $t$1. Pesa la bondiola y calcula la mezcla sobre ese peso. Si la pieza es grande, porciónala: una bondiola de 2 kg partida en dos cura en la mitad de tiempo y con mucha menos incertidumbre.

2. Mezcla todos los secos en un bol aparte antes de tocar la carne. Hacerlo así es lo único que garantiza que la sal de cura quede repartida pareja; echándolos uno a uno sobre la pieza siempre queda una zona con más.

3. Cubre la bondiola con la mezcla masajeando bien toda la superficie, incluidos los pliegues y las puntas. No sobra nada: todo lo que pesaste va sobre la carne.$t$, $t$/recipes/jamon-de-bondiola-ahumado.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, null),
  ((select id from m), 'video', $t$Curar al vacío, bridar y ahumar$t$, $t$Empaca al vacío y refrigera 1 día por cada kilo de carne.$t$, 1,
   $t$4. Empaca al vacío y refrigera 1 día por cada kilo de carne. Voltea la bolsa una vez al día para que la salmuera que se forma bañe la pieza por los dos lados.

5. Saca la pieza, escúrrela y brídala con pita o cabuya dándole forma cilíndrica. Esa forma no es estética: una pieza pareja se cocina pareja y se corta en lonchas redondas.

6. Precalienta el barril u horno a 200 °C y mete la pieza. Añade pellets de guayabo cada 30 minutos para mantener el humo constante durante toda la cocción.$t$, $t$/recipes/jamon-de-bondiola-ahumado.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, null),
  ((select id from m), 'video', $t$75 °C, frío de golpe y reposo$t$, $t$Cocina hasta que el CENTRO de la pieza marque 75 °C.$t$, 2,
   $t$7. Cocina hasta que el CENTRO de la pieza marque 75 °C. Mide con termómetro en la parte más gruesa, nunca por tiempo: dos bondiolas del mismo peso pueden tardar distinto según su forma.

8. Enfría de golpe en agua con hielo hasta que la pieza esté fría al tacto. Este paso corta la cocción residual y es también seguridad: acorta el tiempo que la carne pasa en el rango de temperatura donde crecen las bacterias.

9. Envuelve en papel aluminio y deja reposar en la nevera toda la noche. Al día siguiente corta en lonchas finas — en caliente se desarma, en frío se corta limpio.$t$, $t$/recipes/jamon-de-bondiola-ahumado.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, $t$Estoy ahumando mi Jamón de Bondiola Ahumado en horno a 200 °C con pellets de guayabo. ¿Dónde clavo el termómetro exactamente, qué hago si la temperatura se estanca a mitad de camino, y cómo evito que la superficie se seque antes de que el centro llegue a 75 °C?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$jamon-de-bondiola-ahumado$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Frío y recién cortado, sobre tabla.$t$, 0,
   $t$En lonchas finas
Frío y recién cortado, sobre tabla. Es como mejor se aprecia el humo del guayabo.

En sándwich
En lonchas algo más gruesas, apenas templado, con pan crujiente y poco más.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$El guayabo da un humo dulce y suave.$t$, 1,
   $t$El guayabo, en pellets o astillas
El guayabo da un humo dulce y suave. Si no consigues, el manzano o el cerezo son los sustitutos más cercanos; evita maderas duras como el roble, que tapan las especias.

Un día por kilo, no un día y ya
El curado es proporcional al peso. Una pieza de 2 kg necesita 2 días; cortarlo a la mitad del tiempo deja el centro sin curar, que es donde importa.

El termómetro manda sobre el reloj
75 °C internos es el objetivo, no una duración. Si el horno es más chico o la pieza más gruesa, tardará más — y está bien.

Para no fallar
• No omitas la sal de cura #1 — la pieza pasa horas en el rango de riesgo mientras sube al centro.
• Pesa la bondiola antes de calcular nada: los porcentajes se aplican sobre el peso real.
• Mide siempre la temperatura en el centro de la parte más gruesa, no cerca de la superficie.
• El enfriado rápido en agua con hielo no es opcional: es parte de la seguridad, no del acabado.
• Guarda la pieza entera y corta a medida que consumas — en loncha se seca mucho más rápido.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: una pieza firme por fuera y jugosa por dentro, con el humo dulce del guayabo integrado en toda la carne y un picante de fondo que aparece al…$t$, 2,
   null, null, null, $t$/recipes/jamon-de-bondiola-ahumado.jpg$t$, $t$Te voy a mandar una foto del corte de mi Jamón de Bondiola Ahumado para que me digas si el ahumado y la cocción quedaron bien, si el color por dentro es el que debería, y cuánto me aguanta en la nevera.$t$);

-- --------------------------------------------------------------------------

-- Charqui de Res (Beef Jerky)

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$charqui-de-res$t$, $t$Charqui de Res (Beef Jerky)$t$, $t$El beef jerky andino, dulce y picante — carne de res marinada en miel y sriracha, deshidratada al horno hasta quedar firme y lista para picar.$t$, $t$/recipes/charqui-de-res.jpg$t$,
   'para-empezar', 'pago', 'curso', 'publicado', 'libre', 140,
   'jamones-curados', '{curado}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$charqui-de-res$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$charqui-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Res marinada en miel y sriracha, deshidratada al horno.$t$, 0,
   $t$Más de 500 años de historia, resueltos con apenas cuatro ingredientes. El charqui es una de las formas más antiguas de conservar carne en los Andes, y esta versión le suma un giro moderno: miel, sriracha, sal y sal de ajo. La carne se marina bien impregnada, se acomoda en rejilla y se deshidrata al horno a baja temperatura durante varias horas, hasta quedar firme y correosa — el beef jerky casero, dulce, picante e intenso.

«Más de 500 años de historia, resueltos con apenas cuatro ingredientes.»$t$, $t$/recipes/charqui-de-res.jpg$t$, $t$8693ac0e-6ddd-4de8-ac2a-3c7878659063$t$, null, $t$La receta de Charqui de Res (Beef Jerky) está para 1 kg (carne fresca). Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$charqui-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$La miel y la sriracha, al 10% combinado, son las que definen el carácter dulce-picante del charqui; la sal y…$t$, 0,
   $t$• Carne de res (muy magra, sin grasa): 1000 g (100%)
• Sriracha: 60 g (6%)
• Miel: 40 g (4%)
• Sal: 12 g (1.2%)
• Sal de ajo: 8 g (0.8%)

La miel y la sriracha, al 10% combinado, son las que definen el carácter dulce-picante del charqui; la sal y la sal de ajo sazonan sin dominar.

El porcentaje es el peso sobre el peso de la carne. Valores por kilo: sriracha 60 g, miel 40 g, sal 12 g, sal de ajo 8 g. Sin sal de cura — el marinado corto y la deshidratación completa hacen el trabajo de conservación.

Al ser un marinado corto seguido de una deshidratación completa al horno —no un curado largo al aire— esta receta no necesita sal de cura.$t$, null, null, null, $t$Estoy haciendo Charqui de Res (Beef Jerky) y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 7 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$charqui-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Cortar y preparar la marinada$t$, $t$Corta la carne en láminas delgadas (aprox.$t$, 0,
   $t$1. Corta la carne en láminas delgadas (aprox. 0.5 cm), a favor de la fibra, y retira toda la grasa visible.

2. Mezcla la miel, la sriracha, la sal y la sal de ajo hasta integrar bien.$t$, $t$/recipes/charqui-de-res.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, null),
  ((select id from m), 'video', $t$Marinar$t$, $t$Cubre cada lámina de carne con la marinada, asegurándote de que quede bien impregnada por ambos lados.$t$, 1,
   $t$3. Cubre cada lámina de carne con la marinada, asegurándote de que quede bien impregnada por ambos lados.

4. Marina en refrigeración entre 6 y 12 horas.$t$, $t$/recipes/charqui-de-res.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, null),
  ((select id from m), 'video', $t$Al horno a 80 °C$t$, $t$Escurre el exceso de marinada y acomoda las láminas sobre una rejilla, sin que se toquen entre sí.$t$, 2,
   $t$5. Escurre el exceso de marinada y acomoda las láminas sobre una rejilla, sin que se toquen entre sí.

6. Hornea a 80 °C durante 3 a 4 horas, volteando a la mitad del tiempo, hasta que la carne se vea completamente deshidratada.$t$, $t$/recipes/charqui-de-res.jpg$t$, $t$2fa024cc-a711-468c-b42a-e370699524bd$t$, null, null),
  ((select id from m), 'video', $t$Enfriar y guardar$t$, $t$Deja enfriar por completo antes de guardar — el charqui termina de firmar su textura mientras se enfría.$t$, 3,
   $t$7. Deja enfriar por completo antes de guardar — el charqui termina de firmar su textura mientras se enfría.$t$, $t$/recipes/charqui-de-res.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, $t$Hice Charqui de Res (Beef Jerky). ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$charqui-de-res$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$Se come directo, en tiras, sin más preparación — el uso más clásico del charqui.$t$, 0,
   $t$Como snack
Se come directo, en tiras, sin más preparación — el uso más clásico del charqui.

En ensaladas o arroces
En tiras finas o desmenuzado, aporta un salado dulce-picante intenso.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Láminas de grosor uniforme se deshidratan al mismo tiempo, sin puntos crudos ni sobrecocidos.$t$, 1,
   $t$Corta bien fino y parejo
Láminas de grosor uniforme se deshidratan al mismo tiempo, sin puntos crudos ni sobrecocidos.

Sin grasa
La grasa no se deshidrata igual que la carne y puede enranciarse — retírala toda antes de marinar.

Rejilla, no bandeja
Apoyar las láminas sobre una rejilla deja que el aire circule por ambos lados y se sequen parejo.

Para no fallar
• No satures el horno — deja espacio entre las láminas para que el aire circule.
• Voltea las láminas a mitad de la cocción para un secado parejo.
• Deja enfriar por completo antes de guardar, para que no genere humedad en el envase.
• Guarda en un recipiente hermético; se conserva varias semanas en un lugar fresco.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: charqui dulce, picante e intenso, de textura firme y correosa — de 1 kg de carne fresca salen unos 350–400 g de charqui seco, listo para comer…$t$, 2,
   null, null, null, $t$/recipes/charqui-de-res.jpg$t$, $t$Te voy a mandar una foto de mi Charqui de Res (Beef Jerky) para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);

-- --------------------------------------------------------------------------

-- Queso Burrata Artesanal

-- --------------------------------------------------------------------------

insert into charcu.courses
  (slug, title, summary, cover_url, level, access, kind, status, unlock_mode, position, category, techniques)
values
  ($t$queso-burrata$t$, $t$Queso Burrata Artesanal$t$, $t$La burrata casera de verdad — leche cruda pasteurizada en el fogón, hilada en mozzarella y rellena de stracciatella con nata, que se abre con el cuchillo y se derrama sobre el plato.$t$, $t$/recipes/queso-burrata.jpg$t$,
   'avanzado', 'pago', 'curso', 'publicado', 'libre', 150,
   'quesos', '{}')
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, cover_url = excluded.cover_url,
  level = excluded.level, access = excluded.access, kind = excluded.kind,
  status = excluded.status, unlock_mode = excluded.unlock_mode, position = excluded.position,
  category = excluded.category, techniques = excluded.techniques, updated_at = now();

delete from charcu.modules where course_id = (select id from charcu.courses where slug = $t$queso-burrata$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Bienvenida$t$, $t$Lo que vas a lograr.$t$, 0
    from charcu.courses where slug = $t$queso-burrata$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Esto es lo que vas a lograr$t$, $t$Mozzarella hilada rellena de stracciatella: el queso que se derrama.$t$, 0,
   $t$La burrata nació en Puglia como una forma de aprovechar los recortes de la mozzarella: se hilaba una lámina fina, se rellenaba con las hebras sobrantes bañadas en nata y se cerraba en una bolsita atada por arriba, la testa. Ese es todo el secreto — por fuera es pasta hilada, firme y elástica; por dentro es stracciatella, hebras de queso empapadas en crema. Partimos de leche cruda, que es la que da el sabor de verdad, y la pasteurizamos nosotros mismos en el fogón: 63 °C sostenidos media hora, ni más ni menos. Hacerla en casa no requiere equipo de quesería, pero sí dos cosas que no se pueden improvisar: un termómetro y paciencia con los tiempos. El punto exacto de acidez y temperatura es lo que decide si la cuajada se estira como chicle caliente o se rompe en grumos.

«La burrata no se inventó para presumir: se inventó para no tirar los recortes de la mozzarella. Lo mejor de la cocina italiana casi siempre empieza así.»$t$, $t$/recipes/queso-burrata.jpg$t$, $t$14c9bb65-a936-45d3-8ac4-a7d41e7cf79d$t$, null, $t$La receta de Queso Burrata Artesanal está para 4 L de leche → 4–5 burratas de ~120 g. Mi carne pesa otra cosa. ¿Cómo reescalo todos los ingredientes sin equivocarme, sobre todo las sales?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Antes de empezar$t$, $t$Qué lleva, en qué proporción y por qué.$t$, 1
    from charcu.courses where slug = $t$queso-burrata$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Ingredientes y proporción$t$, $t$Los 130 ml de zumo de limón — unos 4 o 5 limones medianos, siempre colado — son la medida para 4 L de leche:…$t$, 0,
   $t$• Leche cruda de vaca entera (la pasteurizamos en el fogón): 4 L (100%)
• Zumo de limón colado: 130 ml (3.25%)
• Cuajo líquido: 1.5 ml (0.04%)
• Agua sin cloro (para diluir el cuajo): 50 ml (1.25%)
• Nata / crema de leche (mín. 35% MG): 180 ml (4.5%)
• Sal para el agua de hilado: 40 g (20 g por litro)
• Sal fina para la stracciatella: 3 g (0.075%)

Los 130 ml de zumo de limón — unos 4 o 5 limones medianos, siempre colado — son la medida para 4 L de leche: llevan la cuajada al punto de acidez que permite el hilado. Cuélalo sin excepción, porque la pulpa deja grumos en la cuajada. La nata al 4,5% es lo que convierte unas hebras de queso en stracciatella de verdad: por debajo de eso el relleno queda seco y deja de derramarse.

Valores por litro de leche: zumo de limón 33 ml, cuajo líquido 0,4 ml, nata 45 ml. Rendimiento aproximado: de 4 L de leche entera salen 450–550 g de pasta hilada, de los que unos 350 g van a las fundas y 100–150 g se desgarran para la stracciatella. El agua de hilado se sala a 20 g/L. Equivalencia útil si algún día quieres repetibilidad exacta lote a lote: esos 130 ml de limón aportan aproximadamente la misma acidez que 5 g de ácido cítrico.

Partimos de leche cruda y la pasteurizamos nosotros en el fogón — es el primer paso de la receta, no un trámite opcional. La burrata es un queso fresco, húmedo y sin maduración: no hay ninguna etapa posterior que elimine patógenos, así que la pasteurización es la única barrera del proceso. La pasteurización lenta a 63 °C es suave y respeta la aptitud quesera de la leche, a diferencia de la industrial. Por eso mismo NO hace falta cloruro de calcio: eso solo se añade cuando se trabaja con leche de tienda homogeneizada. Y ojo con el agua del cuajo: debe ser sin cloro (filtrada o embotellada), porque el cloro del grifo lo inactiva.$t$, null, null, null, $t$Estoy haciendo Queso Burrata Artesanal y no consigo todos los ingredientes. ¿Cuáles puedo cambiar sin arruinarla y cuáles no se tocan?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Paso a paso$t$, $t$Los 22 pasos de la receta, en orden.$t$, 2
    from charcu.courses where slug = $t$queso-burrata$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'video', $t$Higiene, pasteurización y cuajo$t$, $t$Higieniza a fondo todo el equipo: olla, cuchillo largo, colador, cucharón y termómetro.$t$, 0,
   $t$1. Higieniza a fondo todo el equipo: olla, cuchillo largo, colador, cucharón y termómetro. Escáldalos con agua hirviendo y sécalos. En un queso fresco que no madura, la limpieza del primer minuto es la que se come al final.

2. Pasteuriza la leche cruda en el fogón: llévala a 63 °C y sostén esa temperatura 30 minutos, removiendo de vez en cuando. Usa olla de fondo grueso o baño maría, y fuego bajo — si se pega al fondo, arruina el sabor de todo el lote.

3. Enfría la leche rápido, con la olla dentro del fregadero lleno de agua y hielo, hasta bajar de 15 °C. Cuanto antes cruce la franja templada, mejor.

4. Con la leche ya fría, incorpora el zumo de limón colado removiendo suavemente. Añadir el ácido en frío es lo que evita que la leche se corte en grumos: nunca al revés.

5. Calienta lentamente hasta 32 °C, removiendo de vez en cuando. Sube despacio — un calentamiento brusco arruina la textura de la cuajada.

6. Disuelve el cuajo en los 50 ml de agua sin cloro, incorpóralo a la leche y remueve con dos o tres movimientos suaves de arriba abajo. No más: a partir de aquí la leche debe quedar completamente quieta.$t$, $t$/recipes/queso-burrata.jpg$t$, $t$9767cee6-0bf7-451a-a3c5-1e6925b8eb9b$t$, null, null),
  ((select id from m), 'video', $t$La cuajada: cortar, cocer y acidificar$t$, $t$Retira del fuego, tapa y deja reposar 10 a 15 minutos sin tocar ni mover la olla.$t$, 1,
   $t$7. Retira del fuego, tapa y deja reposar 10 a 15 minutos sin tocar ni mover la olla.

8. Comprueba el punto: introduce el cuchillo en ángulo y levanta un poco. Si la cuajada se abre en un corte limpio y suelta suero transparente, está lista. Si aún se ve lechosa, dale 5 minutos más.

9. Corta la cuajada en cubos de unos 2 cm con el cuchillo largo, en rejilla vertical y luego en diagonal. Deja reposar 5 minutos para que suelte suero.

10. Calienta muy despacio hasta 41–42 °C removiendo con suavidad. Los cubos se contraen, se vuelven más firmes y el suero se aclara.

11. Escurre la cuajada en un colador, reservando el suero caliente — te servirá para el hilado y para la ricotta.

12. Deja reposar la cuajada escurrida entre 1 y 3 horas a temperatura ambiente para que termine de acidificar. Este es el paso que más se salta la gente, y el que más fallos causa.$t$, $t$/recipes/queso-burrata.jpg$t$, $t$2fa024cc-a711-468c-b42a-e370699524bd$t$, null, null),
  ((select id from m), 'video', $t$Hilar y hacer la stracciatella$t$, $t$Haz la prueba de hilado: corta un trozo pequeño y sumérgelo en agua a 80 °C un minuto.$t$, 2,
   $t$13. Haz la prueba de hilado: corta un trozo pequeño y sumérgelo en agua a 80 °C un minuto. Si se estira en una lámina brillante sin romperse, está listo. Si se rompe, deja reposar otros 30 minutos y vuelve a probar — nunca hiles el lote entero sin esta prueba.

14. Calienta agua (o el suero reservado) a 80–82 °C y sálala a razón de 20 g por litro. Ponte guantes: a esa temperatura la cuajada quema de verdad.

15. Sumerge porciones de cuajada 2 o 3 minutos, hasta que alcancen unos 57 °C internos, y estíralas y pliégalas sobre sí mismas hasta obtener una masa lisa y brillante. No amases de más: cada pliegue extra expulsa humedad y acerca el queso a la textura de goma.

16. Aparta un tercio de la pasta hilada para el relleno. Estíralo en un cordón fino de un centímetro, enfríalo en agua fría y desgárralo a mano en hebras muy delgadas.

17. Mezcla las hebras con la nata y la sal fina hasta que queden bien empapadas: eso es la stracciatella. Resérvala en frío mientras formas las fundas.

18. Con el resto de la pasta, aún caliente y maleable, forma discos de unos 15 cm, más gruesos en el centro y finos en el borde. Trabaja rápido: si se enfría, deja de estirarse.$t$, $t$/recipes/queso-burrata.jpg$t$, $t$f3a57ec6-49fa-4484-a0c8-15ab361cd4e0$t$, null, null),
  ((select id from m), 'video', $t$Formar, cerrar y guardar$t$, $t$Apoya el disco sobre la palma o dentro de un cuenco pequeño para formar una bolsa, rellena con la…$t$, 3,
   $t$19. Apoya el disco sobre la palma o dentro de un cuenco pequeño para formar una bolsa, rellena con la stracciatella sin excederte y cierra los bordes hacia arriba, sellando bien con los dedos. Si no sella, moja la unión un segundo en el agua caliente.

20. Retuerce el sobrante de arriba para formar la testa, el nudito característico de la burrata. Además de ser su firma visual, es lo que garantiza que la bolsa quede cerrada.

21. Sumerge las burratas en agua fría con hielo entre 10 y 15 minutos, hasta que la funda quede firme y brillante.

22. Guárdalas en refrigeración a 0–4 °C sumergidas en su propio líquido (suero ligeramente salado o agua con sal), en recipiente tapado. Sácalas 20–30 minutos antes de servir.$t$, $t$/recipes/queso-burrata.jpg$t$, $t$6bca551d-d813-4bf6-990e-1f5cba53389d$t$, null, $t$Hice Queso Burrata Artesanal. ¿Cómo sé que está bien por dentro sin que me quede seco?$t$);

with m as (
  insert into charcu.modules (course_id, title, summary, position)
  select id, $t$Terminar$t$, $t$Cocinarlo, servirlo y saber que quedó bien.$t$, 3
    from charcu.courses where slug = $t$queso-burrata$t$
  returning id
)
insert into charcu.lessons
  (module_id, kind, title, summary, position, body, poster_url, bunny_video_id, file_url, ask)
values
  ((select id from m), 'texto', $t$Cómo cocinarlo y servirlo$t$, $t$La forma correcta.$t$, 0,
   $t$Al natural, a temperatura ambiente
La forma correcta. Sácala del frío 20–30 minutos antes: en frío la grasa está cuajada y no se aprecia nada. Aceite de oliva, sal en escamas y pimienta.

Con tomate y albahaca
El clásico de Puglia. Tomate maduro de verdad, aceite bueno y poco más — la burrata es la protagonista.

Sobre pizza o pasta, fuera del horno
Siempre al final, con el plato ya servido. Si la horneas se derrite y pierde justo lo que la hace burrata.

Con embutido curado
Su dulzor láctico corta la grasa y la sal de un buen curado — la razón por la que aparece en tantas tablas.$t$, null, null, null, null),
  ((select id from m), 'texto', $t$Lo que dice el charcutero$t$, $t$Los cuatro números que deciden la receta son 63 °C para pasteurizar, 32 °C para cuajar, 41–42 °C para cocer…$t$, 1,
   $t$El termómetro no es opcional
Los cuatro números que deciden la receta son 63 °C para pasteurizar, 32 °C para cuajar, 41–42 °C para cocer la cuajada y 80–82 °C para hilar. A ojo no se acierta, y un error de cinco grados se nota en el resultado.

Pasteurizar sin quemar la leche
Fuego bajo, olla de fondo grueso y removido frecuente. Si tienes dudas, hazlo a baño maría: tarda más, pero es imposible que se pegue al fondo.

Si no estira, no es culpa tuya: es la acidez
Cuando la cuajada se rompe en vez de estirarse, casi siempre le falta reposo. Dale otros 30 minutos y vuelve a probar el trocito antes de hilar todo.

Amasar de más la vuelve goma
La pasta hilada se trabaja solo hasta que está lisa. Cada pliegue de más expulsa grasa y humedad, y el queso pasa de tierno a chicloso sin punto de retorno.

El centro grueso, el borde fino
Las bolsas se rompen por dos motivos: se estiran demasiado o se rellenan demasiado. Deja el centro con cuerpo y no la llenes hasta arriba.

No tires el suero: hazte una ricotta
El suero que reservaste, calentado a 85–90 °C con un chorro de limón, suelta la ricotta que le queda dentro. Dos quesos de una misma olla de leche.

Para no fallar
• Pasteuriza siempre la leche cruda en el fogón antes de empezar: 63 °C sostenidos 30 minutos. Es la única barrera sanitaria que tiene este queso.
• Enfría la leche por debajo de 15 °C antes de añadir el limón, y calienta después — nunca al revés.
• Cuela el zumo de limón: la pulpa deja grumos en la cuajada.
• Diluye el cuajo en agua sin cloro; el cloro del grifo lo inactiva.
• Haz siempre la prueba de hilado con un trocito antes de comprometer todo el lote.
• Trabaja el hilado con guantes: el agua va a 80 °C y la cuajada retiene el calor.
• Extrema la higiene al rellenar y formar: la stracciatella se manipula a mano después del calentamiento, así que cualquier contaminación en ese punto ya no se elimina.
• Consúmela en 2–3 días como máximo, siempre refrigerada y sumergida en su líquido.$t$, null, null, null, null),
  ((select id from m), 'imagen', $t$Así tiene que quedar$t$, $t$El resultado: una bolsita blanca y brillante, rematada por su testa, que al cortarla se abre y derrama hebras de queso bañadas en nata sobre el plato.$t$, 2,
   null, null, null, $t$/recipes/queso-burrata.jpg$t$, $t$Te voy a mandar una foto de mi Queso Burrata Artesanal para que me digas si va bien, qué le falta y cuánto aguanta una vez esté.$t$);
