'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib';
import { IconBell, IconCourses, Toggle, type IconProps } from '@/shared/ui';

import { patchProfile, type ProfilePatch } from '../api/profileApi';

export interface NotificationValues {
  readonly stepReminders: boolean;
  readonly newCourses: boolean;
  readonly news: boolean;
}

type Key = keyof NotificationValues;

const ROWS: readonly {
  readonly key: Key;
  readonly field: keyof ProfilePatch;
  readonly label: string;
  readonly hint: string;
  readonly Icon: (props: IconProps) => ReactNode;
}[] = [
  {
    key: 'stepReminders',
    field: 'notifyStepReminders',
    label: 'Recordatorios de pasos',
    hint: '“Hoy toca embutir tu longaniza”',
    Icon: IconBell,
  },
  {
    key: 'newCourses',
    field: 'notifyNewCourses',
    label: 'Avisos de cursos nuevos',
    hint: 'Cuando abra uno que pediste',
    Icon: IconCourses,
  },
  {
    key: 'news',
    field: 'notifyNews',
    label: 'Correo con novedades',
    hint: 'Recetas y cápsulas nuevas',
    Icon: IconBell,
  },
];

interface NotificationTogglesProps {
  readonly initial: NotificationValues;
  /** Con iconos a la izquierda (la lista de ajustes del celular). */
  readonly withIcons?: boolean | undefined;
}

/**
 * Los avisos que quiere recibir. Cada interruptor se guarda al tocarlo.
 *
 * ⚠️ Hoy NINGUNO envía nada (0031): solo se guarda la preferencia, para que el
 * día que exista el envío ya sepa a quién no molestar.
 */
export function NotificationToggles({
  initial,
  withIcons = false,
}: NotificationTogglesProps): ReactNode {
  const [values, setValues] = useState<NotificationValues>(initial);
  const [failed, setFailed] = useState<Key | null>(null);

  async function change(
    key: Key,
    field: keyof ProfilePatch,
    next: boolean,
  ): Promise<void> {
    setValues((current) => ({ ...current, [key]: next }));
    setFailed(null);
    const ok = await patchProfile({ [field]: next });
    if (!ok) {
      setValues((current) => ({ ...current, [key]: !next }));
      setFailed(key);
    }
  }

  return (
    <ul className="divide-y divide-cocoa/10">
      {ROWS.map(({ key, field, label, hint, Icon }) => (
        <li
          key={key}
          className={cn('flex items-center gap-3 py-2', withIcons && 'px-4 md:px-0')}
        >
          {withIcons ? (
            <Icon size={20} className="shrink-0 text-cocoa md:hidden" />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-[15px] text-cocoa">{label}</p>
            <p
              className="text-[13px] text-cocoa-soft"
              role={failed === key ? 'alert' : undefined}
            >
              {failed === key ? 'No se pudo guardar.' : hint}
            </p>
          </div>
          <Toggle
            checked={values[key]}
            label={label}
            onChange={(next) => {
              void change(key, field, next);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
