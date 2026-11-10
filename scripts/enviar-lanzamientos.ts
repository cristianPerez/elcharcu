/**
 * Manda los correos de captación de noviembre 2026, o los dibuja en archivos
 * para revisarlos antes.
 *
 * Hay DOS grupos y el script obliga a nombrar uno: `lanzamientos` (York y
 * Carlos Andrés, **ya enviados el 10 nov**) y `seguimiento` (Maribel, Hazel y
 * Antuko). Así no hay forma de reenviarle a York por repetir un comando.
 *
 *     # 1. verlos sin mandar nada
 *     npx tsx scripts/enviar-lanzamientos.ts .env.prod seguimiento --vista-previa reportes/upsell/vista
 *
 *     # 2. mandarlos a UNA dirección de revisión (todos, a esa misma)
 *     npx tsx scripts/enviar-lanzamientos.ts .env.prod seguimiento --revision cperez354@gmail.com
 *
 *     # 3. mandarlos a los destinatarios de verdad (hay que escribir --de-verdad)
 *     npx tsx scripts/enviar-lanzamientos.ts .env.prod seguimiento --de-verdad
 *
 * El modo 3 es el único que escribe a gente real, y por eso pide esa palabra
 * aparte: ninguna otra combinación de argumentos puede acabar en un envío.
 */
import { readFileSync, writeFileSync } from 'node:fs';

import { launches, type Launch } from './lanzamientos/correos';
import { resto } from './lanzamientos/resto';
import { followUps } from './lanzamientos/seguimiento';

const GROUPS: Record<string, readonly Launch[]> = {
  lanzamientos: launches,
  seguimiento: followUps,
  resto,
};

function loadEnv(path: string): void {
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = /^([A-Z_]+)=(.*)$/.exec(line);
    if (match?.[1] !== undefined && match[2] !== undefined) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function main(): Promise<void> {
  const [envPath, group, mode, value] = process.argv.slice(2);
  const emails = group === undefined ? undefined : GROUPS[group];
  if (envPath === undefined || emails === undefined || mode === undefined) {
    console.error(
      `uso: enviar-lanzamientos.ts <.env> <${Object.keys(GROUPS).join(' | ')}> --vista-previa <carpeta/prefijo> | --revision <correo> | --de-verdad`,
    );
    process.exit(1);
  }
  loadEnv(envPath);

  if (mode === '--vista-previa') {
    const prefix = value ?? '/tmp/lanzamiento';
    for (const l of emails) {
      writeFileSync(`${prefix}-${l.slug}.html`, l.html);
      console.log(`${l.slug}: "${l.subject}" → ${prefix}-${l.slug}.html`);
    }
    console.log('\nNo se mandó nada.');
    return;
  }

  const { sendEmail } = await import('../src/shared/api/email');
  const day = new Date().toISOString().slice(0, 10);

  if (mode === '--revision') {
    if (value === undefined) {
      console.error('--revision necesita el correo de quien revisa');
      process.exit(1);
    }
    for (const l of emails) {
      const result = await sendEmail({
        to: value,
        subject: `[REVISIÓN · iría a ${l.to}] ${l.subject}`,
        html: l.html,
        text: `REVISIÓN — este correo iría a ${l.nombre} <${l.to}>.\n\n${l.text}`,
      });
      console.log(
        result.sent ? `✓ ${l.slug} → ${value}` : `✗ ${l.slug}: ${result.reason}`,
      );
    }
    return;
  }

  if (mode === '--de-verdad') {
    for (const l of emails) {
      const result = await sendEmail({
        to: l.to,
        subject: l.subject,
        html: l.html,
        text: l.text,
      });
      console.log(
        result.sent
          ? `✓ ${l.nombre} <${l.to}> · ${day}`
          : `✗ ${l.nombre} <${l.to}>: ${result.reason}`,
      );
    }
    return;
  }

  console.error(`modo desconocido: ${mode}`);
  process.exit(1);
}

void main();
