import { type Plan } from './plan.types';

/**
 * Precios PROPUESTOS, en pesos colombianos y ajustables.
 *
 * La unidad ya no es la receta sino la PREGUNTA y la IMAGEN (D15). El plan
 * Aprendiz da la primera pregunta sin pedir nada; el resto del cupo se abre al
 * dejar nombre, correo y WhatsApp.
 *
 * Cuentas detrás de los cupos (ver "Tope de gasto" en ESTADO.md): una pregunta
 * de texto cuesta ~0,0055 USD. 200 preguntas ≈ 1,10 USD contra ~7,50 USD de
 * ingreso mensual. Las imágenes van mucho más cortas porque cuestan bastante
 * más que el texto. Si el precio de Gemini se duplica el 1/1/2027, estos cupos
 * hay que revisarlos.
 */
export const plans: readonly Plan[] = [
  {
    id: 'aprendiz',
    name: 'Aprendiz',
    priceCop: 0,
    billing: 'gratis',
    quota: { questionsPerMonth: 8, imagesPerMonth: 2 },
    pitch: 'Para probar el asistente con una duda de verdad.',
    features: [
      'La primera pregunta sin registrarte, sin dar nada',
      '8 preguntas al mes dejando nombre, correo y WhatsApp',
      '2 fotos al mes para diagnóstico de moho',
      'Dosis de sal de cura siempre revisada por seguridad',
      'Dos videos de introducción de los cursos',
    ],
    ctaLabel: 'Preguntar gratis',
    note: 'Sin tarjeta. En serio.',
    isHighlighted: false,
  },
  {
    id: 'mensual',
    name: 'Charcutero',
    priceCop: 29900,
    billing: 'mensual',
    quota: { questionsPerMonth: 200, imagesPerMonth: 30 },
    pitch: 'Para el que ya cura seguido y no quiere perder una pieza más.',
    features: [
      '200 preguntas al mes — unas 6 o 7 al día',
      '30 fotos al mes para revisar moho, color y textura',
      'Todos los mini-cursos en video, completos',
      'Ajuste por tu clima, tu región y tu temporada',
      'Costo por porción y precio sugerido si vendes',
      'Tu historial guardado durante todo el curado',
    ],
    ctaLabel: 'Suscribirme',
    note: 'Cancelas cuando quieras, desde la app.',
    isHighlighted: true,
  },
  {
    id: 'anual',
    name: 'Charcutero anual',
    priceCop: 239000,
    billing: 'anual',
    quota: { questionsPerMonth: 300, imagesPerMonth: 50 },
    pitch: 'Un curado serio toma meses. Este plan también.',
    features: [
      '300 preguntas y 50 fotos cada mes, todo el año',
      'Todo lo del plan Charcutero',
      'Dos meses gratis frente al mensual',
      'Precio congelado por todo el año',
    ],
    ctaLabel: 'Pagar el año',
    note: 'Equivale a $ 19.917 al mes.',
    isHighlighted: false,
  },
];

/** Compra por una sola vez, para quien no quiere suscripción. */
export const oneTimeCourseCop = 89000;
