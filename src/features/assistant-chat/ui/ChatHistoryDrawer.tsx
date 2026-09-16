'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { appRoutes } from '@/shared/config';
import { cn } from '@/shared/lib';

import { fetchRecipes, groupByDate, type RecipeHistory } from '../lib/recipeHistory';

interface ChatHistoryDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  /** La conversación que se está viendo, para marcarla en la lista. */
  readonly currentRecipeId: string | null;
  readonly onPick: (id: string) => void;
  readonly onNew: () => void;
}

/**
 * El historial de conversaciones, en un panel que entra desde la izquierda.
 *
 * Vive DENTRO de `assistant-chat` a propósito: cambiar de conversación es
 * parte del chat, no otra cosa. Sacarlo a su propia feature obligaría a un
 * import lateral entre features, que CLAUDE.md prohíbe.
 *
 * Se pide la lista al ABRIR, no al montar: la mayoría de las veces nadie lo
 * abre, y traer cincuenta títulos por si acaso es gastar red de alguien que
 * está en datos móviles.
 */
export function ChatHistoryDrawer({
  isOpen,
  onClose,
  currentRecipeId,
  onPick,
  onNew,
}: ChatHistoryDrawerProps): ReactNode {
  const [history, setHistory] = useState<RecipeHistory | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let vivo = true;
    void fetchRecipes().then((lista) => {
      if (vivo) {
        setHistory(lista);
      }
    });

    return () => {
      vivo = false;
    };
  }, [isOpen]);

  // Escape cierra. Es lo que la gente intenta antes de buscar la X.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const alPulsar = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', alPulsar);
    return () => {
      window.removeEventListener('keydown', alPulsar);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const recipes = history?.recipes ?? null;
  const grupos = recipes === null ? [] : groupByDate(recipes);

  /*
    ⚠️ VA EN UN PORTAL AL `body`, Y NO ES UN LUJO (Cristian, 2026-09-16).

    Dentro de una receta, el chat vive en un panel que se anima al abrirse:
    `translate-y-0` cuando está abierto. Eso produce `transform: matrix(1, 0, 0,
    1, 0, 0)` —la identidad, no mueve nada— pero **un `transform` convierte al
    elemento en el marco de referencia de sus descendientes `fixed`**. Así que
    este `fixed inset-0` dejaba de medir la pantalla y pasaba a medir el panel:
    373×457 en la esquina en vez de 375×812 a pantalla completa.

    El cajón SÍ se abría. Solo que dibujado dentro de una caja del tamaño del
    chat, encima del propio chat, y recortado. Desde fuera se ve como "no abre"
    o "se cierra solo", que es justo lo que se reportó.

    Con el portal el nodo cuelga del `body` y no hay ancestro transformado, así
    que el panel se puede seguir animando sin romper esto. Lo mismo valdría para
    `filter`, `backdrop-filter`, `contain` o `will-change`: cualquiera de ellos
    crea el mismo marco, y el día que alguien añada uno más arriba este portal
    es lo que evita que vuelva a pasar.
  */
  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Cerrar el historial"
        onClick={onClose}
        className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm"
      />

      <aside
        aria-label="Tus conversaciones"
        className="relative flex h-full w-[86%] max-w-sm flex-col bg-cream-white shadow-raised"
      >
        <header className="flex items-center justify-between border-b border-cocoa/10 px-5 py-4">
          <h2 className="font-serif text-xl font-semibold text-forest">Tus recetas</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-2xl leading-none text-cocoa/40"
          >
            ×
          </button>
        </header>

        <div className="border-b border-cocoa/10 p-4">
          <button
            type="button"
            onClick={() => {
              onNew();
              onClose();
            }}
            className="w-full rounded-full bg-brasa px-5 py-3 font-medium text-cocoa shadow-surface transition-transform active:scale-[0.98]"
          >
            Empezar una nueva
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {recipes === null ? (
            <p className="px-1 py-6 text-sm text-cocoa/55">Buscando tus recetas…</p>
          ) : recipes.length === 0 ? (
            /*
              ⚠️ Dos vacíos distintos, y decir el equivocado hace daño.

              Si en este navegador hay conversaciones de una cuenta, no es que
              no tengas ninguna: es que no estás dentro. Enseñar "todavía no
              tienes ninguna" a alguien que sabe que sí las tenía parece que se
              perdieron, y esa fue la razón de que el historial se listara por
              navegador y acabara enseñando los títulos de una cuenta a quien
              no había entrado (2026-09-01).
            */
            history?.hasSignedInHistory === true ? (
              <div className="px-1 py-6">
                <p className="text-sm leading-relaxed text-cocoa/60">
                  Tus recetas están guardadas en tu cuenta. Entra con tu correo para
                  verlas.
                </p>
                <Link
                  href={appRoutes.login}
                  className="mt-3 inline-block rounded-full border border-cocoa/15 px-4 py-2 text-sm font-medium text-cocoa/80 transition-colors active:bg-cream"
                >
                  Entrar
                </Link>
              </div>
            ) : (
              <p className="px-1 py-6 text-sm leading-relaxed text-cocoa/60">
                Todavía no tienes ninguna. La primera pregunta que hagas abre una.
              </p>
            )
          ) : (
            grupos.map(({ label, items }) => (
              <section key={label} className="mb-4">
                <h3 className="px-1 pb-1 text-xs font-medium uppercase tracking-eyebrow text-cocoa/40">
                  {label}
                </h3>
                <ul>
                  {items.map((recipe) => {
                    const isCurrent = recipe.id === currentRecipeId;
                    return (
                      <li key={recipe.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onPick(recipe.id);
                            onClose();
                          }}
                          aria-current={isCurrent ? 'true' : undefined}
                          className={cn(
                            'w-full rounded-xl px-3 py-3 text-left text-base transition-colors active:bg-cream',
                            isCurrent
                              ? 'bg-cream font-medium text-forest'
                              : 'text-cocoa/80',
                          )}
                        >
                          {recipe.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
