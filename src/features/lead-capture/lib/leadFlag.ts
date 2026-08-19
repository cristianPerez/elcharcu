const LEAD_FLAG_KEY = 'elcharcu:lead-captured';

/**
 * Marca que este navegador ya dejó el correo.
 *
 * Ya NO decide el muro —eso lo decide la sesión, ver `useAccountSession`—;
 * queda como rastro para depurar y para medir cuántos se quedan a medio camino
 * entre dejar el correo y abrir el enlace.
 */
export function markLeadCaptured(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(LEAD_FLAG_KEY, 'true');
}
