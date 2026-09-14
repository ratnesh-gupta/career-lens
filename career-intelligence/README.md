# CareerLens — Personal Career Intelligence Platform

> **How does the job market see you?**

Upload a resume → get a **Career Score** → see strengths, gaps, and what to improve next.

---

## Current status (2026-09-14)

| Area | Status |
|------|--------|
| **Frontend R1a** | ✅ `apps/web` |
| **Backend R1a** | ✅ Laravel 13 modular API (`apps/api`) — auth, profile, resume, score, admin |
| **Local infra** | ✅ Docker Compose (Postgres, Redis, MinIO) |
| **CI / staging path** | ✅ GitHub Actions + deploy scripts |
| **R1b** | Placeholders only |

**Local commands (dev + test):** → **[docs/local-development.md](./docs/local-development.md)**

---

## Quick start (full stack)

```bash
cd career-intelligence

# 1) Infra
docker compose up -d postgres redis minio minio-init

# 2) API
cd apps/api
cp .env.example .env
composer install && php artisan key:generate && php artisan migrate
php artisan serve          # :8000
# other terminal: php artisan queue:work redis

# 3) Web
cd ../..
pnpm install
cp apps/web/.env.example apps/web/.env.local   # VITE_ENABLE_MSW=false
pnpm dev                   # :5173
```

Frontend-only (mocks): set `VITE_ENABLE_MSW=true` — see [docs/local-development.md](./docs/local-development.md).

---

## Repository layout

```
career-intelligence/
├── apps/
│   ├── web/                 # React + Vite + Tailwind + shadcn
│   └── api/                 # Laravel 13 modular monolith
├── packages/
│   └── shared-types/
├── docs/
│   ├── local-development.md # ← commands & local runbook
│   ├── implementation-sequence-r1a.md
│   ├── frontend-real-api.md
│   ├── deploy-staging.md
│   └── backend/
├── deploy/                  # Dockerfiles, staging compose, scripts
├── docker-compose.yml
└── Makefile
```

---

## Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind, shadcn/ui, TanStack Query, Zustand, RHF + Zod, MSW (opt-in), Vitest, Playwright, Sentry, PostHog.

**Backend:** Laravel 13.x, PHP 8.3+, Sanctum, PostgreSQL, Redis, Horizon, S3/MinIO, Pest, Pint, Pennant.

---

## Design system

- Primary: indigo `#4f46e5`
- Score tones: traffic-light
- Surfaces: warm stone neutrals
- Type: Inter + JetBrains Mono
- Tokens: `apps/web/src/styles/tokens.css`
