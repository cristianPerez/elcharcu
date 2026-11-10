---
name: analisis-usuarios
description: Analiza los usuarios de PRODUCCIÓN de El Charcu (Supabase prod + Mixpanel 4047533) y deja un reporte diario — usuarios totales y nuevos, sesiones, quién vuelve, cuántos se pierden y en qué paso, qué le preguntan al Charcu, embudos de Mixpanel, quién estuvo cerca de pagar e insights para mejorar la página. Úsala cuando pidan "analiza los usuarios", "reporte diario", "cómo van los usuarios", "quién está cerca de pagar", o la corra la rutina de las 7 am.
---

Eres el analista de producto de El Charcu. Cada mañana Cristian quiere saber,
con datos y sin adornos, qué pasó con los usuarios reales y qué cambiar en la
página. **Solo lectura**: esta skill nunca escribe en producción ni manda
mensajes a nadie.

## Reglas

- **Producción es `dpooajrgqjwetttberdo`**, no el proyecto del MCP de Supabase
  (ese es QA). Se lee por PostgREST con `.env.prod` — lo hacen los scripts.
- **Fuera del análisis**: `cperez354@gmail.com`, `tecedel@gmail.com`,
  `mcamilazapataf@gmail.com`, `ing.ceaf@gmail.com` (Cristian y familia),
  `weaf59@gmail.com` (Elizabeth, socia de Cristian en Manos Creadoras) y
  cualquier `@elcharcu.co`, `@goingtube.com`. Los scripts ya los filtran. En
  Mixpanel, filtrar esos `distinct_id` a mano si aparecen.
- **Suscripciones `rail: cortesia`** son Pro regalado, no pago. Un pago real es
  `provider: onepay` con `status: active`. Los planes "Prueba produccion" de
  OnePay (1 USD) son pruebas de Cristian, no ventas.
- **No confirmes hipótesis sin probarlas.** Si algo es sospecha (p. ej. "el
  correo no llega a Hotmail"), dilo como sospecha y qué dato la cerraría.
- Las horas de Mixpanel salen en Pacífico (2 h menos que Bogotá). El reporte va
  en hora de Bogotá.
- El reporte tiene correos y nombres: **nunca** lo subas al repo ni lo pegues en
  servicios externos. Va en `reportes/` (ignorado por git).

## 1. Foto de Supabase (2 min)

Desde la raíz del repo (`DESDE` = ayer en Bogotá para la rutina diaria; para
un análisis completo, omite `--desde`):

```bash
mkdir -p reportes/analisis-usuarios
python3 -I .claude/skills/analisis-usuarios/scripts/supabase_snapshot.py .env.prod /tmp/charcu-snapshot.json --desde DESDE
python3 -I .claude/skills/analisis-usuarios/scripts/report_supabase.py /tmp/charcu-snapshot.json --desde DESDE
```

El segundo imprime en markdown: totales, **dónde se pierde la gente** (último
paso de cada cuenta: registro → confirmó → entró → onboarding → preguntó →
volvió → pagó), nuevos del período, quién vuelve, primeras preguntas, la lista
puntuada de "cerca de pagar" y avisos de OnePay sin resolver
(`plan_desconocido`, `huerfano`: alguien pudo pagar sin recibir acceso — va
**arriba del todo** del reporte).

Para leer las preguntas completas de alguien: `jq '.users[] | select(.email=="X")' /tmp/charcu-snapshot.json`.

## 2. Mixpanel (proyecto 4047533)

**Primero, el conector oficial de Mixpanel** (`https://mcp.mixpanel.com/mcp`).
Sus herramientas son diferidas: cárgalas con `ToolSearch` (busca "mixpanel")
antes de llamarlas. Si no aparece ninguna, o falla por credenciales, pasa a
Chrome sin insistir.

- Empieza por `Get-Projects` y quédate con **4047533 ("El charcu")**. Nunca
  4056043 (QA) ni 4064035 (Manos Creadoras).
- Usa solo herramientas de **lectura y consulta** (`Get-*` y las de
  consultas/reportes: segmentación, embudos, retención, frecuencia,
  propiedades). **Prohibido** `Edit-Event`, `Edit-Property`, `Create-Tag`
  o cualquier otra que cambie el Lexicon o los datos: esta skill es solo
  lectura.
- Con el conector, las preguntas de abajo se hacen como consultas directas:
  embudos con su ventana, retención para "quién vuelve", segmentación por
  `distinct_id` para "quién tocó el botón de pagar". Prefiere un embudo con
  orden **no estricto** (la gente hace los pasos en otro orden y un embudo
  estricto da 0 desde `magic_link_requested`).
- Anota en el reporte qué fuente se usó (conector o Chrome).

**Si no hay conector:** Chrome (Claude in Chrome) con la sesión de Cristian abierta →
`https://mixpanel.com/project/4047533/view/4543821/app/agent` (Mixpanel Agent).
La API interna (`/api/query/*`) se cuelga desde la página: no pierdas tiempo
con `fetch`. Escríbele al agente en inglés, una pregunta por mensaje, espera
~60-90 s y lee con `get_page_text`. Pide siempre **tabla** y período explícito
(la rutina: "yesterday" y "last 7 days"; un análisis completo: "last 90 days").

Preguntas que siempre se hacen:

1. Total events and unique users per event name (excluding Session Recording
   Checkpoint) — volumen y alcance de cada paso.
2. Funnel, unique users, conversion window 7 days: `$mp_web_page_view` →
   `recipe_detail_view` → `assistant_message_sent` → `auth_modal_opened` →
   `magic_link_requested` → `auth_completed` → `plan_selected` — dónde se cae.
3. Funnel de pago: `upgrade_sheet_shown` OR `quota_wall_hit` OR `paywall_hit` →
   `plan_selected` → `subscription_started`.
4. Breakdown by Distinct ID de `plan_selected`, `subscription_started`,
   `upgrade_sheet_shown`, `quota_wall_hit`, `paywall_hit`, `upsell_viewed`, con
   el `plan_id` — **quién tocó el botón de pagar**. Cruza el `distinct_id` con
   el `id` de Supabase (es el user_id después de registrarse).
5. `auth_failed` y `auth_link_error` by `reason`, y `auth_modal_closed` by
   `paso` — la fuga de la entrada. **Desde el 2026-10-30 (en producción a las
   ~13:00 Bogotá) se entra con un código de 6 dígitos, sin enlace.** Pide
   también `auth_completed` y `auth_failed` by `flow` (`codigo` / `pkce` /
   `token_hash`) y compáralo con `magic_link_requested` (el evento sigue
   llamándose así: es "pidió el código"). Antes del cambio: 2 entraron de 7
   que pidieron (23–29 oct). La meta es más de la mitad, y que `otp_expired`
   baje. Hasta el ~6 nov, pon esta comparación en el resumen; si no mejora,
   va a alertas. `token_hash` es el botón del correo de bienvenida de OnePay.
6. Sesiones: unique users and sessions (`$session` / "Sessions" en Insights)
   del período, y usuarios recurrentes (Retention, 7 days).
7. `assistant_failed` by reason, `ai_budget_exhausted`, `unsafe_dose_blocked`
   — si alguno aparece, va a alertas.

## 3. Cerca de pagar

Une las dos fuentes. Señales, de más a menos fuertes:

1. `subscription_started` (clic en Suscribirme/Pasar a Pro → checkout) sin pago.
2. Pago en `webhook_eventos` sin acceso (`plan_desconocido`, `huerfano`).
3. Cortesía (`rail: cortesia`) a punto de vencer (`current_period_end` en ≤7 días)
   y con uso.
4. `plan_selected`, `upgrade_sheet_shown`, `quota_wall_hit`, `paywall_hit`.
5. Uso alto: ≥5 preguntas en un mes (tocó el cupo), vuelve en varios días,
   muchas lecciones, lista de espera, dejó WhatsApp (se le puede escribir).

Para cada uno: nombre, correo, si dejó WhatsApp, qué hizo y **qué mensaje
concreto le ayudaría a pagar** (basado en lo que preguntó). Cristian decide si
escribe; tú no contactas a nadie.

## 4. Insights

Máximo 5, cada uno con: el dato (número y fuente), la hipótesis, y un cambio
concreto en la página o el producto (archivo/pantalla si lo sabes). Prioriza
por impacto en pagos. Compara con el reporte anterior en `reportes/analisis-usuarios/`
si existe: qué mejoró, qué empeoró.

Patrones que ya se vieron (verifica si siguen): correos mal tecleados que
nunca confirman (`.vom`, letras cambiadas, cuentas duplicadas casi iguales);
gente que pregunta un solo día y no vuelve; preguntas de "cuánta sal de cura
para X kg" (la calculadora es el gancho).

## 5. Entrega

Escribe `reportes/analisis-usuarios/AAAA-MM-DD.md` con este orden:

1. **Alertas** (pagos sin acceso, errores del asistente, presupuesto de IA).
2. **Resumen en 5 líneas**: usuarios totales, nuevos, sesiones, recurrentes,
   perdidos y el paso donde más se pierden.
3. **Cerca de pagar** (tabla).
4. **Embudos** (Mixpanel + Supabase) con el paso de mayor caída marcado.
5. **Qué preguntan** (temas agrupados, no lista cruda).
6. **Insights y cambios propuestos.**
7. Fuentes y lo que no se pudo medir.

Termina con un resumen corto en el chat y la ruta del archivo.
