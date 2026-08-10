import { geminiConfig } from './config';

export interface GeminiImage {
  readonly mimeType: string;
  /** Contenido de la imagen en base64, sin el prefijo `data:`. */
  readonly base64: string;
}

export interface GeminiTurn {
  readonly role: 'user' | 'model';
  readonly text: string;
  readonly image?: GeminiImage | undefined;
}

export type GeminiResult =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly reason: 'sin-clave' | 'error-api' | 'sin-respuesta' };

interface GeminiPart {
  readonly text?: string;
  readonly inlineData?: { readonly mimeType: string; readonly data: string };
}

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function toParts(turn: GeminiTurn): readonly GeminiPart[] {
  const parts: GeminiPart[] = [];

  if (turn.image !== undefined) {
    parts.push({
      inlineData: { mimeType: turn.image.mimeType, data: turn.image.base64 },
    });
  }

  parts.push({ text: turn.text });
  return parts;
}

/** Saca el texto de la respuesta sin confiar en su forma. */
function readAnswer(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const { candidates } = payload as { candidates?: unknown };
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return null;
  }

  const first: unknown = candidates[0];
  if (typeof first !== 'object' || first === null) {
    return null;
  }

  const { content } = first as { content?: unknown };
  if (typeof content !== 'object' || content === null) {
    return null;
  }

  const { parts } = content as { parts?: unknown };
  if (!Array.isArray(parts)) {
    return null;
  }

  const text = parts
    .map((part: unknown) =>
      typeof part === 'object' &&
      part !== null &&
      typeof (part as GeminiPart).text === 'string'
        ? (part as GeminiPart).text
        : '',
    )
    .join('')
    .trim();

  return text === '' ? null : text;
}

/** Una llamada a Gemini. Devuelve un resultado, nunca lanza. */
export async function generateAnswer(
  systemPrompt: string,
  turns: readonly GeminiTurn[],
): Promise<GeminiResult> {
  if (geminiConfig.apiKey === '') {
    return { ok: false, reason: 'sin-clave' };
  }

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: turns.map((turn) => ({ role: turn.role, parts: toParts(turn) })),
    generationConfig: {
      temperature: 0.4,
      // Ojo: los modelos "flash" de Gemini razonan antes de responder, y ese
      // razonamiento CUENTA dentro de maxOutputTokens. Con un tope bajo la
      // respuesta se corta a media frase, justo antes de dar la dosis.
      maxOutputTokens: 4000,
      // Limita cuánto razona: respuestas más rápidas y más baratas.
      thinkingConfig: { thinkingBudget: 512 },
    },
  };

  try {
    const response = await fetch(
      `${API_BASE}/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return { ok: false, reason: 'error-api' };
    }

    const payload: unknown = await response.json();
    const text = readAnswer(payload);

    return text === null ? { ok: false, reason: 'sin-respuesta' } : { ok: true, text };
  } catch {
    return { ok: false, reason: 'error-api' };
  }
}
