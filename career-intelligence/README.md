# CareerLens — Personal Career Intelligence Platform

> "How does the job market see you?"

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |

```bash
# Install pnpm if you don't have it
npm install -g pnpm@latest

# Install all dependencies
pnpm install
```

## Development

```bash
# Start the web app dev server (with MSW mocks)
make dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start web dev server |
| `make build` | Production build |
| `make lint` | Lint all packages |
| `make test` | Run unit tests (Vitest) |
| `make test-e2e` | Run E2E tests (Playwright) |
| `make format` | Format with Prettier |
| `make typecheck` | TypeScript check all packages |
| `make clean` | Remove build artifacts |

## Monorepo Structure

```
career-intelligence/
├── apps/
│   └── web/              # React 18 + Vite frontend
├── packages/
│   ├── shared-types/     # API contracts (TypeScript types only)
│   ├── shared-config/    # Shared ESLint / Tailwind / TS config
│   └── shared-ui/        # (Step 3) Shared component library
├── docs/                 # Product, architecture, API, AI docs
├── infrastructure/       # Docker, nginx, scripts
└── tests/                # E2E fixtures and Playwright tests
```

## Architecture Decisions

See [`docs/decisions/`](./docs/decisions/) for ADRs.

## Environment Variables

Copy `.env.example` to `.env.local` in `apps/web/` before running:

```bash
cp apps/web/.env.example apps/web/.env.local
```
