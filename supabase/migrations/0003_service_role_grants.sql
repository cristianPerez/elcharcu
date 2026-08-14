-- ============================================================================
-- Permisos del rol de servicio sobre el esquema `charcu`
--
-- La migración 0001 dio acceso al esquema a `anon` y `authenticated`, pero se
-- olvidó de `service_role`. Resultado: el servidor no podía ni leer su propio
-- contador de gasto ("permission denied for schema charcu").
--
-- `service_role` se salta los permisos por fila (RLS), pero igual necesita
-- permiso para ENTRAR al esquema. Son dos cosas distintas.
-- ============================================================================

grant usage on schema charcu to service_role;

grant all on all tables in schema charcu to service_role;
grant all on all sequences in schema charcu to service_role;
grant execute on all functions in schema charcu to service_role;

-- Y que lo que se cree de aquí en adelante herede lo mismo, para no repetir
-- este mismo olvido en la próxima tabla.
alter default privileges in schema charcu
  grant all on tables to service_role;
alter default privileges in schema charcu
  grant all on sequences to service_role;
