import { Fragment, type ReactNode } from 'react';

interface HighlightProps {
  readonly text: string;
  readonly term: string;
}

/** Quita tildes y mayúsculas para comparar: "jamon" encuentra "Jamón". */
export function foldText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Resalta el término buscado dentro de un texto.
 *
 * Compara sin tildes pero PINTA el texto original: plegar letra a letra deja
 * las posiciones intactas porque cada letra con tilde se vuelve exactamente una
 * sin tilde. Sin `dangerouslySetInnerHTML`: el término lo escribe el usuario.
 */
export function Highlight({ text, term }: HighlightProps): ReactNode {
  const needle = foldText(term.trim());
  if (needle === '') {
    return text;
  }

  const folded = foldText(text);
  if (folded.length !== text.length) {
    return text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  let index = folded.indexOf(needle);

  while (index !== -1) {
    if (index > cursor) {
      parts.push(<Fragment key={`t${cursor}`}>{text.slice(cursor, index)}</Fragment>);
    }
    parts.push(
      <mark key={`m${index}`} className="rounded-sm bg-highlight px-0.5 text-inherit">
        {text.slice(index, index + needle.length)}
      </mark>,
    );
    cursor = index + needle.length;
    index = folded.indexOf(needle, cursor);
  }

  if (cursor < text.length) {
    parts.push(<Fragment key={`t${cursor}`}>{text.slice(cursor)}</Fragment>);
  }

  return parts;
}
