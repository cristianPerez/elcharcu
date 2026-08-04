export interface Pain {
  readonly id: string;
  /** La pregunta tal como la hace el usuario, en su idioma. */
  readonly question: string;
  readonly answer: string;
}

/**
 * Las dudas recurrentes reales del oficio, en primera persona.
 * No son "features": son las frases con las que la gente llega asustada.
 */
export const pains: readonly Pain[] = [
  {
    id: 'sal-de-cura',
    question: '¿Cuánta sal de cura le pongo a esto?',
    answer:
      'La dosis exacta para tus kilos, la diferencia entre la #1 y la #2, y un techo que el asistente no cruza nunca por más que se lo pidas.',
  },
  {
    id: 'moho',
    question: '¿Este moho blanco es bueno o boto todo?',
    answer:
      'Le mandas la foto y te responde una de dos cosas: sigue tranquilo, o para y descarta. Ante la duda, siempre se va por lo seguro.',
  },
  {
    id: 'cuevas',
    question: 'Lo corté y tiene cuevas por dentro.',
    answer:
      'Ojos, bolsas de aire y embutido flojo: por qué te pasó esta vez y qué cambiar para que la próxima quede compacto.',
  },
  {
    id: 'encostramiento',
    question: 'Se secó por fuera y quedó crudo por dentro.',
    answer:
      'Encostramiento. Cómo frenar el secado con la humedad y la temperatura que de verdad tienes en tu casa, no las del video.',
  },
  {
    id: 'color',
    question: 'Quedó café por dentro, no rojo.',
    answer:
      'Qué falló en el curado, si se puede corregir a tiempo, y —lo importante— si eso todavía se come o no.',
  },
  {
    id: 'costo',
    question: '¿A cómo tengo que vender cada porción?',
    answer:
      'Costo real por porción con tus precios de carne, y un precio de venta sugerido. Para el que ya pasó de hobby a negocio.',
  },
];
