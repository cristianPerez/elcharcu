# CLAUDE.md — elcharcu

Mandatory guide for any Claude / Cursor instance working in this repository.
Read it fully before writing or modifying code. These rules are **hard constraints**.

---

## 1. Stack

| Area            | Technology                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js (App Router, latest version)              |
| Language        | TypeScript **strict** (`strict`, `noImplicitAny`) |
| Styling         | Tailwind CSS (+ `prettier-plugin-tailwindcss`)    |
| Architecture    | Feature-Sliced Design (FSD) v2                    |
| Quality         | ESLint + Prettier + Husky (pre-commit)            |
| Package manager | **pnpm**                                          |

---

## 2. Common commands

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm start        # serve build
pnpm lint         # ESLint (0 warnings allowed)
pnpm lint:fix     # ESLint with autofix
pnpm format       # Prettier --write
pnpm type-check   # tsc --noEmit (type gate)
```

The `pre-commit` hook runs `type-check` (whole project) + `lint-staged`
(ESLint + Prettier on staged files). Do not use `--no-verify`.

---

## 3. FSD Architecture

### 3.1 FSD ↔ Next.js naming collisions (READ THIS)

Next.js App Router reserves two directory names that FSD also uses: `app` and
`pages`. Two hard facts about Next resolution:

1. When a `src/` directory exists, Next uses **`src/app`** as the App Router and
   **ignores a root-level `app/`**.
2. **`src/pages`** would be picked up as the legacy **Pages Router**.

Conventions adopted in this repo to resolve both:

- **`src/app`** is BOTH the Next.js App Router AND the FSD `app` layer. Route files
  (`layout.tsx`, `page.tsx`, `loading.tsx`, route segments) live here **together with**
  global providers and styles. The app layer _is_ the router — keep route files thin
  and delegate views to `@/views/*`.
- The FSD `pages` layer is **renamed to `views`** (`src/views`, alias `@/views/*`) to
  avoid the Pages Router collision. This is the FSD-official recommendation for Next.
- Everything else lives under `src/` unchanged.

### 3.2 Layers (top to bottom)

```
app → views → widgets → features → entities → shared
```

```
src/
├─ app/            # Next App Router + FSD app layer (routing, providers, styles)
│  ├─ layout.tsx   #   root layout — composes AppProviders + globals.css
│  ├─ page.tsx     #   route file — delegates to @/views/home
│  ├─ providers/   #   global providers (AppProviders)
│  └─ styles/      #   globals.css (Tailwind entry)
├─ views/          # Full-view composition (was FSD `pages`; orchestrates widgets/features)
├─ widgets/        # Self-contained, complex UI blocks
├─ features/       # Business-valued user interactions (auth-by-email, add-to-cart)
├─ entities/       # Domain models (user, product)
└─ shared/         # UI kit, helpers, api base, global types (no domain)
   ├─ ui/  lib/  api/  config/  types/
```

### 3.3 Import rules (NON-NEGOTIABLE)

- **Downward only.** A layer imports exclusively from **lower** layers.
- **No sideways** (feature → feature) and **no upward** imports.
- Every slice is consumed **only through its public API** (`index.ts`). Never import
  another slice's internals (`@/features/x/ui/Internal` ❌).
- Allowed flow: `app → views → widgets → features → entities → shared`.

These rules are **enforced by ESLint** (`import/no-restricted-paths` +
`import/no-cycle`). If lint fails on a layer boundary, **the fix is to redesign the
import, never to silence the rule**.

### 3.4 DRY vs FSD

On conflict: **prefer reasonable local duplication over breaking a layer boundary**.
Do not create "shared utils" that couple features to each other.

---

## 4. Aliases

```
@/app/*       → src/app/*
@/views/*     → src/views/*
@/widgets/*   → src/widgets/*
@/features/*  → src/features/*
@/entities/*  → src/entities/*
@/shared/*    → src/shared/*
```

Always use aliases; `../../../` across slices is forbidden.

---

## 5. Naming

| Element              | Convention             | Example                                    |
| -------------------- | ---------------------- | ------------------------------------------ |
| Component / file     | `PascalCase.tsx`       | `UserCard.tsx`                             |
| Hook                 | `useCamelCase.ts`      | `useAuthByEmail.ts`                        |
| Type / interface     | `PascalCase`           | `interface UserProfile {}`                 |
| Slice (feature/ent.) | `kebab-case/`          | `features/auth-by-email/`                  |
| Internal segment     | `ui/ model/ lib/ api/` | `entities/user/model/user.types.ts`        |
| Global constant      | `SCREAMING_SNAKE`      | `const MAX_RETRIES = 3`                    |
| Public API           | `index.ts` per slice   | `export { UserCard } from './ui/UserCard'` |

Standard internal structure of a slice:

```
features/auth-by-email/
├─ index.ts        # public API
├─ ui/             # components
├─ model/          # state, types, logic
├─ lib/            # local helpers
└─ api/            # network calls
```

---

## 6. Code rules (SOLID / Clean Code)

- **Single Responsibility:** components and modules **< 150 lines**. If it grows, split it.
- **Interface Segregation:** small, specific props. Don't pass giant objects when only
  one attribute is used — pass the attribute.
- Mark props `readonly`; prefer explicit `type`/`interface` declarations.
- No business logic in the `views`/`app` layer: composition only.

---

## 7. ⚠️ Zero `any` Policy (rule number one)

- **`any` is forbidden** across the entire repo (`@typescript-eslint/no-explicit-any: "error"`).
- If inference fails: use **`unknown` + type guards** or **explicit generics**.
- Forbidden: `@ts-ignore`, `@ts-expect-error` without a written justification, and `as any` casts.
- Type the return values of exported functions and module boundaries.

If you can't type something without `any`, **stop and rethink the design** — don't force it.
