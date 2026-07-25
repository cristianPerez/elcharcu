# CLAUDE.md — elcharcu

Guía obligatoria para cualquier instancia de Claude / Cursor que trabaje en este repositorio.
Léela completa antes de escribir o modificar código. Estas reglas son **hard constraints**.

---

## 1. Stack

| Área            | Tecnología                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js (App Router, última versión)              |
| Lenguaje        | TypeScript **strict** (`strict`, `noImplicitAny`) |
| Styling         | Tailwind CSS (+ `prettier-plugin-tailwindcss`)    |
| Arquitectura    | Feature-Sliced Design (FSD) v2                    |
| Calidad         | ESLint + Prettier + Husky (pre-commit)            |
| Package manager | **pnpm**                                          |

---

## 2. Comandos comunes

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm start        # servir build
pnpm lint         # ESLint (0 warnings permitidos)
pnpm lint:fix     # ESLint con autofix
pnpm format       # Prettier --write
pnpm type-check   # tsc --noEmit (gate de tipos)
```

El hook `pre-commit` corre `type-check` (proyecto completo) + `lint-staged`
(ESLint + Prettier sobre archivos staged). No hacer `--no-verify`.

---

## 3. Arquitectura FSD

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

### 3.3 Reglas de imports (INNEGOCIABLE)

- **Downward only.** A layer imports exclusively from **lower** layers.
- **No sideways** (feature → feature) and **no upward** imports.
- Every slice is consumed **only through its public API** (`index.ts`). Never import
  another slice's internals (`@/features/x/ui/Internal` ❌).
- Allowed flow: `app → views → widgets → features → entities → shared`.

Estas reglas están **forzadas por ESLint** (`import/no-restricted-paths` +
`import/no-cycle`). Si el lint falla por límites de capa, **la solución es rediseñar
el import, nunca silenciar la regla**.

### 3.4 DRY vs FSD

Ante conflicto: **prefiere duplicación local razonable antes que romper un límite
de capa**. No crear "utils compartidos" que acoplen features entre sí.

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

## 5. Nomenclatura

| Elemento             | Convención             | Ejemplo                                    |
| -------------------- | ---------------------- | ------------------------------------------ |
| Componente / archivo | `PascalCase.tsx`       | `UserCard.tsx`                             |
| Hook                 | `useCamelCase.ts`      | `useAuthByEmail.ts`                        |
| Tipo / interface     | `PascalCase`           | `interface UserProfile {}`                 |
| Slice (feature/ent.) | `kebab-case/`          | `features/auth-by-email/`                  |
| Segmento interno     | `ui/ model/ lib/ api/` | `entities/user/model/user.types.ts`        |
| Constante global     | `SCREAMING_SNAKE`      | `const MAX_RETRIES = 3`                    |
| API pública          | `index.ts` por slice   | `export { UserCard } from './ui/UserCard'` |

Estructura interna estándar de un slice:

```
features/auth-by-email/
├─ index.ts        # API pública
├─ ui/             # componentes
├─ model/          # estado, tipos, lógica
├─ lib/            # helpers locales
└─ api/            # llamadas de red
```

---

## 6. Reglas de código (SOLID / Clean Code)

- **Single Responsibility:** componentes y módulos **< 150 líneas**. Si crece, dividir.
- **Interface Segregation:** props pequeñas y específicas. No pasar objetos gigantes
  si solo se usa un atributo — pasar el atributo.
- Props marcadas `readonly`; preferir `type`/`interface` explícitas.
- Sin lógica de negocio en la capa `views`/`app`: solo composición.

---

## 7. ⚠️ Zero `any` Policy (regla número uno)

- **Prohibido `any`** en todo el repo (`@typescript-eslint/no-explicit-any: "error"`).
- Si la inferencia falla: usar **`unknown` + type guards** o **generics explícitos**.
- Prohibido `@ts-ignore`, `@ts-expect-error` sin justificación escrita, y casts `as any`.
- Tipar retornos de funciones exportadas y límites de módulo.

Si no logras tipar algo sin `any`, **detente y replantea el diseño** — no lo fuerces.
