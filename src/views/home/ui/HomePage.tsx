import { type ReactNode } from 'react';

/**
 * FSD `views` layer (renamed from `pages` to avoid the Next.js Pages Router
 * collision): composes widgets/features into a full view. Orchestration only,
 * no business logic here.
 */
export function HomePage(): ReactNode {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">elcharcu</h1>
      <p className="text-sm opacity-70">
        Next.js + TypeScript strict + Feature-Sliced Design.
      </p>
    </main>
  );
}
