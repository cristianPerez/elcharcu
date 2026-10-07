import { type SignupRequest } from '@/features/auth-by-email';

import { type Course } from '@/entities/course';

/**
 * Qué abre la hoja de crear cuenta al tocarse en la portada sin cuenta, y con
 * qué título (diseño final 03–06): "Cápsula 1 · Qué saber de la sal de cura",
 * "Curso gratis · Lomo de cerdo curado". El destino es la cápsula o el curso:
 * a eso vuelve el enlace del correo.
 */
export function signupTargetsFor(
  capsules: readonly Course[],
  masters: readonly Course[],
): readonly SignupRequest[] {
  const capsuleTargets = capsules.map((capsule, index): SignupRequest => {
    const number = String(index + 1);
    return {
      trigger: 'capsula',
      eyebrow: 'Cápsula gratis',
      title: capsule.title,
      badge: number,
      counter: `${number} de ${String(capsules.length)}`,
      image: capsule.coverUrl,
      destination: `/cursos/${capsule.slug}`,
      returnLabel: `la cápsula ${number}`,
    };
  });

  const courseTargets = masters.map((course): SignupRequest => {
    const isFree = course.access === 'libre';
    return {
      trigger: isFree ? 'curso_gratis' : 'curso',
      eyebrow: isFree ? 'Curso gratis' : 'Curso maestro',
      title: course.title,
      image: course.coverUrl,
      destination: `/cursos/${course.slug}`,
      returnLabel: `el curso ${course.title}`,
    };
  });

  return [...capsuleTargets, ...courseTargets];
}
