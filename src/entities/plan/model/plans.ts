import { type Plan } from './plan.types';

/**
 * Precios PROPUESTOS, en pesos colombianos y ajustables.
 * La regla dura del negocio vive en el plan Aprendiz: UNA receta completa,
 * de principio a fin, gratis y sin tarjeta. El muro aparece en la segunda.
 */
export const plans: readonly Plan[] = [
  {
    id: 'aprendiz',
    name: 'Aprendiz',
    priceCop: 0,
    billing: 'gratis',
    pitch: 'Para probar el asistente con una pieza de verdad.',
    features: [
      'Una receta completa con el asistente, de principio a fin',
      'Dosis de sal de cura revisada para esa receta',
      'Diagnóstico de moho por foto durante ese curado',
      'Dos videos de introducción de los cursos',
    ],
    ctaLabel: 'Empezar gratis',
    note: 'Sin tarjeta. En serio.',
    isHighlighted: false,
  },
  {
    id: 'mensual',
    name: 'Charcutero',
    priceCop: 29900,
    billing: 'mensual',
    pitch: 'Para el que ya cura seguido y no quiere perder una pieza más.',
    features: [
      'Recetas ilimitadas con el asistente',
      'Fotos de moho y diagnóstico sin límite',
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
    pitch: 'Un curado serio toma meses. Este plan también.',
    features: [
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
