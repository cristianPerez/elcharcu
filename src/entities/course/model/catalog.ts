/**
 * Las categorías y técnicas del catálogo, con su nombre para la pantalla.
 *
 * Los `id` son los del `check` de `charcu.courses` (migración 0029) y viajan en
 * la URL (`?categoria=chorizos`), así que NO se renombran una vez publicados.
 */

export const COURSE_CATEGORIES = [
  { id: 'chorizos', label: 'Chorizos' },
  { id: 'jamones-curados', label: 'Jamones curados' },
  { id: 'jamones-cocidos', label: 'Jamones cocidos' },
  { id: 'embutidos-frescos', label: 'Embutidos frescos' },
  { id: 'quesos', label: 'Quesos' },
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]['id'];

export const COURSE_TECHNIQUES = [
  { id: 'embutir-amarrar', label: 'Embutir y amarrar', hint: 'Tripa, bridado, nudos' },
  { id: 'curado', label: 'Curado', hint: 'Sal de cura, humedad, mohos' },
  { id: 'ahumado', label: 'Ahumado', hint: 'Maderas, frío y caliente' },
  { id: 'coccion', label: 'Cocción', hint: 'Barril, horno, temperaturas' },
] as const;

export type CourseTechnique = (typeof COURSE_TECHNIQUES)[number]['id'];

const CATEGORY_IDS: ReadonlySet<string> = new Set(COURSE_CATEGORIES.map((c) => c.id));
const TECHNIQUE_IDS: ReadonlySet<string> = new Set(COURSE_TECHNIQUES.map((t) => t.id));

export function isCourseCategory(value: unknown): value is CourseCategory {
  return typeof value === 'string' && CATEGORY_IDS.has(value);
}

export function isCourseTechnique(value: unknown): value is CourseTechnique {
  return typeof value === 'string' && TECHNIQUE_IDS.has(value);
}

export function categoryLabel(id: CourseCategory): string {
  return COURSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function techniqueLabel(id: CourseTechnique): string {
  return COURSE_TECHNIQUES.find((t) => t.id === id)?.label ?? id;
}

const LEVEL_LABELS = {
  'para-empezar': 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
} as const;

export function levelLabel(level: keyof typeof LEVEL_LABELS): string {
  return LEVEL_LABELS[level];
}

/** El dibujo de cada cápsula (0033). El trazo vive en `CapsuleDrawing`. */
export const CAPSULE_ICONS = ['sal', 'bascula', 'jamon', 'chorizo', 'amarre'] as const;

export type CapsuleIcon = (typeof CAPSULE_ICONS)[number];

export function isCapsuleIcon(value: unknown): value is CapsuleIcon {
  return CAPSULE_ICONS.some((icon) => icon === value);
}
