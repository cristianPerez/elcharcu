/**
 * Los topes que no se negocian.
 *
 * 2,5 g de sal de cura #1 (Prague Powder #1, 6,25 % de nitrito) por kilo de carne
 * equivalen a ~156 ppm de nitrito, que es el máximo legal del USDA para embutidos.
 * Pasarse de ahí no mejora nada y puede enfermar a alguien de verdad.
 */
export const MAX_CURE_1_G_PER_KG = 2.5;

/** Nitrito resultante del tope, en partes por millón. */
export const MAX_NITRITE_PPM = 156;

/** Palabras que indican que el número habla de sal de cura, no de sal común. */
export const CURE_TERMS: readonly string[] = [
  'sal de cura',
  'sales de cura',
  'cura #1',
  'cura #2',
  'cura 1',
  'cura 2',
  'curing salt',
  'praga',
  'prague',
  'nitrito',
  'nitrato',
  'sal nitro',
  'insta cure',
  'instacure',
];

/**
 * Palabras que indican que la frase ADVIERTE sobre esa dosis en vez de
 * recomendarla. Citar el número peligroso para explicar por qué está mal es
 * justo lo que queremos que el asistente haga: bloquearlo empobrecería la
 * respuesta en el momento en que más importa enseñar.
 */
export const WARNING_TERMS: readonly string[] = [
  'no ',
  'nunca',
  'jamás',
  'jamas',
  'máximo',
  'maximo',
  'tope',
  'peligros',
  'tóxic',
  'toxic',
  'excede',
  'excesiv',
  'más del',
  'mas del',
  'por encima',
  'riesgo',
  'evita',
  'reduce',
  'baja a',
  'error',
  'mortal',
  'triple',
  'doble',
  'demasiad',
  'prohibid',
  'ilegal',
  'enferm',
];

/** Palabras que indican que el número habla de OTRA cosa (sal común, azúcar…). */
export const NON_CURE_TERMS: readonly string[] = [
  'sal común',
  'sal comun',
  'sal marina',
  'sal fina',
  'sal gruesa',
  'sal de mesa',
  'azúcar',
  'azucar',
  'dextrosa',
  'pimienta',
  'pimentón',
  'pimenton',
  'ajo',
  'especias',
];
