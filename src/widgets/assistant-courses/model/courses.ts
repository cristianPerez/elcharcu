export interface AppCourse {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly rating: string;
  /** Cuántos videos cortos tiene el curso. */
  readonly videoCount: number;
  /** Videos abiertos sin suscripción. */
  readonly freeVideoCount: number;
}

/**
 * Los cursos que ya existen en elcharcu.co, partidos en videos cortos para el
 * celular. Duplicado a propósito respecto a `widgets/master-courses`: aquel es
 * el sitio público, este es el producto — FSD prefiere duplicar antes que
 * acoplar dos slices.
 */
export const appCourses: readonly AppCourse[] = [
  {
    id: 'chorizos-del-mundo',
    name: 'Chorizos del Mundo',
    description:
      'Embutido fresco y curado de varias tradiciones, paso a paso. Empieza aquí si nunca has embutido.',
    rating: '4.9',
    videoCount: 14,
    freeVideoCount: 2,
  },
  {
    id: 'jamones-cocidos-premium',
    name: 'Jamones Cocidos Premium',
    description:
      'Jamón York y cocidos de verdad, sin fosfatos ni almidones. El que más piden los que ya venden.',
    rating: '4.8',
    videoCount: 11,
    freeVideoCount: 1,
  },
  {
    id: 'jamones-curados',
    name: 'Jamones Curados de España e Italia',
    description:
      'Curado en seco al estilo europeo: sal, tiempo y control de humedad. El más largo y el más exigente.',
    rating: '5.0',
    videoCount: 18,
    freeVideoCount: 1,
  },
];
