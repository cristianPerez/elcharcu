---
name: reporte-diario
description: Reporte diario de producción de El Charcu — suscriptores primero (quién paga, si usa El Charcu, cuándo vence), a quién hacerle seguimiento y con qué mensaje, qué le preguntaron al Charcu AI y cómo mejorarlo, cuentas nuevas, pagos, gasto de IA, Mixpanel mirado a ojo en Chrome y un HTML + PDF con todo. Úsala cuando pidan "el reporte de hoy", "cómo fue ayer", "cómo van los suscriptores", o "qué le preguntaron al charcu". Se corre a pedido; la tarea de las 7 am usa `analisis-usuarios`.
---

# Reporte diario de producción — El Charcu

Solo LEE datos de producción (elcharcu.co). No escribe en la base, no manda
correos ni WhatsApp a nadie, no hace commits. Los mensajes de seguimiento se
**redactan**; Cristian decide si los manda.

Lo más importante, en este orden:

1. **Los suscriptores activos.** Son pocos y cada uno cuenta: si paga y no usa
   El Charcu, se va a ir. Se miran uno por uno, nunca como cifra agregada.
2. **Qué le preguntaron al Charcu AI y si respondió bien.** Es el producto.
   Cada día debe salir al menos una mejora concreta.
3. A quién hacerle seguimiento, y con qué mensaje.

## Pasos

1. Desde la raíz del repo:

   ```bash
   pnpm -s reporte:diario
   ```

   Sin argumento es AYER en hora de Bogotá; para otro día:
   `pnpm -s reporte:diario 2026-11-07`. Deja en `reportes/diario/` (fuera de
   git) el `AAAA-MM-DD.md` y el `AAAA-MM-DD-chat.json` con cada pregunta y su
   respuesta COMPLETA.

2. Si falla, di qué falló en una frase simple (por ejemplo "falta `.env.prod`"
   o "Supabase no responde") y para. No inventes cifras.

3. **SUSCRIPTORES, UNO POR UNO.** Para cada fila de la tabla ⭐ (y siempre que
   haya un suscriptor 🟡, 🔴 o ⚫):
   - Lee lo que preguntó en los últimos días en el JSON o, si no preguntó
     ayer, en `charcu.chat_messages` por PostgREST (GET con `.env.prod` y
     `Accept-Profile: charcu`, ver la memoria "Cómo leer datos de producción").
   - Di en una línea cómo va: qué está haciendo (qué curso, qué pieza), si le
     está sacando provecho y qué riesgo hay (no entra, se le acaba el plan, se
     quejó de algo).
   - ⚫ = plan vencido que sigue marcado `active` en la base: no tiene acceso de
     verdad. Dilo y pregunta a Cristian qué hacer; no lo cambies tú.

4. **REDACTA LOS MENSAJES DE SEGUIMIENTO.** Para cada persona de "🤝 A quién
   hacerle seguimiento", un mensaje listo para pegar, en el tono de El Charcu
   (cercano, de tú, de charcutero a charcutero, sin presión de venta):
   - Por WhatsApp si tiene 📱; si no, por correo.
   - Que hable de algo REAL que esa persona hizo o preguntó (la pieza, el curso,
     la duda). Nada genérico tipo "¿cómo vas?".
   - Si hay queja (un video que no corresponde, algo que no funcionó), primero
     se reconoce y se dice qué se va a hacer; la venta, nunca en ese mensaje.
   - Renovaciones: los enlaces del Pro en OnePay están en
     `charcu.plan_checkout` (`modo = produccion`). Recuerda que debe pagar con
     el MISMO WhatsApp de su cuenta para que el pago se active solo.

5. **ANALIZA EL CHARCU AI** con el JSON del día (todas las respuestas, no solo
   las señales automáticas). Para cada respuesta, revisa:
   - **Seguridad**: dosis de sal de cura, temperaturas, tiempos. Compáralas con
     las recetas (`charcu.recetario`) y con el prompt
     (`src/entities/charcu-assistant/model/systemPrompt.ts`). Una cifra que
     contradice a una receta del sitio es un aviso ⚠️ (ej.: la receta dice
     68–70 °C internos y el asistente dijo 72 °C).
   - **¿Respondió lo que le preguntaron?** ¿O dio vueltas, pidió datos que no
     hacían falta, o mandó a WhatsApp algo que podía resolver?
   - **Producto**: quejas o errores del sitio que la persona le contó al
     asistente (un video que no corresponde, un enlace roto). Van como aviso
     para Cristian, no como mejora del prompt.
   - **Oportunidad**: ¿podía recomendar una receta o curso de la casa y no lo
     hizo? ¿La pregunta se repite y merece una receta o una respuesta fija?
   - Termina con **1 a 3 mejoras concretas** para el Charcu AI: qué cambiar,
     en qué archivo o tabla, y con qué pregunta real se comprueba. Que sean
     pequeñas y verificables.
   - **Bitácora**: añade esas mejoras al final de
     `reportes/diario/mejoras-charcu-ai.md` (créalo si no existe) con la fecha.
     Antes, lee las de días anteriores: si una mejora propuesta ya se hizo
     (búscala en `git log` o en el archivo), márcala ✅; si un problema se
     repite, súbele la prioridad y dilo. Así se mejora cada vez y no se
     propone lo mismo dos veces.

6. **MIRA MIXPANEL A OJO** (proyecto **4047533**, El charcu). Si el conector
   MCP de Mixpanel está conectado, úsalo solo para leer. Si no, en el Chrome de
   Cristian con `mcp__claude-in-chrome__*`, **siempre en una pestaña NUEVA**
   (`tabs_create_mcp`), nunca en la que él esté usando:
   - Tablero **"Embudo de cuenta"**:
     `https://mixpanel.com/project/4047533/view/4543821/app/boards#id=11576201`,
     botón **Yesterday**. Anota los pasos y dónde se cae más.
   - Para cada suscriptor y cada cuenta nueva del día:
     `https://mixpanel.com/project/4047533/view/4543821/app/profile#distinct_id=<user_id>`
     → **Activity Feed**: qué abrió, si chocó con un muro (`quota_wall_hit`,
     `upgrade_sheet_shown`), si hubo **Dead Click** (buscaba algo y no lo
     encontró) y de dónde llegó.
   - La API interna (`/api/query/*`) se cuelga desde la página: no pierdas
     tiempo con `fetch`. Para una pregunta puntual sirve el **Mixpanel Agent**
     (`/app/agent`), en inglés y pidiendo tablas.
   - Mixpanel está en hora del **Pacífico**: 3 h menos que Bogotá de noviembre a marzo, 2 h el resto del año.
     Di las horas en hora de Bogotá.
   - Al terminar, **cierra la pestaña** que abriste (`tabs_close_mcp`).

7. **RESPONDE** en español simple, para alguien NO técnico:
   - Arriba, **3 a 5 líneas**: cómo están los suscriptores, lo más importante
     que preguntaron al Charcu AI, y el seguimiento más urgente.
   - Después: suscriptores uno por uno, los mensajes de seguimiento listos para
     pegar, el análisis del Charcu AI con sus mejoras, y el reporte completo.
   - Al final los avisos ⚠️ (formato: qué pasó → por qué importa → qué hacer).

8. **GENERA EL HTML** en `reportes/diario/AAAA-MM-DD.html`, autocontenido, con
   TODO el detalle (si un dato no se pudo conseguir, dilo en el propio HTML):
   - Encabezado con la fecha y la hora en que se generó.
   - Números grandes: suscriptores vigentes · preguntas al Charcu AI · cuentas
     nuevas · pagos, con ↑/↓ frente al reporte del día anterior si existe.
   - **Una ficha por suscriptor** (lo primero, lo más grande): nombre, plan,
     cómo paga, vence, semáforo, último uso, qué está haciendo y el mensaje de
     seguimiento si lo hay.
   - El embudo de Mixpanel dibujado (barras con número y %).
   - Las conversaciones del Charcu AI (pregunta → respuesta resumida) y las
     mejoras propuestas.
   - Los avisos ⚠️ destacados al final.
   - Estilo de elcharcu.co: crema `#f4f1eb`, blanco `#ffffff`, bosque
     `#2d4a3e` (títulos y encabezado), brasa `#ee8b5d` (acentos y barras),
     tinta brasa `#9c4a22`, salvia `#7a9e8e` (etiquetas), cacao `#1e1612`
     (texto). **Fraunces** para títulos e **Inter** para texto (Google Fonts).
     Tarjetas con bordes redondeados de 16 px. Una columna en el celular
     (375 px).
   - Estilos de impresión: `print-color-adjust:exact`,
     `@page{size:A4;margin:14mm}`, `break-inside:avoid` en tarjetas, avisos y
     gráficos.
   - Ábrelo en el panel (`file://…`) para comprobar que se ve bien.

9. **EXPORTA EL PDF, SIEMPRE**, del mismo HTML y sin tocar el Chrome de
   Cristian:
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new --disable-gpu --no-pdf-header-footer \
     --user-data-dir=/tmp/chrome-pdf-charcu --virtual-time-budget=6000 \
     --print-to-pdf="reportes/diario/AAAA-MM-DD.pdf" \
     "file:///…/reportes/diario/AAAA-MM-DD.html"
   ```
   Comprueba que salió a color y pega la ruta en la respuesta.

## Cómo leer las cifras (no lo cambies al explicarlo)

- **Suscriptor vigente** = `status = active` Y `current_period_end` en el
  futuro. La base deja `active` aunque el período se acabe; por eso existe el ⚫.
- **Cómo paga**: `OnePay` se renueva solo (salvo `canceled_at`). `Manual
(nequi)` y `Cortesía` NO se renuevan solos: hay que avisarles antes.
  Carlos Quintero es cortesía de verdad; York pagó su mes por Nequi.
- **Cuentas internas fuera**: Cristian y su familia (`cperez354@gmail.com`,
  `tecedel@gmail.com`, `mcamilazapataf@gmail.com`, `ing.ceaf@gmail.com`),
  Elizabeth `weaf59@gmail.com` (socia de Cristian en Manos Creadoras) y
  cualquier `@elcharcu.co` / `@goingtube.com`. El script ya las quita, también
  sus preguntas anónimas.
- **Planes de prueba de OnePay** ("Prueba produccion", 1 USD) no son ventas.
- **Cupo del mes** sale de `usage_counters` (`period_key` = mes) contra
  `plan_quotas`. El gratis (Aprendiz) trae 8 preguntas al mes.
- **Último uso** = la última pregunta, lección o inicio de sesión, lo que sea
  más reciente.
- **Anónimo** = visitante sin cuenta que preguntó; se ve solo el principio de
  su `visitor_id`.
