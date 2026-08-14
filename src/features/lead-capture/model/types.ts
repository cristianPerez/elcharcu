/** Los datos que capturamos del visitante tras la primera pregunta. */
export interface LeadData {
  readonly name: string;
  readonly email: string;
  readonly whatsapp: string;
}

/** Estado del formulario de captura. */
export type LeadCaptureState =
  | { readonly status: 'idle' }
  | { readonly status: 'submitting' }
  | { readonly status: 'success' }
  | { readonly status: 'error'; readonly message: string };
