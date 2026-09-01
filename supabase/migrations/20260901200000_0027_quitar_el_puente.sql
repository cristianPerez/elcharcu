-- ============================================================================
-- Fuera el puente: el código nuevo ya está desplegado (2026-09-01)
--
-- La 0026 devolvió temporalmente las firmas viejas de las dos funciones de
-- gasto para que el código que estaba sirviendo siguiera contando mientras se
-- desplegaba el nuevo. Ese despliegue ya ocurrió: producción sirve `76c04c4`
-- (merge del PR #10), que contiene `8d101ba` —los dos presupuestos—
-- comprobado por ascendencia de git antes de borrar esto.
--
-- ⚠️ POR QUÉ NO SE DEJAN "POR SI ACASO". Mientras existan, una llamada futura
-- que se olvide del público compila igual y suma en silencio al bolsillo de
-- `lead`. Es un fallo silencioso en la contabilidad del dinero: nadie ve un
-- error, solo un número que poco a poco deja de ser verdad. La 0025 las quitó
-- justo por eso, y la 0026 las devolvió sabiendo que duraban un despliegue.
--
-- Quedan solo las firmas con `p_audience`, que obligan a decir quién gasta.
-- ============================================================================

drop function if exists charcu.today_ai_spend();
drop function if exists charcu.record_ai_spend(bigint, bigint, bigint, numeric);
