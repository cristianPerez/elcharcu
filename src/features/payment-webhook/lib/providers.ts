import { type PaymentProvider } from '../model/types';

import { onepay } from './onepay';

/**
 * Las pasarelas que sabemos atender. Para añadir otra: un archivo que cumpla
 * `PaymentProvider` y una línea aquí. Ni la ruta ni la base cambian.
 */
const PROVIDERS: Readonly<Record<string, PaymentProvider>> = {
  [onepay.nombre]: onepay,
};

export function providerByName(name: string): PaymentProvider | null {
  return PROVIDERS[name.toLowerCase()] ?? null;
}
