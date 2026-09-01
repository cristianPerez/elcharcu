import { type GeminiResult, type GeminiTurn } from './generate';

/**
 * ¿Se contesta sin llamar a Google?
 *
 * ⚠️ DOS CONDICIONES, Y LA SEGUNDA NO SE PUEDE APAGAR. Hace falta pedirlo con
 * `AI_SIMULAR_IA=1` **y** no estar en producción. Una variable de entorno mal
 * copiada de un entorno a otro es de las cosas más fáciles que pasan, y la
 * consecuencia aquí sería que www.elcharcu.co contestara con texto de mentira
 * sin que nadie se diera cuenta: el asistente parecería funcionar y estaría
 * inventando dosis de sal de cura. Por eso `VERCEL_ENV` manda sobre la
 * variable, y no al revés.
 *
 * Para qué sirve: en QA se prueba el flujo entero —cupo, muro, historial,
 * eventos— sin gastar un centavo ni tocar el presupuesto compartido, y encima
 * las respuestas son siempre las mismas, así que una prueba que falla es un
 * fallo de verdad y no el modelo teniendo un día distinto.
 */
export function isFakeAiEnabled(): boolean {
  const pedido = process.env.AI_SIMULAR_IA === '1';
  const enProduccion = process.env.VERCEL_ENV === 'production';
  return pedido && !enProduccion;
}

/**
 * Una respuesta de mentira que se parece a una de verdad.
 *
 * Lleva a propósito:
 *
 *   · **El aviso de que es simulada**, en la primera línea. Nadie debería mirar
 *     una captura de QA y creer que El Charcu contestó eso.
 *   · **Una dosis DENTRO del tope** (2 g/kg contra el máximo de 2,5). Así el
 *     camino normal se recorre entero, incluido `auditCureDoses`, en vez de
 *     saltárselo — que es justo lo que uno quiere probar.
 *   · **Un recuento de tokens plausible**, para que se apunte gasto en el libro
 *     de QA y los DOS presupuestos se puedan probar de verdad. Como QA tiene su
 *     propia base, ese gasto de mentira no toca el de producción.
 */
export function fakeAnswer(turns: readonly GeminiTurn[]): GeminiResult {
  const ultima = turns[turns.length - 1];
  const pregunta = (ultima?.text ?? '').slice(0, 120);
  const conFoto = ultima?.image !== undefined;

  const text = `**[RESPUESTA SIMULADA — no salió de Gemini]**

Me preguntaste: «${pregunta}»${conFoto ? '\n\nY me mandaste una foto, que también va simulada.' : ''}

Para esa pieza usa **2 g de sal de cura #1 por kilo** de carne. Pésala antes: el porcentaje se calcula sobre el peso real, no sobre el que dice la receta.

¿Cuántos kilos tienes exactamente?`;

  return {
    ok: true,
    text,
    usage: {
      promptTokens: 1800,
      thoughtTokens: 400,
      answerTokens: 120,
    },
  };
}
