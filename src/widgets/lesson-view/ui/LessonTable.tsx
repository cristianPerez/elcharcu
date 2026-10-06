import { type ReactNode } from 'react';

import { cn } from '@/shared/lib';

import { inlineChunks, type BodyBlock } from '../lib/bodyBlocks';

type TableBlock = Extract<BodyBlock, { kind: 'table' }>;

interface LessonTableProps {
  readonly block: TableBlock;
}

/** "🧂 Sal fina" → el emoji aparte, para que todos los nombres arranquen en la misma columna. */
const LEADING_EMOJI = /^(\p{Extended_Pictographic}\uFE0F?)\s+(.+)$/u;

/** Una fila es de total cuando su primera celda va ENTERA en negrita: `**TOTAL**`. */
function isTotalRow(row: readonly string[]): boolean {
  const first = row[0] ?? '';
  return /^\*\*[^*]+\*\*$/.test(first);
}

function Inline({ text }: { readonly text: string }): ReactNode {
  return inlineChunks(text).map((chunk, index) =>
    chunk.isBold ? (
      <strong key={index} className="font-semibold">
        {chunk.text}
      </strong>
    ) : (
      <span key={index}>{chunk.text}</span>
    ),
  );
}

function FirstCell({ text }: { readonly text: string }): ReactNode {
  const match = LEADING_EMOJI.exec(text);
  if (match === null) {
    return <Inline text={text} />;
  }
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="w-5 shrink-0 text-center text-lg leading-none">
        {match[1]}
      </span>
      <span>
        <Inline text={match[2] ?? ''} />
      </span>
    </span>
  );
}

/**
 * Una tabla dentro del texto de una lección (2026-10-06).
 *
 * Pensada para lo que de verdad lleva: ingredientes y gramos. Por eso:
 * - la primera columna separa el emoji del nombre, y los nombres quedan
 *   alineados aunque cada emoji tenga su ancho;
 * - la SEGUNDA columna es la que manda (la dosis por kilo) y va resaltada;
 *   las siguientes, más suaves;
 * - las filas alternan fondo, porque con diez ingredientes el ojo se salta
 *   de renglón al cruzar al número;
 * - la fila de total (primera celda entera en negrita) se separa abajo.
 */
export function LessonTable({ block }: LessonTableProps): ReactNode {
  const last = block.rows[block.rows.length - 1];
  const total = last !== undefined && isTotalRow(last) ? last : null;
  const rows = total === null ? block.rows : block.rows.slice(0, -1);

  const cellClass = (column: number): string =>
    cn(
      'px-2 py-2.5 sm:px-3',
      block.alignRight[column] === true
        ? 'w-px whitespace-nowrap text-right tabular-nums'
        : 'text-left',
    );

  const valueTone = (column: number): string =>
    column === 1
      ? 'font-semibold text-forest'
      : column > 1
        ? 'text-cocoa/55'
        : 'text-cocoa';

  return (
    <div className="-mx-2 overflow-x-auto rounded-xl border border-cocoa/10 sm:mx-0">
      <table className="w-full border-collapse text-[0.9rem] sm:text-[0.95rem]">
        <thead>
          <tr className="bg-forest text-cream-white">
            {block.header.map((cell, column) => (
              <th
                key={column}
                scope="col"
                className={cn(cellClass(column), 'text-sm font-semibold')}
              >
                <Inline text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="even:bg-cream">
              {row.map((cell, column) => (
                <td key={column} className={cn(cellClass(column), valueTone(column))}>
                  {column === 0 ? <FirstCell text={cell} /> : <Inline text={cell} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {total === null ? null : (
          <tfoot>
            <tr className="border-t-2 border-brasa-dark/30 bg-capsule-current font-semibold text-cocoa">
              {total.map((cell, column) => (
                <td key={column} className={cellClass(column)}>
                  {column === 0 ? (
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="w-5 shrink-0" />
                      <Inline text={cell} />
                    </span>
                  ) : (
                    <Inline text={cell} />
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
