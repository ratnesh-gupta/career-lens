# Local development & testing

**Prefer the Makefile.** All day-to-day commands run from:

```bash
cd career-lens/career-intelligence
make help
```

---

## 1. Prerequisites

| Tool | Version |
|------|---------|
| **Node.js** | ≥ 20 |
| **pnpm** | ≥ 9 (repo uses 10) |
| **PHP** | ≥ 8.3 |
| **Composer** | 2.x |
| **Docker** + Compose | Postgres, Redis, MinIO |
| **Make** | GNU make |

```bash
corepack enable && corepack prepare pnpm@10.34.3 --activate
node -v && php -v && composer -V && docker -v && make -v
```

---

## 2. One-time setup

```bash
git clone https://github.com/ratnesh-gupta/career-lens.git
cd career-lens/career-intelligence

make setup
# → pnpm install, apps/web/.env.local, apps/api composer + .env + key + migrate
```

Then start infra:

```bash
make compose-up
```

| Service | Port | Notes |
|---------|------|--------|
| PostgreSQL | **5102** | user/db/password `careerlens` |
| Redis | **5103** | |
| MinIO | **5100** / **5101** | local S3; console :5101 |
| ClamAV | **3310** | `make compose-malware` |

---

## 3. Daily development (full stack)

Four terminals, always from `career-intelligence/`:

| Terminal | Command | URL |
|----------|---------|-----|
| A | `make compose-up` | infra |
| B | `make api-serve` | http://localhost:8000 |
| C | `make api-queue` | resume jobs |
| D | `make dev` | http://localhost:5173 |

Smoke:

```bash
make health    # /api/v1/health
make ready     # /api/v1/ready
```

Checklist: health OK → open app → register → upload PDF → worker processes → score.

### Super-admin

```bash
make api-promote EMAIL=you@example.com
```

Re-login, then http://localhost:5173/admin

---

## 4. Frontend-only (MSW)

```bash
make install
make web-env
# edit apps/web/.env.local → VITE_ENABLE_MSW=true
make dev
```

No Docker/PHP required.

---

## 5. Makefile reference

```text
make help                 List all targets

# Setup
make setup                Full one-time setup
make install              pnpm install
make api-setup            API composer + env + key + migrate
make web-env              Copy web .env.local if missing

# Docker
make compose-up           Postgres + Redis + MinIO
make compose-malware      + ClamAV
make compose-ps
make compose-logs
make compose-down
make compose-down-v       Wipe volumes

# API
make api-serve
make api-queue
make api-horizon
make api-migrate
make api-fresh            Destructive reset DB schema
make api-test
make api-test-filter F=Auth
make api-pint
make api-routes
make api-promote EMAIL=...

# Web
make dev
make build
make test
make test-e2e
make typecheck
make lint
make format
make clean
make reset                clean + install

# Quality
make ci                   ci-fe + ci-api
make ci-fe
make ci-api
make openapi-lint

# Images / smoke
make docker-build-api
make docker-build-web
make health
make ready
```

---

## 6. Testing

| Goal | Command |
|------|---------|
| FE unit | `make test` |
| FE typecheck | `make typecheck` |
| FE e2e | `make test-e2e` |
| API Pest | `make api-test` |
| API filter | `make api-test-filter F=ResumePipeline` |
| Before PR | `make ci` |

---

## 7. Ports

| Service | Port |
|---------|------|
| Web | **5173** |
| API | **8000** |
| Postgres | **5102** |
| Redis | **5103** |
| MinIO | **5100** / **5101** |

---

## 8. Common problems

| Symptom | Fix |
|---------|-----|
| MSW still on | `VITE_ENABLE_MSW=false` in `.env.local`, restart `make dev` |
| CORS | `FRONTEND_URL=http://localhost:5173` in `apps/api/.env`, restart `make api-serve` |
| Resume stuck | `make api-queue` |
| Upload fails | `make compose-up` (MinIO) or `RESUMES_DISK=local` |
| DB refused | `make compose-up`, `DB_PORT=5102` |
| Admin 403 | `make api-promote EMAIL=...` then re-login |

---

## 9. Related docs

| Doc | Topic |
|-----|--------|
| [implementation-sequence-r1a.md](./implementation-sequence-r1a.md) | R1a status |
| [frontend-real-api.md](./frontend-real-api.md) | Real API mode |
| [deploy-staging.md](./deploy-staging.md) | Staging CI/CD |
| [backend/storage-and-malware.md](./backend/storage-and-malware.md) | MinIO / ClamAV |
