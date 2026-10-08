import { appRoutes } from '@/shared/config';

/**
 * `/` enseña lo mismo que `/cursos` (Cursos es el inicio), así que para marcar
 * la pestaña activa cuenta como Cursos.
 */
export function activePath(pathname: string): string {
  return pathname === '/' ? appRoutes.appCourses : pathname;
}
