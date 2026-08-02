import tablaDeQuesosD1 from '../tablas/tabla-de-quesos-d1.json';

import { type Tabla, type TablaSummary } from './types';

/**
 * Tablas cargadas desde `entities/tabla/tablas/*.json` vía import estático
 * (resolveJsonModule): tipado en compilación contra `Tabla` — sin `any`, sin
 * validación en runtime — e isomórfico (server y client).
 * Para añadir una tabla: crea el `.json` y regístrala en esta lista.
 */
const tablas: readonly Tabla[] = [tablaDeQuesosD1];

export function getTablas(): readonly Tabla[] {
  return tablas;
}

export function getTablaBySlug(slug: string): Tabla | undefined {
  return tablas.find((tabla) => tabla.slug === slug);
}

export function getTablaSummaries(): readonly TablaSummary[] {
  return tablas.map(({ slug, name, description, image, tags }) => ({
    slug,
    name,
    description,
    image,
    tags,
  }));
}

/** Lista única y ordenada de todas las etiquetas, para el filtro de la página. */
export function getAllTablaTags(): readonly string[] {
  return [...new Set(tablas.flatMap((tabla) => tabla.tags))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}
