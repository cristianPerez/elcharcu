import {
  FREE_SUBSCRIPTION,
  type Subscription,
  type SubscriptionStatus,
} from '../model/subscription.types';

/**
 * Estado de la suscripción.
 *
 * ⚠️ TEMPORAL: hoy vive en el navegador. Cuando entre la pasarela de pago, este
 * archivo pasa a leer el estado que escriba el webhook en Supabase — y solo
 * entonces el muro será infranqueable. Ningún otro archivo toca el guardado.
 */
const STORAGE_KEY = 'elcharcu:subscription';

function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return value === 'free' || value === 'active';
}

function parseSubscription(value: unknown): Subscription | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate: Record<string, unknown> = { ...value };
  const { status, planId, since } = candidate;

  if (!isSubscriptionStatus(status)) {
    return null;
  }

  return {
    status,
    planId: typeof planId === 'string' ? planId : null,
    since: typeof since === 'string' ? since : null,
  };
}

/** Devuelve siempre una suscripción: si no hay nada guardado, la gratuita. */
export function loadSubscription(): Subscription {
  if (typeof window === 'undefined') {
    return FREE_SUBSCRIPTION;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return FREE_SUBSCRIPTION;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return parseSubscription(parsed) ?? FREE_SUBSCRIPTION;
  } catch {
    return FREE_SUBSCRIPTION;
  }
}

export function saveSubscription(subscription: Subscription): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
}
