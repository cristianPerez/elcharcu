'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { type GuidedRecipe as Recipe } from '@/entities/guided-recipe';

import { ANALYTICS_EVENTS, track } from '@/shared/lib';
import { Container } from '@/shared/ui';

import { AssistantDock } from './AssistantDock';
import { StepCard } from './StepCard';

interface GuidedRecipeProps {
  readonly recipe: Recipe;
}

/**
 * Receta guiada: el curso y el maestro en la misma pantalla.
 *
 * La apuesta del experimento es que separar "ver el curso" de "preguntar" es
 * artificial. La duda no aparece cuando terminas el video: aparece EN el paso,
 * con las manos en la carne. Así que el asistente vive al lado de los pasos y
 * cada paso trae su duda ya escrita.
 *
 * En escritorio el maestro va abierto en su columna, fijo mientras se bajan
 * los pasos. En un celular no cabe al lado y ponerlo debajo obligaba a bajar
 * las cuatro tarjetas para preguntar, así que ahí es una hoja que sube.
 */
export function GuidedRecipe({ recipe }: GuidedRecipeProps): ReactNode {
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Qué pasos lleva hechos. Un curado dura semanas y se vuelve varias veces,
  // así que lo primero al volver es saber por dónde ibas. Vive en el navegador
  // porque es una nota personal, no un dato del negocio.
  const [done, setDone] = useState<readonly string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`elcharcu:pasos:${recipe.slug}`);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setDone(parsed.filter((x): x is string => typeof x === 'string'));
        }
      }
    } catch {
      // Sin almacenamiento se empieza de cero: molesto, no roto.
    }
  }, [recipe.slug]);

  const toggleDone = (stepId: string): void => {
    setDone((current) => {
      const next = current.includes(stepId)
        ? current.filter((id) => id !== stepId)
        : [...current, stepId];
      try {
        window.localStorage.setItem(
          `elcharcu:pasos:${recipe.slug}`,
          JSON.stringify(next),
        );
      } catch {
        // Igual: el progreso se pierde, la receta no.
      }
      return next;
    });
  };

  useEffect(() => {
    track(ANALYTICS_EVENTS.guidedRecipeViewed, { recipe: recipe.slug });
  }, [recipe.slug]);

  // Tocar la duda manda la pregunta y, en móvil, abre la hoja: un solo gesto
  // del paso a la respuesta. En escritorio el chat ya está abierto y solo
  // aparece la respuesta en la columna de al lado.
  const handleAsk = (question: string): void => {
    setPendingPrompt(question);
    setIsChatOpen(true);
  };

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <header className="lg:max-w-2xl">
          <p className="text-sm font-medium text-cocoa/65">Receta guiada</p>
          <h1 className="mt-3 font-serif text-[32px] font-semibold leading-[1.1] text-forest md:text-5xl">
            {recipe.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-cocoa/70">{recipe.summary}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="text-xs text-cocoa/65">Tiempo total</dt>
              <dd className="mt-1 font-serif text-lg text-forest">{recipe.totalTime}</dd>
            </div>
            <div>
              <dt className="text-xs text-cocoa/65">Nivel</dt>
              <dd className="mt-1 font-serif text-lg text-forest">{recipe.difficulty}</dd>
            </div>
            <div>
              <dt className="text-xs text-cocoa/65">Pasos</dt>
              <dd className="mt-1 font-serif text-lg text-forest">
                {done.length} de {recipe.steps.length}
              </dd>
            </div>
          </dl>

          <div
            className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-cocoa/10"
            role="progressbar"
            aria-valuenow={done.length}
            aria-valuemin={0}
            aria-valuemax={recipe.steps.length}
            aria-label="Pasos completados"
          >
            <div
              className="h-full rounded-full bg-forest transition-all duration-500"
              style={{ width: `${String((done.length / recipe.steps.length) * 100)}%` }}
            />
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-10">
          <div className="flex flex-col gap-6">
            {recipe.steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isDone={done.includes(step.id)}
                onToggleDone={() => {
                  toggleDone(step.id);
                }}
                onAsk={handleAsk}
              />
            ))}
          </div>

          <AssistantDock
            product={recipe.name}
            isOpen={isChatOpen}
            onToggle={() => {
              setIsChatOpen((open) => !open);
            }}
            pendingPrompt={pendingPrompt}
          />
        </div>
      </div>
    </Container>
  );
}
