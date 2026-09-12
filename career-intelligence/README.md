# CareerLens — Personal Career Intelligence Platform

> "How does the job market see you?"

R1a frontend: landing → auth → resume upload → analysis → Career Score → share.

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |

```bash
npm install -g pnpm@latest
cd career-intelligence
pnpm install
```

## Environment

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | API base (default `http://localhost:8000/api/v1`) |
| `VITE_ENABLE_MSW` | Mock API in dev (default `true`) |
| `VITE_SENTRY_DSN` | Optional Sentry |
| `VITE_POSTHOG_KEY` | Optional PostHog |
| `VITE_APP_URL` | Canonical app URL for SEO/share links |

## Development

```bash
make dev
# or
pnpm --filter @careerlens/web dev
```

Open [http://localhost:5173](http://localhost:5173).

MSW intercepts `/api/v1/*` in development when `VITE_ENABLE_MSW=true`.

### Happy path (mocked)

1. `/` — marketing landing  
2. `/register` — any valid form → dashboard  
3. `/resumes/upload` — PDF → processing poll → analysis  
4. `/score` — Career Score + share link  
5. `/score/shr_abc123xyz` — public score card  

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Web dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright |
| `pnpm typecheck` | TypeScript |
| `make format` | Prettier |

## Monorepo

```
career-intelligence/
├── apps/web/                 # React 18 + Vite + Tailwind + shadcn
├── packages/shared-types/    # API contracts
├── packages/shared-config/
└── ...
```

## Frontend stack (locked)

React 18, TypeScript, Vite, Tailwind, shadcn/ui, TanStack Query, Zustand, React Router, RHF + Zod, MSW, Vitest, Playwright, Sentry, PostHog.

## R1a vs R1b

- **R1a:** Auth, resume PDF upload/analysis, Career Score, share, public score  
- **R1b (Coming soon):** Optimization, versions, billing, target role  
