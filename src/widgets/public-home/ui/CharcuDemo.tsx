'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent, type ReactNode } from 'react';

import { appRoutes } from '@/shared/config';
import { Eyebrow, IconArrowRight, IconCharcu } from '@/shared/ui';

const CHIPS = ['Le salió moho, ¿lo salvo?', '¿Qué humedad necesito?'] as const;

/**
 * "Pruébalo ahora" (diseño final 01/02): una conversación de muestra y una
 * caja de verdad. Lo que se escriba abre El Charcu con la pregunta ya enviada
 * (`/charcu?pregunta=`), que sin cuenta contesta dos preguntas gratis.
 */
export function CharcuDemo(): ReactNode {
  const router = useRouter();
  const inputId = useId();
  const [text, setText] = useState('');

  const ask = (question: string): void => {
    const clean = question.trim();
    if (clean !== '') {
      router.push(`${appRoutes.appAssistant}?pregunta=${encodeURIComponent(clean)}`);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    ask(text);
  };

  return (
    <section className="mx-auto grid w-full max-w-app gap-6 px-5 md:grid-cols-[1fr_1.25fr] md:items-center md:gap-12 md:px-8">
      <div>
        <Eyebrow className="text-brasa-tinta">Pruébalo ahora</Eyebrow>
        <h2 className="mt-3 font-serif text-[26px] font-semibold leading-tight text-forest md:text-[30px]">
          Y cuando tengas una duda, pregúntale a El Charcu.
        </h2>
        <p className="mt-3 hidden text-cocoa-soft md:block">
          Dosis de sal de cura, humedad, mohos y tiempos. Si quieres, con una foto de tu
          pieza.
        </p>
      </div>

      <div className="rounded-[20px] border border-cocoa/10 bg-cream-white p-4 shadow-surface md:p-5">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-forest px-4 py-2.5 text-[15px] text-cream-white">
          ¿Cuánta sal de cura para 2 kg?
        </p>
        <div className="mt-3 flex gap-3">
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-forest text-brasa"
          >
            <IconCharcu size={15} />
          </span>
          <p className="text-[15px] leading-relaxed text-cocoa">
            Con sal de cura #1, <strong>5 g para 2 kg</strong> de carne (2,5 g por kilo).
            Pésala aparte
            <span className="hidden md:inline">
              {' '}
              y mézclala con la sal común antes de agregarla
            </span>
            .
          </p>
        </div>
        <div className="mt-3 hidden flex-wrap gap-2 md:flex">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => ask(chip)}
              className="min-h-9 rounded-full border border-cocoa/15 px-3 text-sm text-cocoa-soft hover:bg-cream"
            >
              {chip}
            </button>
          ))}
        </div>
        <form
          onSubmit={onSubmit}
          className="mt-4 flex items-center gap-2 rounded-full border border-cocoa/15 bg-cream py-1.5 pl-4 pr-1.5 focus-within:border-forest"
        >
          <label htmlFor={inputId} className="sr-only">
            Escribe tu duda
          </label>
          <input
            id={inputId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escribe tu duda…"
            className="min-h-10 flex-1 bg-transparent text-[15px] text-cocoa outline-none placeholder:text-cocoa-muted"
          />
          <button
            type="submit"
            aria-label="Preguntarle a El Charcu"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-brasa text-cocoa transition-colors hover:bg-brasa-dark"
          >
            <IconArrowRight size={18} className="-rotate-90" />
          </button>
        </form>
        <p className="mt-2 text-xs text-cocoa-soft">
          2 preguntas gratis, sin registrarte
        </p>
      </div>
    </section>
  );
}
