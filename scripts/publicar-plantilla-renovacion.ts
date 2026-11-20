/**
 * Sube a Resend la plantilla "tu mes de Pro termina" y la publica.
 *
 *     npx tsx scripts/publicar-plantilla-renovacion.ts <ruta/.env>
 *
 * La fuente es `features/renewal-reminder/lib/reminderTemplate.ts`. Si ya
 * existe una plantilla con el mismo alias, la actualiza; si no, la crea.
 * Solo usa RESEND_API_KEY y RESEND_FROM del archivo que se le pasa.
 */
import { readFileSync } from 'node:fs';

import {
  TEMPLATE_ALIAS,
  TEMPLATE_HTML,
  TEMPLATE_SUBJECT,
  TEMPLATE_TEXT,
  TEMPLATE_VARIABLES,
} from '../src/features/renewal-reminder/lib/reminderTemplate';

function env(path: string): Record<string, string> {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => {
        const i = l.indexOf('=');
        return [
          l.slice(0, i),
          l
            .slice(i + 1)
            .trim()
            .replace(/^["']|["']$/g, ''),
        ];
      }),
  );
}

async function main(): Promise<void> {
  const vars = env(process.argv[2] ?? '.env.prod');
  const headers = {
    Authorization: `Bearer ${vars.RESEND_API_KEY ?? ''}`,
    'Content-Type': 'application/json',
  };
  const body = {
    name: 'El Charcu · Renovación del Pro',
    alias: TEMPLATE_ALIAS,
    from: vars.RESEND_FROM,
    subject: TEMPLATE_SUBJECT,
    html: TEMPLATE_HTML,
    text: TEMPLATE_TEXT,
    variables: TEMPLATE_VARIABLES.map((key) => ({ key, type: 'string' })),
  };

  const existing = await fetch(`https://api.resend.com/templates/${TEMPLATE_ALIAS}`, {
    headers,
  });
  const saved = await fetch(
    existing.ok
      ? `https://api.resend.com/templates/${TEMPLATE_ALIAS}`
      : 'https://api.resend.com/templates',
    { method: existing.ok ? 'PATCH' : 'POST', headers, body: JSON.stringify(body) },
  );
  const savedBody: unknown = await saved.json();
  console.log(existing.ok ? 'actualizada' : 'creada', saved.status, savedBody);
  if (!saved.ok) process.exit(1);

  const published = await fetch(
    `https://api.resend.com/templates/${TEMPLATE_ALIAS}/publish`,
    {
      method: 'POST',
      headers,
    },
  );
  console.log('publicada', published.status, await published.text());
  if (!published.ok) process.exit(1);
}

void main();
