import { type Metadata } from 'next';
import { type ReactNode } from 'react';

import { AppCuentaView } from '@/views/app-cuenta';

import { accountProgress } from '@/widgets/account';

import { type CourseProgress } from '@/entities/course';
import { listCourses, progressByCourse } from '@/entities/course/server';
import { readProfile } from '@/entities/curing-profile/server';
import { planOf } from '@/entities/plan';
import { recipeCounts } from '@/entities/recipe-chat/server';
import { readSubscription } from '@/entities/subscription/server';
import { readQuota } from '@/entities/usage-quota/server';

import { currentUser } from '@/shared/api/supabase/server';
import { readVisitorIdFromCookies } from '@/shared/api/visitor/server';
import { initialsOf } from '@/shared/lib';

export const metadata: Metadata = { title: 'Mi cuenta · El Charcu' };

/**
 * Todo lo que enseña "Mi cuenta" sale de la base, nada de las maquetas: la
 * fecha de renovación es `current_period_end`, el uso es el contador del mes y
 * el avance se cuenta de lecciones y conversaciones reales.
 *
 * El layout ya garantizó que hay sesión; `currentUser()` y `readProfile()`
 * están deduplicados, así que no cuestan otro viaje.
 */
export default async function CuentaPage(): Promise<ReactNode> {
  const user = await currentUser();
  const userId = user?.id ?? null;

  const [profile, subscription, courses, progress, recipes, visitorId] =
    await Promise.all([
      userId === null ? null : readProfile(userId),
      userId === null ? null : readSubscription(userId),
      listCourses(),
      userId === null ? new Map<string, CourseProgress>() : progressByCourse(userId),
      userId === null ? { active: 0, finished: 0 } : recipeCounts(userId),
      readVisitorIdFromCookies(),
    ]);
  const quota = visitorId === null ? null : await readQuota(visitorId, userId);

  // El plan que manda es el que aplica el cupo; la suscripción da la fecha.
  const isActive = subscription !== null && subscription.status === 'active';
  const plan = planOf(quota?.plan ?? (isActive ? subscription.planId : null));

  return (
    <AppCuentaView
      name={profile?.fullName ?? ''}
      email={user?.email ?? ''}
      initials={initialsOf(profile?.fullName ?? null, user?.email ?? null)}
      interests={profile?.interests ?? []}
      notifications={
        profile?.notifications ?? { stepReminders: true, newCourses: true, news: false }
      }
      plan={plan}
      renewsAt={plan.cycle === null ? null : (subscription?.currentPeriodEnd ?? null)}
      isCanceled={subscription?.status === 'canceled'}
      usage={
        quota === null
          ? null
          : {
              questionsUsed: quota.questionsUsed,
              questionsLimit: quota.questionsLimit,
              imagesUsed: quota.imagesUsed,
              imagesLimit: quota.imagesLimit,
            }
      }
      progress={accountProgress(courses, progress, recipes)}
    />
  );
}
