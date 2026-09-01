'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { AssistantChat } from '@/features/assistant-chat';
import { LeadCaptureModal, useLeadWall } from '@/features/lead-capture';
import { QuotaNotice } from '@/features/quota-wall';

import { useUsageQuota } from '@/entities/usage-quota';

import { ANALYTICS_EVENTS, cn, track } from '@/shared/lib';

interface RecipeAssistantStore {
  /**
   * Manda una duda ya escrita y abre el panel.
   *
   * `slot` dice CUÁL de las cuatro se tocó. Sin ese dato solo se sabe que
   * alguien preguntó desde una receta; con él se sabe si convierte la sal de
   * cura o el secado, que es lo que decide dónde poner la quinta duda —o cuál
   * quitar.
   */
  readonly ask: (prompt: string, slot: string) => void;
  /** `false` cuando ya no quedan preguntas este mes. */
  readonly canAsk: boolean;
}

const RecipeAssistantContext = createContext<RecipeAssistantStore | null>(null);

/**
 * El acceso a El Charcu desde cualquier punto de la receta.
 *
 * Devuelve `null` fuera del proveedor, para que un botón de duda colocado por
 * error fuera de una receta no reviente la página entera.
 */
export function useRecipeAssistant(): RecipeAssistantStore | null {
  return useContext(RecipeAssistantContext);
}

interface RecipeAssistantProviderProps {
  readonly slug: string;
  readonly name: string;
  readonly children: ReactNode;
}

/**
 * Un solo El Charcu por receta, en un panel que se abre ENCIMA de ella.
 *
 * ⚠️ Antes cada duda montaba su propio `AssistantChat` (fase 1). Eran DOS
 * conversaciones distintas en la misma página: preguntabas en los ingredientes,
 * bajabas, preguntabas en los pasos, y la segunda no sabía nada de la primera.
 * Ahora el chat se monta UNA vez aquí y las dudas solo lo abren con la pregunta
 * ya escrita.
 *
 * Y no se sale de la receta: el panel flota encima —hoja inferior en móvil,
 * tarjeta abajo a la derecha en escritorio— y la receta se queda detrás, en su
 * sitio y en su scroll. Nunca se navega a otra pantalla.
 *
 * ⚠️ El chat se queda MONTADO al cerrar, solo se esconde. Desmontarlo perdería
 * la conversación cada vez que alguien cierra el panel para releer un paso —
 * que es justo lo que va a hacer todo el mundo.
 */
export function RecipeAssistantProvider({
  slug,
  name,
  children,
}: RecipeAssistantProviderProps): ReactNode {
  const { quota, status, isKnown } = useUsageQuota();
  const wall = useLeadWall({ place: 'receta', recipeSlug: slug });
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const isExhausted = isKnown && status.isExhausted;
  /*
    ⚠️ El aviso de cupo NO se le enseña a quien todavía está detrás del muro
    (Cristian, 2026-09-01, visto en QA).

    Sin sesión, el límite que manda son las DOS preguntas del muro, no las 8 del
    plan del mes. Así que a alguien sin cuenta le salía "te quedan 2 preguntas
    este mes" cuando en realidad no podía hacer ninguna más sin dejar su correo:
    la franja contradecía al muro que tenía justo debajo.

    Y encima ofrecía "Ver planes" a quien ni siquiera ha dado un correo, que es
    saltarse un paso entero del embudo — primero el correo, después el plan
    (D16).
  */
  const showNotice = isKnown && !wall.needsAccount && status.questionsLeft <= 2;

  /*
    El freno se pone al TOCAR, no al escribir.

    Una duda se manda sola —ese es el sentido de tocarla en vez de
    escribirla— y `pendingPrompt` llama a `send` por dentro, sin pasar por
    `onBeforeSend`. Si el muro viviera solo en la caja de escribir, quien ya
    gastó su pregunta gratis entraría por aquí sin que nadie le pidiera el
    correo.
  */
  const ask = (prompt: string, slot: string): void => {
    // Se cuenta el TOQUE, pase lo que pase después. Si solo se contara cuando
    // la pregunta sale, las dudas que chocan con el muro parecerían no
    // interesarle a nadie — cuando son justo las que más interés demuestran.
    track(ANALYTICS_EVENTS.recipeDoubtTapped, { recipe_slug: slug, slot });

    if (!isExhausted && wall.needsAccount) {
      wall.open();
      return;
    }

    track(ANALYTICS_EVENTS.recipeAssistantOpened, { recipe_slug: slug, via: slot });
    setPendingPrompt(prompt);
    setIsOpen(true);
  };

  // Escape cierra, como cualquier panel. Solo se escucha mientras está abierto.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <RecipeAssistantContext.Provider value={{ ask, canAsk: !isExhausted }}>
      {children}

      {/* Aire al final para que el botón flotante no se coma la última línea
          de la receta. A media página tapar algo es normal en un botón así
          —se sigue bajando—; al final del todo no habría cómo apartarlo. */}
      <div aria-hidden="true" className="h-16 bg-cream md:h-0" />

      {/* El botón de siempre. Se esconde con el panel abierto: ya está ahí. */}
      <button
        type="button"
        onClick={() => {
          track(ANALYTICS_EVENTS.recipeAssistantOpened, {
            recipe_slug: slug,
            via: 'boton-flotante',
          });
          setIsOpen(true);
        }}
        aria-label={`Pregúntale a El Charcu sobre ${name}`}
        className={cn(
          'fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-[13px] font-medium text-cream shadow-raised transition hover:bg-forest-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 active:scale-95 md:bottom-5 md:right-5 md:px-5 md:py-3.5 md:text-sm',
          isOpen && 'pointer-events-none opacity-0',
        )}
      >
        <span aria-hidden="true">💬</span>
        Pregúntale a El Charcu
      </button>

      {/* Telón: cierra al tocar fuera y baja el ruido de la receta detrás. */}
      {isOpen ? (
        <div
          role="presentation"
          onClick={() => {
            setIsOpen(false);
          }}
          className="fixed inset-0 z-40 bg-cocoa/30 md:bg-transparent"
        />
      ) : null}

      {/*
        ⚠️ CERRADO NO ES `display:none`, y no es un capricho de estilo.

        Con `hidden`, el título de la cabecera nunca se ajustaba: `FitText` mide
        el ancho disponible, y un elemento sin caja mide 0. Peor todavía,
        comprobado en el navegador el 2026-09-01: NI `ResizeObserver` NI
        `IntersectionObserver` disparan cuando un elemento pasa de
        `display:none` a visible. La medida se hacía una vez, en blanco, y no
        se repetía nunca.

        Así que cerrado el panel SÍ tiene caja: invisible, sin recibir clics y
        fuera del árbol de accesibilidad con `inert`. Se mide bien, se anima
        gratis, y la conversación sigue montada.
      */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={`El Charcu · ${name}`}
        inert={!isOpen}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-2xl border border-cocoa/10 bg-cream-white shadow-raised transition-[opacity,transform] duration-150 md:inset-x-auto md:bottom-5 md:right-5 md:max-h-[70dvh] md:w-[26rem] md:rounded-2xl',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        {/*
          Ya no hay cabecera propia del panel: la del chat ES la cabecera
          (Cristian, 2026-09-01). Antes había dos pegadas —"Chorizo Parrillero
          Clásico" y justo debajo "Receta sin nombre"— que además se
          contradecían. Ahora la hamburguesa, el nombre de la receta y el
          cierre van en UNA línea, y el nombre se encoge hasta caber.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {showNotice ? (
            <QuotaNotice
              questionsLeft={status.questionsLeft}
              questionsLimit={quota.questionsLimit}
            />
          ) : null}

          <AssistantChat
            recipeSlug={slug}
            title={name}
            headerAction={
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                aria-label="Cerrar"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-cocoa/60 transition-colors hover:bg-cream active:bg-cream"
              >
                ×
              </button>
            }
            canSendImages={!status.areImagesExhausted}
            blockedReason={
              isExhausted ? 'Sin preguntas este mes. Vuelven el día 1.' : null
            }
            onBeforeSend={wall.block}
            pendingPrompt={pendingPrompt}
          />
        </div>
      </div>

      {wall.isOpen && !isExhausted ? (
        <LeadCaptureModal
          questionsLimit={quota.questionsLimit}
          onClose={wall.close}
          source={wall.source}
        />
      ) : null}
    </RecipeAssistantContext.Provider>
  );
}
