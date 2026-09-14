# CareerLens — Personal Career Intelligence Platform

> **How does the job market see you?**

Upload a resume → get a **Career Score** → see strengths, gaps, and what to improve next.

---

## Current status (2026-09-14)

| Area | Status |
|------|--------|
| **Frontend R1a** | ✅ `apps/web` |
| **Backend R1a** | ✅ Laravel 13 (`apps/api`) |
| **Local infra** | ✅ Docker Compose |
| **CI / staging** | ✅ GitHub Actions |
| **R1b** | Placeholders |

**Commands:** use the **Makefile** — see [docs/local-development.md](./docs/local-development.md)

---

## Quick start

```bash
cd career-intelligence

make setup          # one-time: JS + API env, key, migrate
make compose-up     # Postgres Redis MinIO

# four terminals:
make api-serve      # :8000
make api-queue      # resume jobs
make dev            # :5173
```

```bash
make help           # all targets
make health         # API smoke
make ci             # tests before PR
```

---

## Repository layout

```
career-intelligence/
├── Makefile                 # ← primary local interface
├── apps/web                 # React + Vite
├── apps/api                 # Laravel 13
├── packages/shared-types
├── docs/local-development.md
├── deploy/
└── docker-compose.yml
```

---

## Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind, shadcn/ui, TanStack Query, Zustand, RHF + Zod, MSW (opt-in), Vitest, Playwright.

**Backend:** Laravel 13, PHP 8.3+, Sanctum, PostgreSQL, Redis, Horizon, S3/MinIO, Pest, Pint.
