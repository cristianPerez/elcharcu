/**
 * Credenciales de Supabase.
 *
 * La `publishableKey` es pública a propósito: va al navegador y no da acceso a
 * nada por sí sola, porque los permisos por fila (RLS) mandan sobre ella.
 * La clave SECRETA nunca se lee aquí — solo en código de servidor.
 */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
} as const;

/**
 * Permite que la app arranque sin credenciales en vez de reventar.
 * Mientras sea `false`, las pantallas de cuenta muestran un aviso claro.
 */
export function isSupabaseConfigured(): boolean {
  return supabaseConfig.url !== '' && supabaseConfig.publishableKey !== '';
}
