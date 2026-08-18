import { type GuidedRecipe } from './types';

/**
 * Receta guiada de ejemplo: bondiola curada.
 *
 * Es la prueba de una idea: que el curso y el asistente no sean dos productos
 * separados. Cada paso trae su video corto y, debajo, la pregunta que casi
 * todo el mundo hace justo ahí — ya escrita y lista para tocar.
 *
 * Ese es el punto: en un curso normal terminas el video y te quedas con la
 * duda. Aquí la duda es el siguiente botón.
 */
export const bondiolaCurada: GuidedRecipe = {
  slug: 'bondiola-curada',
  name: 'Bondiola curada',
  summary:
    'La pieza con la que casi todo el mundo empieza: perdona errores, no necesita tripa y en tres semanas ya se come.',
  totalTime: '3 a 4 semanas',
  difficulty: 'Para empezar',
  steps: [
    {
      id: 'corte',
      title: 'Escuadrar la pieza',
      summary:
        'Se le quita el exceso de grasa y se le da forma pareja. Una pieza despareja se cura despareja: por fuera queda dura y por dentro cruda.',
      video: null,
      poster: '/curso/bondiola/01-corte.jpg',
      duration: '20 minutos',
      ask: 'Mi bondiola pesa 1,8 kg y quedó despareja. ¿La escuadro más o la curo así?',
    },
    {
      id: 'sal',
      title: 'La sal y la sal de cura',
      summary:
        'Aquí es donde se arruinan las piezas. La sal de cura no se calcula a ojo: va por peso, y el tope es 2,5 g por kilo.',
      video: null,
      poster: '/curso/bondiola/02-sal.jpg',
      duration: '15 minutos',
      ask: '¿Cuánta sal común y cuánta sal de cura #1 para 1,8 kg de bondiola?',
    },
    {
      id: 'especias',
      title: 'Pimentón, ajo y pimienta',
      summary:
        'El sabor entra ahora. Las especias no conservan: eso lo hacen la sal y el tiempo. Aquí solo se decide a qué va a saber.',
      video: null,
      poster: '/curso/bondiola/03-especias.jpg',
      duration: '10 minutos',
      ask: '¿Qué especias le van a la bondiola y en qué cantidad por kilo?',
    },
    {
      id: 'colgado',
      title: 'Colgar y esperar',
      summary:
        'Tres semanas colgada, y hay que perder entre el 30% y el 40% del peso. Si se seca demasiado rápido, se forma costra y el centro queda húmedo.',
      video: null,
      poster: '/curso/bondiola/04-colgado.jpg',
      duration: '3 a 4 semanas',
      ask: '¿A qué temperatura y humedad cuelgo la bondiola, y cómo lo consigo en casa?',
    },
  ],
};
