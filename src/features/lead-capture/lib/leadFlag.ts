const LEAD_FLAG_KEY = 'elcharcu:lead-captured';

/** ¿Este navegador ya dejó nombre, correo y WhatsApp? */
export function isLeadCaptured(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem(LEAD_FLAG_KEY) === 'true';
}

/** Marca que ya dejó los datos, para no volver a pedirlos. */
export function markLeadCaptured(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(LEAD_FLAG_KEY, 'true');
}
