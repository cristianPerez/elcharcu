-- ============================================================================
-- Un puente para que el código VIEJO siga contando mientras se despliega
-- el nuevo (2026-09-01)
--
-- ⚠️ ESTA MIGRACIÓN ES TEMPORAL Y HAY QUE BORRARLA. Ver el final del archivo.
--
-- QUÉ PASÓ. La 0025 partió el presupuesto en dos bolsillos y, al hacerlo, tiró
-- las firmas viejas de las dos funciones:
--
--   today_ai_spend()                     →  today_ai_spend(p_audience)
--   record_ai_spend(4 argumentos)        →  record_ai_spend(5 argumentos)
--
-- Tirarlas era lo correcto: mientras existieran, una llamada que se olvidara
-- del público seguiría compilando y sumaría en silencio al bolsillo
-- equivocado. Pero al aplicarla a producción ANTES de desplegar el código
-- nuevo, el código que está sirviendo ahora mismo llama a las firmas que
-- acaban de desaparecer.
--
-- Y falla en la peor dirección, en silencio:
--
--   · `checkBudget` no puede leer → devuelve "queda presupuesto" → SIN TOPE
--   · `recordSpend` no puede escribir → NO SE APUNTA NADA
--
-- No es una caída —el asistente sigue contestando— pero durante esa ventana no
-- hay freno ni contabilidad. Con 4 peticiones en toda la vida de producción la
-- exposición real es mínima, pero no tiene por qué existir.
--
-- MI ERROR, dicho claro: el orden que se dio era "migración primero, luego el
-- merge", y es el correcto para que el código nuevo no se encuentre sin
-- columna. Lo que no se anticipó es que la 0025 también rompe HACIA ATRÁS, así
-- que con las dos cosas a la vez hay ventana en cualquiera de los dos órdenes.
-- Lo que faltaba era justo esto: un despliegue de convivencia.
--
-- QUÉ HACE ESTE PUENTE. Devuelve las firmas viejas como envoltorios que
-- delegan en las nuevas con público `lead`. Es la clasificación correcta y no
-- una suposición cómoda: `subscriptions` está vacía, así que hoy todo el gasto
-- es de gente sin suscripción, que es exactamente lo que significa `lead`.
-- ============================================================================

create or replace function charcu.today_ai_spend()
returns numeric
language sql
stable
security definer
set search_path = ''
as $$
  select charcu.today_ai_spend('lead');
$$;

create or replace function charcu.record_ai_spend(
  p_prompt_tokens  bigint,
  p_thought_tokens bigint,
  p_answer_tokens  bigint,
  p_cost_usd       numeric
)
returns numeric
language sql
security definer
set search_path = ''
as $$
  select charcu.record_ai_spend(
    p_prompt_tokens, p_thought_tokens, p_answer_tokens, p_cost_usd, 'lead'
  );
$$;

revoke all on function charcu.today_ai_spend() from public, anon, authenticated;
grant execute on function charcu.today_ai_spend() to service_role;

revoke all on function charcu.record_ai_spend(bigint, bigint, bigint, numeric)
  from public, anon, authenticated;
grant execute on function charcu.record_ai_spend(bigint, bigint, bigint, numeric)
  to service_role;

-- ============================================================================
-- ⚠️ BORRAR ESTO CUANDO EL CÓDIGO NUEVO ESTÉ DESPLEGADO EN PRODUCCIÓN
--
-- Estos dos envoltorios son una trampa mientras existan, y es la misma trampa
-- por la que la 0025 tiró las firmas viejas: una llamada futura que se olvide
-- del público compila igual y suma a `lead` sin decir nada. Un fallo silencioso
-- en la contabilidad del dinero.
--
-- Se aceptan solo porque duran un despliegue. Cuando `/api/salud` de
-- www.elcharcu.co devuelva el commit que trae los dos presupuestos, se crea una
-- migración con estas dos líneas y se acabó:
--
--   drop function if exists charcu.today_ai_spend();
--   drop function if exists charcu.record_ai_spend(bigint, bigint, bigint, numeric);
--
-- Queda anotado en ESTADO.md como pendiente. Si lo estás leyendo y ya está
-- desplegado hace días, esto ES el pendiente: bórralo.
-- ============================================================================
