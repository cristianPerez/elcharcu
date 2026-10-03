-- ============================================================================
-- Los avisos que cada quien quiere recibir (2026-10-03)
--
-- "Mi cuenta" rediseñada tiene tres interruptores:
--
--   · Recordatorios de pasos   — "Hoy toca embutir tu longaniza".
--   · Avisos de cursos nuevos  — cuando abra uno que pediste o esperas.
--   · Correo con novedades     — recetas y cápsulas nuevas.
--
-- ⚠️ HOY NINGUNO ENVÍA NADA. No hay canal de recordatorios ni de avisos: esto
-- solo guarda la preferencia, para que el día que exista el envío ya sepa a
-- quién no molestar. La pantalla no promete más que eso.
--
-- Los dos primeros nacen encendidos —son avisos de lo que la persona misma
-- está haciendo o pidió—. El correo de novedades nace APAGADO: es publicidad,
-- y la publicidad se pide, no se presume.
--
-- No hace falta política ni permiso nuevo: `profiles_update_own` (0001) y el
-- `grant update` sobre la tabla ya cubren columnas nuevas (ver la nota de la
-- 0014).
-- ============================================================================

alter table charcu.profiles
  add column if not exists notify_step_reminders boolean not null default true,
  add column if not exists notify_new_courses    boolean not null default true,
  add column if not exists notify_news           boolean not null default false;

comment on column charcu.profiles.notify_step_reminders is
  'Quiere recordatorios de los pasos de sus recetas. Hoy no se envían: solo se guarda.';
comment on column charcu.profiles.notify_new_courses is
  'Quiere aviso cuando abra un curso que pidió o espera. Hoy no se envía: solo se guarda.';
comment on column charcu.profiles.notify_news is
  'Acepta correo con novedades. Nace en false: la publicidad se pide.';
