-- ============================================================================
-- El dibujo de cada cápsula (2026-10-03)
--
-- Las tarjetas de "Empieza por aquí" llevan un dibujo grande de línea fina en
-- la esquina: un salero, una báscula, un jamón bridado, un chorizo, un amarre.
-- Cuál toca es un dato de la cápsula, no de la pantalla: si mañana se añade
-- una sexta, se le pone su `icon` aquí y la app la pinta sin tocar código.
--
-- Solo el NOMBRE del dibujo. El trazo vive en el código (un SVG por nombre) y
-- los colores salen del estado de la cápsula, no de la base. Null = el dibujo
-- genérico.
--
-- Por slug: en una base vacía los `update` no tocan nada.
-- ============================================================================

alter table charcu.courses
  add column if not exists icon text
    check (icon in ('sal', 'bascula', 'jamon', 'chorizo', 'amarre'));

comment on column charcu.courses.icon is
  'El dibujo de la tarjeta (sal, bascula, jamon, chorizo, amarre). Null = genérico.';

update charcu.courses set icon = 'sal'     where slug = 'sal-de-cura';
update charcu.courses set icon = 'bascula' where slug = 'calcular-con-el-charcu';
update charcu.courses set icon = 'jamon'   where slug = 'bridar-un-jamon';
update charcu.courses set icon = 'chorizo' where slug = 'embutir-un-chorizo';
update charcu.courses set icon = 'amarre'  where slug = 'amarrar-chorizos';
