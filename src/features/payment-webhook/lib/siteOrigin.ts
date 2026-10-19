/**
 * El origen al que apunta el botón del correo de bienvenida.
 *
 * ⚠️ El webhook no tiene la URL de quien pagó (lo llama OnePay, no el
 * navegador), así que se decide por el entorno: producción → www (el dominio
 * sin www redirige y se perdería el `token_hash`); develop → QA; el resto, la
 * URL de la rama de Vercel o local.
 */
export function siteOrigin(): string {
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.elcharcu.co';
  }
  if (process.env.VERCEL_GIT_COMMIT_REF === 'develop') {
    return 'https://qa.elcharcu.co';
  }
  const branchUrl = process.env.VERCEL_BRANCH_URL ?? '';
  return branchUrl === '' ? 'http://localhost:3000' : `https://${branchUrl}`;
}
