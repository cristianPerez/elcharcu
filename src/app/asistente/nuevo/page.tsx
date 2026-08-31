import { permanentRedirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';

/**
 * Ruta jubilada (2026-08-30).
 *
 * Aquí vivía el onboarding anónimo: tres preguntas antes de tener cuenta. Se
 * mudó detrás del login con la migración 0016, así que este formulario ya no
 * podía guardar nada —`/api/perfil` exige sesión— y le contestaba 401 a todo el
 * que llegara desde los precios.
 *
 * Se deja como redirección permanente y no se borra: la URL lleva meses en la
 * web, en el historial de la gente y quizá en algún enlace compartido. Un 404
 * ahí es perder a alguien que venía a empezar.
 */
export default function Page(): ReactNode {
  permanentRedirect(appRoutes.start);
}
