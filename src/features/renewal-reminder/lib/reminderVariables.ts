import { formatUsd, priceFor, proPlan } from '@/entities/plan';

import { type CheckoutUrls, type LearningSummary } from '../model/types';

import { tipForDay } from './learningTips';
import { type TemplateVariable } from './reminderTemplate';

const ZONE = 'America/Bogota';
const DAY_MS = 24 * 60 * 60 * 1000;

const dayKey = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(date);

const longDate = (date: Date): string =>
  new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

/** Último día con acceso, en Bogotá: el período acaba a medianoche, así que es el día anterior al corte. */
export function lastAccessDay(periodEnd: Date): Date {
  return new Date(periodEnd.getTime() - 1);
}

/** Días de calendario (Bogotá) entre hoy y el último día con acceso. 0 = hoy es el último. */
export function daysLeft(periodEnd: Date, now: Date): number {
  const last = Date.parse(dayKey(lastAccessDay(periodEnd)));
  const today = Date.parse(dayKey(now));
  return Math.round((last - today) / DAY_MS);
}

function whenText(days: number, last: Date): string {
  if (days <= 0) return 'hoy a medianoche';
  if (days === 1) return 'mañana a medianoche';
  return `el ${longDate(last)}`;
}

/** Texto plano (la plantilla no escapa): quita lo que pueda abrir una etiqueta. */
const plain = (text: string): string => text.replace(/[<>]/g, '').trim();

function courseText(course: LearningSummary['course']): string {
  if (course === null) {
    return 'Todavía no empezaste un curso en video: con el Pro los tienes todos, completos.';
  }
  const missing = course.total - course.done;
  const tail =
    missing <= 0
      ? 'Lo terminaste completo.'
      : missing === 1
        ? 'Te falta una sola lección.'
        : `Te faltan ${missing} lecciones.`;
  return `${plain(course.title)}: ${course.done} de ${course.total} lecciones. ${tail}`;
}

export function reminderVariables(
  summary: LearningSummary,
  links: CheckoutUrls,
  now: Date,
): Record<TemplateVariable, string> {
  const days = daysLeft(summary.periodEnd, now);
  const last = lastAccessDay(summary.periodEnd);
  const tip = tipForDay(days);
  const yearly = priceFor(proPlan, 'anual');
  const monthly = priceFor(proPlan, 'mensual');
  const topics = summary.topics.map(plain).filter((t) => t !== '');

  return {
    NOMBRE: plain(summary.name) || 'Hola',
    CUANDO: whenText(days, last),
    FECHA_FIN: longDate(last),
    PREGUNTAS: String(summary.questions),
    LECCIONES: String(summary.lessonsCompleted),
    CONVERSACIONES: String(topics.length),
    TEMAS:
      topics.length > 0
        ? topics.join(' · ')
        : 'Todavía nada: tu primera pregunta te espera.',
    CURSO: courseText(summary.course),
    DATO_TITULO: tip.title,
    DATO_TEXTO: tip.text,
    LINK_ANUAL: links.anual,
    LINK_MENSUAL: links.mensual,
    PRECIO_ANUAL:
      yearly === null
        ? ''
        : `${formatUsd(yearly.priceUsd)} al año (${formatUsd(yearly.perMonthUsd)}/mes)`,
    PRECIO_MENSUAL: monthly === null ? '' : `${formatUsd(monthly.priceUsd)} al mes`,
    NOTA_WHATSAPP:
      summary.whatsappTail === null
        ? 'Al pagar, OnePay te pide un WhatsApp. Escríbenos después con el número que usaste y activamos tu Pro en tu cuenta.'
        : `Al pagar, OnePay te pide tu WhatsApp: usa el mismo de tu cuenta (termina en ${summary.whatsappTail}) y tu Pro sigue solo, sin cortes.`,
  };
}
