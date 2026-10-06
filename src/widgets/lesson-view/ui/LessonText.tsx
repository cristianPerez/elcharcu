import { type ReactNode } from 'react';

import { bodyBlocks, inlineChunks } from '../lib/bodyBlocks';

import { LessonTable } from './LessonTable';

interface LessonTextProps {
  readonly body: string;
}

function Inline({ text }: { readonly text: string }): ReactNode {
  return inlineChunks(text).map((chunk, index) =>
    chunk.isBold ? (
      <strong key={index} className="font-semibold text-cocoa">
        {chunk.text}
      </strong>
    ) : (
      <span key={index}>{chunk.text}</span>
    ),
  );
}

/**
 * El texto de una lección: prosa con sus saltos de línea, `**negrita**` y,
 * si las trae, tablas (ver `bodyBlocks`).
 *
 * La negrita ya venía escrita en ocho lecciones de las cápsulas y se veía con
 * los asteriscos a la vista; desde el 2026-10-06 se pinta.
 */
export function LessonText({ body }: LessonTextProps): ReactNode {
  return (
    <div className="space-y-4 rounded-2xl border border-cocoa/10 bg-cream-white p-5 shadow-surface">
      {bodyBlocks(body).map((block, index) =>
        block.kind === 'table' ? (
          <LessonTable key={index} block={block} />
        ) : (
          <p
            key={index}
            className="whitespace-pre-line text-base leading-relaxed text-cocoa/80"
          >
            <Inline text={block.text} />
          </p>
        ),
      )}
    </div>
  );
}
