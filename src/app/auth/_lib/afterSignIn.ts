import { type NextRequest } from 'next/server';

import { linkReceivedRecipes } from '@/entities/recipe/server';
import { linkVisitorToUser } from '@/entities/usage-quota/server';

import { readVisitorId } from '@/shared/api/visitor';

/**
 * Lo que pasa justo después de abrir sesión, venga de donde venga: el enlace
 * del correo (`/auth/callback`) o el código de 6 dígitos (`/auth/entro`).
 *
 * Vivía dentro del callback; salió de ahí el 2026-10-30, cuando el código se
 * sumó como segunda puerta. Las dos tienen que hacer EXACTAMENTE lo mismo, o
 * quien entra con código pierde su cupo anónimo o no ve el onboarding.
 */

interface SignedInUser {
  readonly created_at?: string;
}

/**
 * Marca en la URL si esta entrada estrena cuenta o es alguien que vuelve.
 *
 * ⚠️ ESTE ES EL ÚNICO MOMENTO EN QUE SE PUEDE SABER, y es a propósito.
 * Preguntarle al servidor "¿existe este correo?" mientras se escribe en el muro
 * es justo lo que permite enumerar los usuarios de un sitio, y Supabase se
 * niega a contestarlo. Aquí ya abrió el enlace (o escribió el código) que le
 * llegó a su buzón: la cuenta es demostrablemente suya y decirlo no le abre la
 * puerta a nadie.
 *
 * Cómo se distingue: `created_at` es cuando se pidió el correo por primera vez
 * y `last_sign_in_at` es ahora mismo. En una cuenta recién nacida esos dos
 * momentos están a segundos; en alguien que vuelve, el alta es de días o
 * semanas atrás. El enlace y el código caducan en una hora, así que no hay zona
 * gris — para caer del lado equivocado habría que haberse dado de alta hace
 * menos de una hora, que es precisamente ser nuevo.
 */
export function conEntrada(next: string, user: SignedInUser | null): string {
  const esNueva = esCuentaNueva(user);
  if (esNueva === null) {
    return next;
  }

  const url = new URL(next, 'https://x.invalid');
  url.searchParams.set('entrada', esNueva ? 'nueva' : 'vuelve');
  return `${url.pathname}${url.search}`;
}

export function esCuentaNueva(user: SignedInUser | null | undefined): boolean | null {
  if (user?.created_at === undefined) {
    return null;
  }
  const nacio = new Date(user.created_at).getTime();
  return Number.isFinite(nacio) && Date.now() - nacio < 60 * 60 * 1000;
}

/**
 * Lo que hizo de anónimo pasa a ser suyo: cupo, recetas y onboarding.
 *
 * Vive en el único momento en que alguien deja de ser anónimo, y no en
 * `/api/cupo` como antes. Allí se ejecutaba en cada llamada —o sea, en cada
 * cambio de pestaña— y eran dos escrituras a la base para volver a atar lo que
 * ya estaba atado desde el primer segundo.
 *
 * Si algo falla no se corta la entrada. Perder el rastro anónimo es una
 * molestia; dejar a alguien fuera de su cuenta con el enlace del correo ya
 * gastado es mucho peor.
 */
export async function adoptAnonymousTrail(
  request: NextRequest,
  userId: string | null,
): Promise<void> {
  if (userId === null) {
    return;
  }

  const visitorId = readVisitorId(request);
  if (visitorId === null) {
    return;
  }

  /*
    Solo queda atar el rastro del cupo. El `link_onboarding_to_user` que iba
    aquí se fue con `charcu.onboarding_answers` (2026-08-31): esa tabla existía
    para guardar respuestas de alguien SIN cuenta, y el onboarding se mudó
    detrás del login en la 0016. Desde entonces no la escribía nadie.
  */
  await linkVisitorToUser(visitorId, userId);

  // Y las recetas que abrió por link sin cuenta pasan a "Las que te llegaron"
  // de su cuenta (2026-10-07). Si falla, no corta la entrada.
  await linkReceivedRecipes(visitorId, userId).catch(() => {});
}
