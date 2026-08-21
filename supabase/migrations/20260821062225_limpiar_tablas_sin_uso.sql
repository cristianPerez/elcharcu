-- ============================================================================
-- Fuera los restos de versiones anteriores del esquema (2026-08-21)
--
-- Revisando las 15 tablas una por una salieron tres cosas que no usa nadie: ni
-- el código, ni ninguna función de Postgres, ni ninguna política. Las tres
-- están VACÍAS o sin lectores, así que esto no borra datos de nadie.
--
-- ⚠️ LOS USUARIOS NO SE TOCAN. Viven en `auth.users`, que es de Supabase y
-- está fuera del esquema `charcu`. Aquí solo cuelgan cosas SUYAS mediante
-- `user_id references auth.users (id)`. Nada de lo que se borra abajo guarda
-- usuarios.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. `videos` — la reemplazó `lessons`
-- ----------------------------------------------------------------------------
--
-- Era la primera forma de guardar el contenido de un curso (migración 0001).
-- La jubiló `charcu.lessons` (0011), que hace lo mismo y además admite PDF,
-- imagen y texto — no solo video.
--
-- Tener dos tablas para lo mismo es la clase de cosa que dentro de tres meses
-- hace que alguien escriba en la equivocada y pierda una tarde entendiendo por
-- qué su lección no aparece.
--
-- Y además está rota: al reaplicar la migración de cursos se hizo
-- `drop table charcu.courses cascade`, y ese `cascade` se llevó por delante su
-- clave foránea sin avisar. Hoy `videos.course_id` apunta al vacío.
drop table if exists charcu.videos;

-- ----------------------------------------------------------------------------
-- 2. `saved_recipes` — se adelantó a su propio producto
-- ----------------------------------------------------------------------------
--
-- Es para importar recetas de TikTok/Instagram y corregirlas con el método de
-- El Charcu: el paso 8, que es lo ÚLTIMO de la lista porque es retención y no
-- captación.
--
-- Se diseñó antes de D19 y D20, cuando "receta" significaba otra cosa. Cuando
-- toque construirlo, el modelo casi seguro será distinto — y una tabla vacía
-- es una promesa que el esquema hace y el producto todavía no ha decidido.
-- Vuelve a crearse el día que se construya, con la forma que haga falta
-- entonces.
drop table if exists charcu.saved_recipes;

-- ----------------------------------------------------------------------------
-- 3. `profiles.free_recipe_used` — la marca del candado que jubiló D15
-- ----------------------------------------------------------------------------
--
-- La ponía en `true` el trigger `enforce_recipe_gate`, el candado de "una
-- receta gratis por cuenta". Ese candado murió con D15: el plan pasó a medirse
-- en preguntas e imágenes, no en recetas. El trigger ya se fue con
-- `recipe_sessions` (0010) y la columna quedó ahí sin que nadie la escriba ni
-- la lea.
--
-- Se borra porque una columna así confunde de verdad: quien la vea mañana va a
-- pensar que la regla de negocio es otra.
--
-- El resto de `profiles` se queda: país y nivel sí se usan.
alter table charcu.profiles drop column if exists free_recipe_used;
