# CareerLens — Personal Career Intelligence Platform

> **How does the job market see you?**

Upload a resume → get a **Career Score** → see strengths, gaps, and what to improve next.

---

## Current status (2026-09-13)

| Area | Status |
|------|--------|
| **Frontend R1a (Steps 1–6)** | ✅ Complete on `main` (`apps/web` + MSW) |
| **Backend (Laravel 13 modular monolith)** | ❌ Not started — see setup guide |
| **Production deploy** | ❌ Not started |
| **R1b (optimization, versions, billing)** | Placeholders only |

### Backend next

1. [docs/implementation-sequence-r1a.md](./docs/implementation-sequence-r1a.md) — ordered R1a engineering sequence  
2. [docs/backend/laravel-setup-r1a.md](./docs/backend/laravel-setup-r1a.md) — **Laravel 13** scaffold into `apps/api`

### Frontend happy path (MSW)

1. Landing `/`
2. Register `/register`
3. Dashboard
4. Upload PDF `/resumes/upload`
5. Processing → analysis
6. Career Score `/score` + share
7. Public card `/score/:token`

---

## Quick start (frontend)

```bash
cd career-intelligence
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @careerlens/web dev
```

Open **http://localhost:5173**

### Useful commands

```bash
pnpm --filter @careerlens/web dev
pnpm --filter @careerlens/web build
pnpm --filter @careerlens/web typecheck
pnpm --filter @careerlens/web test
pnpm --filter @careerlens/web lint
```

---

## Repository layout

```
career-intelligence/
├── apps/
│   ├── web/                 # React 18 + Vite + Tailwind + shadcn (R1a UI)
│   └── api/                 # Laravel 13 — to be scaffolded
├── packages/
│   └── shared-types/
├── docs/
│   ├── implementation-sequence-r1a.md
│   ├── backend/laravel-setup-r1a.md
│   └── decisions/
├── docker-compose.yml       # to be added with API setup
└── README.md
```

---

## Stack

**Frontend (locked):** React 18, TypeScript, Vite, Tailwind, shadcn/ui, TanStack Query, Zustand, RHF + Zod, MSW, Vitest, Playwright, Sentry, PostHog.

**Backend (locked by baseline):** Laravel **13.x**, PHP 8.3+, Sanctum, PostgreSQL, Redis, Horizon, S3, Pest, PHPStan/Larastan, Pint, Pennant.

---

## Design system

- Primary: indigo `#4f46e5`
- Score tones: traffic-light
- Surfaces: warm stone neutrals
- Type: Inter + JetBrains Mono
- Tokens: `apps/web/src/styles/tokens.css`
