import { type ReactNode } from 'react';

import { MAX_CURE_1_G_PER_KG } from '../model/limits';

/**
 * Qué hace El Charcu para no dar una dosis peligrosa, en palabras de cocina.
 * Lo enseñan el chat y "Mi cuenta"; el tope sale de `cure-safety`, no de aquí.
 */
export function SafetyExplainer(): ReactNode {
  const max = String(MAX_CURE_1_G_PER_KG).replace('.', ',');

  return (
    <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-cocoa-soft">
      <p>
        El Charcu acompaña tu criterio, no lo reemplaza. Nunca recomienda más de {max} g
        de sal de cura #1 por kilo, y cada respuesta pasa por un revisor de dosis antes de
        llegarte.
      </p>
      <p>Ante un moho dudoso siempre dice descartar. La decisión final es tuya.</p>
    </div>
  );
}
