import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { Container } from '@/shared/ui';

type Tone = 'cream' | 'forest' | 'forest-dark';

interface RecipeSectionProps {
  readonly tone?: Tone;
  /** Se pega a la sección de arriba: sin aire por encima. */
  readonly tight?: boolean;
  readonly children: ReactNode;
}

const TONES: Record<Tone, string> = {
  cream: 'bg-cream text-cocoa',
  forest: 'bg-grain bg-forest text-cream',
  'forest-dark': 'bg-grain bg-forest-dark text-cream',
};

/**
 * El ritmo vertical de la receta, en un solo sitio.
 *
 * ⚠️ Antes cada sección repetía a mano `py-16 md:py-24`, siete veces. Dos
 * problemas de golpe:
 *
 *   · **Se copiaba mal.** Una decía `py-12`, otra `pb-16` sin `pt`, y nadie
 *     podía cambiar el ritmo de la página sin tocar siete archivos.
 *   · **64 px arriba y abajo de CADA sección es demasiado en un móvil.** En una
 *     pantalla de 375×812, dos secciones seguidas gastaban 128 px en nada —
 *     casi un sexto del alto— y el contenido acababa pareciendo trozos sueltos
 *     flotando en vez de una receta seguida.
 *
 * Ahora el aire es 40 px en móvil y 80 en escritorio. Se respira igual en
 * pantalla grande y en el teléfono deja de haber que hacer scroll sobre verde
 * vacío para llegar a lo siguiente.
 */
export function RecipeSection({
  tone = 'cream',
  tight = false,
  children,
}: RecipeSectionProps): ReactNode {
  return (
    <section className={cn(TONES[tone], tight ? 'pb-10 md:pb-20' : 'py-10 md:py-20')}>
      <Container>{children}</Container>
    </section>
  );
}
