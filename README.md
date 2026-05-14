# FocusFlow

A focused, distraction-free task-management workspace built as a frontend assignment. The UI was implemented from a supplied Stitch design system (high-productivity executive aesthetic — Hanken Grotesk + Inter + JetBrains Mono, slate/teal palette).

The project is **fully frontend** — there is no backend server. A typed mock API layer (`src/api/*`) simulates a REST backend on top of `localStorage`, so the whole app talks to a clean API boundary that can be swapped for a real backend without touching any page, component, or store.

> **GitHub repository:** https://github.com/TamarCoder/Todo-Management-App

---

## Quick start (for reviewers)

Three commands, no configuration needed:

```bash
git clone https://github.com/TamarCoder/Todo-Management-App.git
cd Todo-Management-App
npm install
npm run dev
```

Then open **http://localhost:3000**. You can either register a new account or click **"Use demo credentials"** on the login screen (`demo@focusflow.app` / `demo1234`).

Because the project is frontend-only, **no `.env` file, database, or backend setup is required** — the mock API runs entirely in the browser.

To run the test suite:

```bash
npm test
```

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Running the frontend](#running-the-frontend)
- [Running the tests](#running-the-tests)
- [How the mock API works](#how-the-mock-api-works)
- [Design tokens / theming](#design-tokens--theming)
- [State management](#state-management)
- [Demo account](#demo-account)
- [Resetting mock data](#resetting-mock-data)
- [Known limitations](#known-limitations)

---

## Features

- 🔐 **Auth** — email/password registration & login, session restore, field-level validation
- 👤 **Per-user data isolation** — every API call filters by the signed-in user; covered by tests
- 📥 **Dashboard** — Today / Inbox lists, focus-mode timer (24:52 ticking countdown), productivity stats, "Stay inspired" decorative card
- ✅ **Todos CRUD** — create, edit, delete (with confirmation dialog), toggle done with optimistic UI updates
- 🔎 **Filters** — search by title, filter by status, filter by priority, sort by created/due date
- 🗂️ **Kanban Projects view** with **native HTML5 drag-and-drop** between To Do / In Progress / Done columns
- 📅 **Upcoming calendar** — month/week/list views, clickable day cells, agenda side panel
- 🧑‍💼 **Profile** — edit display name, view per-user stats, sign out
- 🎨 **Loading / error / empty states**, status & priority badges, inline form validation feedback
- 📱 **Responsive** — sidebar collapses to a hamburger drawer below 768px, layouts stack on small screens
- 🌐 **Global search** — typing in the topbar filters Dashboard / Todos / Upcoming / Projects in real time

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** (strict mode) |
| Styling | **Tailwind CSS** with design tokens defined as CSS custom properties |
| State management | **Zustand** with `subscribeWithSelector` middleware (cross-store reactions) |
| Mock API | Custom typed client in `src/api/*` backed by `localStorage` |
| Icons | **lucide-react** (thin-line, matches the design system) |
| Fonts | **next/font/google** — Hanken Grotesk, Inter, JetBrains Mono |
| Testing | **Jest** + **React Testing Library** (jsdom) |

No Vite, no CRA, no UI kit dependency.

---

## Project structure

```
focusflow-app/
├─ src/
│  ├─ api/                          ← public API boundary (use this from app code)
│  │  ├─ client.ts                  — ApiError, API_BASE, error mapping
│  │  ├─ auth.ts                    — authApi.{seed, register, login, me, updateProfile, logout}
│  │  ├─ todos.ts                   — todosApi.{list, get, create, update, remove}
│  │  └─ index.ts                   — barrel
│  │
│  ├─ store/                        ← Zustand stores (read/write via API only)
│  │  ├─ auth-store.ts              — useAuthStore: user, login, register, logout, ...
│  │  ├─ search-store.ts            — useSearchStore: global query
│  │  ├─ todo-store.ts              — useTodoStore: todos, refresh, create, update, remove
│  │  └─ index.ts                   — wireStores() (refresh todos when user changes)
│  │
│  ├─ lib/
│  │  ├─ db.ts                      — localStorage-backed mock implementation
│  │  ├─ types.ts                   — User, Todo, enums
│  │  ├─ validation.ts              — email/password/title/status/priority/dueDate validators
│  │  └─ utils.ts                   — cn, localDateISO, formatRelative, isOverdue
│  │
│  ├─ components/
│  │  ├─ ui/                        — Card, Avatar, Stat, Pill, MetaField, SectionHeader,
│  │  │                               Badge, Button, ConfirmDialog, EmptyState, ErrorMessage,
│  │  │                               Input, Modal, Select, Skeleton, Spinner, Textarea
│  │  ├─ layout/                    — AppShell, Sidebar, Topbar
│  │  ├─ todos/                     — TodoListItem, TodoForm, TodoFilters, DeleteTodoDialog
│  │  ├─ auth/                      — LoginForm, RegisterForm
│  │  └─ StoreInitializer.tsx       — boots Zustand stores at app mount
│  │
│  ├─ app/                          ← Next.js App Router routes
│  │  ├─ layout.tsx                 — root layout, fonts, <StoreInitializer>
│  │  ├─ globals.css                — design tokens (CSS variables) + tailwind base
│  │  ├─ page.tsx                   — / redirects to /dashboard or /login
│  │  ├─ login/, register/          — auth flows
│  │  ├─ dashboard/                 — Today / Inbox / focus timer / stats
│  │  ├─ todos/                     — list, new, [id], [id]/edit
│  │  ├─ profile/                   — edit display name + stats
│  │  ├─ projects/                  — Kanban with drag-and-drop
│  │  ├─ upcoming/                  — calendar + agenda
│  │  └─ archive/, trash/           — placeholders
│  │
│  └─ __tests__/                    — Jest test suites
│     ├─ api.test.ts                — API integration: auth + todos + error codes
│     ├─ auth.test.ts               — register/login/duplicate-email/etc
│     ├─ todos.test.ts              — CRUD + validation
│     ├─ isolation.test.ts          — cross-user data isolation (most important)
│     ├─ validation.test.ts         — every validator: valid + invalid cases
│     └─ LoginForm.test.tsx         — UI smoke test
│
├─ tailwind.config.ts               — colors reference CSS vars via rgb(var(--…))
├─ jest.config.js + jest.setup.ts
├─ next.config.js, tsconfig.json, postcss.config.js
├─ .env.example                     — public + (placeholder) private vars
├─ .gitignore                       — node_modules, .next, .env.local, coverage
└─ package.json
```

---

## Setup

Requires **Node 18+** and npm.

```bash
git clone https://github.com/TamarCoder/Todo-Management-App.git
cd Todo-Management-App
npm install
cp .env.example .env.local           # optional — defaults work as-is
```

Total install size: ≈ 250 MB (Next.js + React + Tailwind + Jest + RTL toolchain).

---

## Environment variables

All env vars live in `.env.example` (safe to commit) and `.env.local` (git-ignored).

| Var | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Display name for the app | `FocusFlow` |
| `NEXT_PUBLIC_API_URL` | Base URL the API client targets. `mock://*` enables the in-browser mock backend; an `https://…` URL would point to a real backend. | `mock://localhost` |

**Secret values must never be committed.** `.gitignore` excludes `.env.local`. The codebase intentionally has no real secrets today (since there's no backend) — placeholders are documented in `.env.example`.

To use real backend creds in the future:

```bash
# .env.local — git-ignored
NEXT_PUBLIC_API_URL=https://api.focusflow.com
AUTH_SECRET=…
DATABASE_URL=…
```

---

## Running the frontend

```bash
npm run dev          # development server with HMR at http://localhost:3000
npm run build        # production build (typecheck + bundle)
npm run start        # serve the production build
npm run lint         # next/eslint
```

The app uses **App Router**. Routes are file-based under `src/app/`. The root page (`/`) is a server component that delegates to a small client subtree; the rest of the pages are client-rendered (`"use client"`) because they read from Zustand stores backed by `localStorage`.

---

## Running the tests

```bash
npm test             # run all Jest suites once
npm run test:watch   # watch mode for development
```

Current coverage: **35 tests across 6 suites**, all passing.

| Suite | What it covers |
|---|---|
| `api.test.ts` | API client surface — `ApiError` 401/403/404/409 status mapping, session lifecycle, end-to-end todo CRUD via the public API |
| `auth.test.ts` | Registration, login, duplicate email, password hashing |
| `todos.test.ts` | Todo CRUD, ordering, validation |
| `isolation.test.ts` | **Critical**: User A cannot read/list/update/delete User B's todos |
| `validation.test.ts` | All 7 validators — valid + invalid cases for email, password, confirm-password, title, status, priority, due date |
| `LoginForm.test.tsx` | UI smoke — inline error rendering on empty + malformed submissions |

Tests use a `_resetForTests()` helper to wipe the mock DB between cases. The auth store has a matching `_reset()` action.

---

## How the mock API works

The app talks **only** to functions exported from `src/api/`. No page, component, or store imports `localStorage` directly or reaches into `src/lib/db.ts` — that gives the project a single seam to swap in a real backend later.

### Endpoint contract

The mock API mirrors a real REST backend's shape:

| HTTP                | Endpoint              | Method                   | Returns                            |
|---------------------|-----------------------|--------------------------|------------------------------------|
| `POST`              | `/auth/register`      | `authApi.register`       | `User` (201)                       |
| `POST`              | `/auth/login`         | `authApi.login`          | `User` (200)                       |
| `GET`               | `/auth/me`            | `authApi.me`             | `User \| null` (200)               |
| `PATCH`             | `/auth/me`            | `authApi.updateProfile`  | `User` (200)                       |
| `POST`              | `/auth/logout`        | `authApi.logout`         | `void` (204)                       |
| `GET`               | `/todos`              | `todosApi.list`          | `Todo[]` (200)                     |
| `GET`               | `/todos/:id`          | `todosApi.get`           | `Todo \| null` (200/404)           |
| `POST`              | `/todos`              | `todosApi.create`        | `Todo` (201)                       |
| `PATCH`             | `/todos/:id`          | `todosApi.update`        | `Todo` (200/403/404)               |
| `DELETE`            | `/todos/:id`          | `todosApi.remove`        | `void` (204/403/404)               |

### Typed errors

Every API failure surfaces as an `ApiError` instance with an HTTP-style `status`:

```ts
import { authApi, ApiError } from "@/api";

try {
  await authApi.login(email, password);
} catch (e) {
  if (e instanceof ApiError && e.status === 401) {
    // wrong credentials
  }
}
```

Status mapping (in `src/api/client.ts → toApiError`):

| Mock-impl error message                | → HTTP status |
|----------------------------------------|---------------|
| `"Invalid email or password"`          | **401** Unauthorized |
| `"Not authorized"`                     | **403** Forbidden |
| `"... not found"`                      | **404** Not Found |
| `"An account with this email already exists"` | **409** Conflict |
| (anything else)                        | **500** Server Error |

### Loading + latency simulation

Every API call has a ~200 ms artificial delay (`src/lib/db.ts → delay()`). This keeps loading skeletons visible during local dev and approximates real-network conditions for testing optimistic UI updates.

### Owner enforcement (security)

The mock store filters every read by `userId` and rejects writes that target a todo belonging to a different user. The contract is identical to what a real backend would enforce (deriving `userId` from the session token instead of accepting it as a parameter). The `isolation.test.ts` suite asserts this from the public API.

### Swapping in a real backend

When a real backend appears:

1. Set `NEXT_PUBLIC_API_URL=https://your-backend.example.com` in `.env.local`.
2. Edit the function bodies in `src/api/auth.ts` and `src/api/todos.ts` to call `fetch()` instead of the mock store:

   ```ts
   async login(email, password) {
     const res = await fetch(`${API_BASE}/auth/login`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password }),
     });
     if (!res.ok) throw new ApiError(await res.text(), res.status as ApiStatus);
     return res.json();
   }
   ```

3. No store, page, or component changes.

---

## Design tokens / theming

All colors, radii, shadows, and layout constants live in **one place** — `src/app/globals.css`:

```css
:root {
  --color-secondary: 13 148 136;          /* #0d9488 — brand teal */
  --color-secondary-container: 134 242 228;
  --color-primary: 11 28 48;
  --radius-xl: 0.75rem;
  --shadow-card: 0px 4px 12px rgba(15, 23, 42, 0.05);
  /* ~55 tokens total */
}
```

`tailwind.config.ts` only maps Tailwind utility names to those variables:

```ts
colors: {
  secondary: "rgb(var(--color-secondary) / <alpha-value>)",
  /* ... */
}
```

This means:

- Re-skinning the app needs **only** `globals.css` changes — no component edits.
- Tailwind's opacity modifier still works (`bg-secondary/40`).
- Adding dark mode is a single `[data-theme="dark"] { … }` block.

---

## State management

Three Zustand stores power the entire app:

| Store | Shape | Lifecycle |
|---|---|---|
| `useAuthStore` | `user`, `loading`, `initialize()`, `login()`, `register()`, `logout()`, `updateProfile()` | Initialized once at app mount by `<StoreInitializer />`. |
| `useTodoStore` | `todos`, `loading`, `error`, `refresh()`, `create()`, `update()`, `remove()` | Auto-refreshes whenever the signed-in user changes (cross-store subscription in `src/store/index.ts`). |
| `useSearchStore` | `query`, `setQuery()` | Drives the global topbar search; consumed by Dashboard, Todos, Projects, Upcoming. |

All actions call the API layer — never `localStorage` directly. Updates are **optimistic** in the todo store: state flips immediately, then reconciles with the API response (and rolls back via a refresh if the API rejects).

---

## Demo account

A demo user is auto-seeded on first launch, plus 5 example todos so the dashboard isn't empty.

```
Email:    demo@focusflow.app
Password: demo1234
```

The login screen exposes a one-click **"Use demo credentials"** button that fills the form to avoid typos.

---

## Resetting mock data

Mock state lives in `localStorage` under three keys: `focusflow:users`, `focusflow:todos`, `focusflow:session` (+ a `focusflow:seeded` version marker).

To wipe everything and re-seed:

```js
// Browser DevTools console
localStorage.clear()
location.reload()
```

On reload, the demo user + seed todos are recreated.

---

## Known limitations

- 🔒 Passwords are stored as Base64 of a salted string in `localStorage`. **This is mock-only, NOT real security.** A real backend would hash with bcrypt/argon2 server-side.
- 🗑️ Archive and Trash sidebar pages are placeholders — soft-delete isn't implemented.
- 📊 Focus Hours / Streak / Weekly Goal values on the dashboard are illustrative (matching the design's baseline). A real productivity tracker would derive these from actual usage.
- 🌐 No offline support beyond what `localStorage` already provides; no service worker.

---

## Live demo

> _Optional bonus._ Deploy with one click on Vercel:
>
> 1. Push this repo to GitHub.
> 2. Import it at [vercel.com/new](https://vercel.com/new).
> 3. No env vars required — defaults make the mock API work out of the box.
>
> A deployed URL would normally go here.

---

## License

This project was built as a developer assignment and is provided as-is for review.
