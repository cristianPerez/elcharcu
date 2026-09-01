-- ============================================================================
-- `profiles` pierde `country` y `experience_level` (2026-09-01)
--
-- Las dos columnas quedaron sin nadie que las escriba cuando el onboarding se
-- rehízo el 2026-08-29:
--
-- `experience_level` — se fue con la pregunta del nivel. "Todos son charcus":
--   el prompt del asistente dejó de clasificar a la gente en curioso /
--   apasionado / avanzado, así que ya no hay nada que guardar ni nadie que lo
--   lea.
--
-- `country` — se fue con la pregunta del país. Lo que de verdad la necesitaba
--   —el prompt, para el clima y el vocabulario— lo saca ahora de
--   `x-vercel-ip-country` en cada petición, que además no se puede falsear
--   desde el navegador como sí pasaba antes. Y la analítica la da Mixpanel.
--
-- Desde entonces las dos guardaban su valor por defecto ('co' y 'curioso') para
-- todo el mundo. Una columna que siempre dice lo mismo no informa de nada, y
-- encima invita a que alguien la lea creyendo que sí.
--
-- El trigger `handle_new_user` no se toca: inserta solo `id`, así que nunca las
-- nombró.
--
-- ⚠️ Si algún día vuelve a hacer falta el país POR USUARIO —no el de la
-- petición, sino dónde cura de verdad, que puede no ser desde donde escribe—
-- se añade otra vez. No se conserva "por si acaso": una columna muerta que
-- nadie escribe es peor que no tenerla, porque parece un dato.
-- ============================================================================

alter table charcu.profiles
  drop column if exists country,
  drop column if exists experience_level;
