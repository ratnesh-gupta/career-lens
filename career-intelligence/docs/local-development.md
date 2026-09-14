# Local development & testing

Commands to run **CareerLens** on your machine for development and tests.

All paths below assume you start from the monorepo app root:

```bash
cd career-lens/career-intelligence
```

---

## 1. Prerequisites

| Tool | Version |
|------|---------|
| **Node.js** | ≥ 20 |
| **pnpm** | ≥ 9 (repo uses pnpm 10) |
| **PHP** | ≥ 8.3 |
| **Composer** | 2.x |
| **Docker** + Docker Compose | for Postgres, Redis, MinIO |
| **Git** | current |

Optional:

- **ClamAV** via Compose profile `malware` (production-like upload scanning)

```bash
# Enable pnpm if needed
corepack enable
corepack prepare pnpm@10.34.3 --activate

node -v    # v20+
php -v     # 8.3+
composer -V
docker -v
```

---

## 2. One-time setup

### 2.1 Clone & install JS

```bash
git clone https://github.com/ratnesh-gupta/career-lens.git
cd career-lens/career-intelligence

pnpm install
```

### 2.2 Infrastructure (Docker)

```bash
# Postgres :5102, Redis :5103, MinIO :5100 (API) / :5101 (console)
docker compose up -d postgres redis minio minio-init

# Optional malware scanner
docker compose --profile malware up -d clamav

# Stop
docker compose down
# Stop + remove volumes (wipes DB/MinIO data)
docker compose down -v
```

| Service | Host port | Credentials / notes |
|---------|-----------|---------------------|
| PostgreSQL 16 | **5102** | user/db/password: `careerlens` |
| Redis 7 | **5103** | no password |
| MinIO | **5100** / **5101** | `careerlens` / `careerlenssecret`, bucket `careerlens-resumes` |
| ClamAV | **3310** | profile `malware` only |

MinIO console: http://127.0.0.1:5101  
**Local S3 = MinIO** (not AWS).

### 2.3 Backend (Laravel API)

```bash
cd apps/api

cp .env.example .env
composer install
php artisan key:generate

# S3 adapter (presigned uploads)
composer require league/flysystem-aws-s3-v3

php artisan migrate
cd ../..
```

`.env` already points at Compose ports (`DB_PORT=5102`, `REDIS_PORT=5103`, MinIO endpoint `http://127.0.0.1:5100`).

Useful local overrides in `apps/api/.env`:

```env
RESUMES_DISK=s3                 # or local for offline
MALWARE_SCANNER=passthrough     # or clamav / none
MALWARE_SCAN_REQUIRED=false
QUEUE_CONNECTION=redis          # use sync if you skip workers
```

### 2.4 Frontend (Vite)

```bash
cp apps/web/.env.example apps/web/.env.local
```

Default **real API** mode:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENABLE_MSW=false
VITE_AUTH_TOKEN_KEY=careerlens_access_token
VITE_APP_URL=http://localhost:5173
```

Offline / no backend:

```env
VITE_ENABLE_MSW=true
```

---

## 3. Daily development (full stack)

Open **three terminals** from `career-intelligence/`.

### Terminal A — infra

```bash
docker compose up -d postgres redis minio minio-init
```

### Terminal B — API + queue

```bash
cd apps/api
php artisan serve
# → http://localhost:8000
```

Second shell for resume processing jobs:

```bash
cd apps/api
php artisan queue:work redis --tries=3
# or: php artisan horizon
```

### Terminal C — web

```bash
pnpm dev
# or: pnpm --filter @careerlens/web dev
# → http://localhost:5173
```

### Smoke checklist

1. http://localhost:8000/api/v1/health → `{ "success": true, ... }`
2. http://localhost:5173 → landing
3. Register → dashboard
4. Upload PDF → confirm → (queue worker) → analysis / score

### Super-admin (optional)

```bash
cd apps/api
php artisan admin:promote you@example.com
```

Log out and log in again, then open http://localhost:5173/admin

---

## 4. Frontend-only (MSW)

No Docker / PHP required.

```bash
cd career-intelligence
pnpm install
cp apps/web/.env.example apps/web/.env.local
# set VITE_ENABLE_MSW=true in .env.local
pnpm dev
```

Console should log: `[MSW] Mock API enabled`.

---

## 5. Command reference

### 5.1 Makefile (`career-intelligence/`)

```bash
make install          # pnpm install
make dev              # web dev server
make build            # web production build
make lint             # lint all packages
make test             # FE unit tests (pnpm -r test)
make typecheck        # TypeScript
make format           # Prettier
make clean            # remove dist/node_modules artifacts

make compose-up       # docker compose up -d
make compose-down     # docker compose down

make api-serve        # php artisan serve
make api-migrate      # php artisan migrate
make api-test         # Pest
make api-horizon      # Horizon dashboard/worker UI process

make ci-fe            # install + typecheck + test + build (web)
make ci-api           # composer install + artisan test
make docker-build-api # local API image
make docker-build-web # local web image
```

### 5.2 pnpm / web (`apps/web`)

```bash
# From career-intelligence/
pnpm --filter @careerlens/web dev
pnpm --filter @careerlens/web build
pnpm --filter @careerlens/web preview
pnpm --filter @careerlens/web typecheck
pnpm --filter @careerlens/web lint
pnpm --filter @careerlens/web lint:fix
pnpm --filter @careerlens/web test           # Vitest once
pnpm --filter @careerlens/web test:watch
pnpm --filter @careerlens/web test:coverage
pnpm --filter @careerlens/web test:e2e       # Playwright (needs app up)
pnpm --filter @careerlens/web msw:init

# Workspace-wide
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm format
pnpm openapi:generate                        # regenerate shared-types from OpenAPI
```

### 5.3 Laravel / API (`apps/api`)

```bash
cd apps/api

# Lifecycle
composer install
php artisan key:generate
php artisan migrate
php artisan migrate:fresh --seed             # wipe + migrate (careful)
php artisan serve                            # :8000
php artisan queue:work redis
php artisan horizon
php artisan config:clear
php artisan route:list
php artisan tinker

# Tests
php artisan test                             # Pest via Artisan
./vendor/bin/pest
./vendor/bin/pest --filter=Auth
./vendor/bin/pest --filter=ResumePipeline
./vendor/bin/pest --filter=Admin
./vendor/bin/pint                            # format PHP
./vendor/bin/pint --test                     # CI style check

# Ops
php artisan admin:promote user@example.com
```

### 5.4 Docker

```bash
# From career-intelligence/
docker compose up -d postgres redis minio minio-init
docker compose ps
docker compose logs -f postgres
docker compose --profile malware up -d clamav
docker compose down
docker compose down -v

# Staging-style images (optional)
docker build -f deploy/docker/Dockerfile.api -t careerlens-api:local apps/api
docker build -f deploy/docker/Dockerfile.web \
  --build-arg VITE_API_BASE_URL=http://localhost:8000/api/v1 \
  --build-arg VITE_ENABLE_MSW=false \
  -t careerlens-web:local .
```

### 5.5 Health / API smoke (curl)

```bash
curl -s http://localhost:8000/api/v1/health | jq
curl -s http://localhost:8000/api/v1/ready | jq

# Register
curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"email":"dev@example.com","password":"password123","displayName":"Dev User"}' | jq

# Login → copy accessToken
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"email":"dev@example.com","password":"password123"}' | jq

export TOKEN='paste-access-token'
curl -s http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" -H 'Accept: application/json' | jq

curl -s http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer $TOKEN" -H 'Accept: application/json' | jq
```

---

## 6. Testing matrix

| Layer | Command | Needs |
|-------|---------|--------|
| FE unit | `pnpm --filter @careerlens/web test` | Node only |
| FE typecheck | `pnpm --filter @careerlens/web typecheck` | Node only |
| FE e2e | `pnpm --filter @careerlens/web test:e2e` | Dev server / Playwright |
| API unit/feature | `cd apps/api && php artisan test` | PHP; sqlite in CI, or local Postgres |
| API style | `./vendor/bin/pint --test` | Composer deps |
| OpenAPI | `npx @redocly/cli lint docs/api/openapi-v1.yaml` | Node |
| Full FE CI-ish | `make ci-fe` | Node |
| Full API CI-ish | `make ci-api` | PHP |

Recommended before a PR:

```bash
# From career-intelligence/
pnpm --filter @careerlens/web typecheck
pnpm --filter @careerlens/web test
cd apps/api && php artisan test && cd ../..
```

---

## 7. Ports cheat sheet

| Service | URL / port |
|---------|------------|
| Web (Vite) | http://localhost:**5173** |
| API | http://localhost:**8000** |
| API health | http://localhost:8000/api/v1/health |
| API ready | http://localhost:8000/api/v1/ready |
| Postgres | localhost:**5102** |
| Redis | localhost:**5103** |
| MinIO API | http://127.0.0.1:**5100** |
| MinIO console | http://127.0.0.1:**5101** |
| ClamAV | localhost:**3310** |

---

## 8. Common problems

| Symptom | Fix |
|---------|-----|
| FE calls mock data unexpectedly | `VITE_ENABLE_MSW=false` in `.env.local`, restart Vite |
| CORS errors | API `FRONTEND_URL=http://localhost:5173`; restart `artisan serve` |
| 401 after login | Token key must be `careerlens_access_token` |
| Resume stuck processing | Run `php artisan queue:work redis` |
| Upload / confirm fails | MinIO up (`minio` + `minio-init`); or set `RESUMES_DISK=local` |
| DB connection refused | `docker compose up -d postgres`, check `DB_PORT=5102` |
| `composer` / S3 errors | `composer require league/flysystem-aws-s3-v3` |
| Admin 403 | `php artisan admin:promote email` then re-login |

---

## 9. Related docs

| Doc | Topic |
|-----|--------|
| [implementation-sequence-r1a.md](./implementation-sequence-r1a.md) | R1a sequence status |
| [frontend-real-api.md](./frontend-real-api.md) | FE → Laravel mode |
| [backend/laravel-setup-r1a.md](./backend/laravel-setup-r1a.md) | Laravel scaffold notes |
| [backend/storage-and-malware.md](./backend/storage-and-malware.md) | MinIO + scanners |
| [deploy-staging.md](./deploy-staging.md) | CI / staging deploy |
