import { type CuringProductId } from '@/entities/curing-profile';
import { type RecipeSession } from '@/entities/recipe-session';
import { isSubscribed, type Subscription } from '@/entities/subscription';

export type GateReason = 'ya-empezada' | 'suscrito' | 'primera-gratis';

export type GateVerdict =
  { readonly kind: 'allowed'; readonly reason: GateReason } | { readonly kind: 'wall' };

/**
 * LA regla del negocio: cada cuenta se lleva UNA receta completa gratis.
 * Al empezar una SEGUNDA receta distinta aparece el muro.
 *
 * El orden de las comprobaciones importa: volver a una receta que ya estaba
 * abierta siempre pasa, aunque el usuario nunca haya pagado. Un curado dura
 * semanas y sería una traición cerrarle la puerta a mitad del proceso.
 */
export function evaluateGate(
  product: CuringProductId,
  sessions: readonly RecipeSession[],
  subscription: Subscription,
): GateVerdict {
  if (sessions.some((session) => session.product === product)) {
    return { kind: 'allowed', reason: 'ya-empezada' };
  }

  if (isSubscribed(subscription)) {
    return { kind: 'allowed', reason: 'suscrito' };
  }

  if (sessions.length === 0) {
    return { kind: 'allowed', reason: 'primera-gratis' };
  }

  return { kind: 'wall' };
}
