export type SubscriptionStatus = 'free' | 'active';

export interface Subscription {
  readonly status: SubscriptionStatus;
  /**
   * Id del plan tal como lo define `entities/plan`. Se guarda como texto a
   * propósito, para no atar esta entidad a la otra.
   */
  readonly planId: string | null;
  /** ISO 8601, o null si nunca ha pagado. */
  readonly since: string | null;
}

export const FREE_SUBSCRIPTION: Subscription = {
  status: 'free',
  planId: null,
  since: null,
};

export function isSubscribed(subscription: Subscription): boolean {
  return subscription.status === 'active';
}
