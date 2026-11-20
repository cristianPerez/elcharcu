/** Lo que una persona hizo durante su período de Pro, leído de la base. */
export interface LearningSummary {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  /** Últimos 4 dígitos del WhatsApp del perfil, si lo tiene. */
  readonly whatsappTail: string | null;
  readonly periodEnd: Date;
  readonly questions: number;
  readonly lessonsCompleted: number;
  /** Títulos de sus conversaciones con El Charcu (cada una es una receta o duda). */
  readonly topics: readonly string[];
  /** El curso donde más avanzó, con cuántas lecciones lleva de cuántas. */
  readonly course: {
    readonly title: string;
    readonly done: number;
    readonly total: number;
  } | null;
}

export interface CheckoutUrls {
  readonly anual: string;
  readonly mensual: string;
}

export interface ReminderResult {
  readonly userId: string;
  readonly to: string;
  readonly sent: boolean;
  readonly reason?: string;
}
