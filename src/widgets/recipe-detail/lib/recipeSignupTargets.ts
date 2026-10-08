import { type SignupRequest } from '@/features/auth-by-email';

import { type Course } from '@/entities/course';

/**
 * Lo que abre la hoja de crear cuenta al final de una receta, sin cuenta: el
 * curso que la enseña y la cápsula con la que termina (diseño final 07).
 */
export function recipeSignupTargets(
  course: Course | null,
  capsule: Course | null,
  capsuleIndex: number,
  capsuleCount: number,
): SignupRequest[] {
  const targets: SignupRequest[] = [];
  if (course !== null) {
    const isFree = course.access === 'libre';
    targets.push({
      trigger: isFree ? 'curso_gratis' : 'curso',
      eyebrow: isFree ? 'Curso gratis' : 'Curso maestro',
      title: course.title,
      image: course.coverUrl,
      destination: `/cursos/${course.slug}`,
      returnLabel: `el curso ${course.title}`,
    });
  }
  if (capsule !== null) {
    const number = String(capsuleIndex + 1);
    targets.push({
      trigger: 'capsula',
      eyebrow: 'Cápsula gratis',
      title: capsule.title,
      badge: number,
      counter: `${number} de ${String(capsuleCount)}`,
      image: capsule.coverUrl,
      destination: `/cursos/${capsule.slug}`,
      returnLabel: `la cápsula ${number}`,
    });
  }
  return targets;
}
