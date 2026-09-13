# Laravel backend setup (R1a)

**Status:** Ready to execute  
**Target path:** `career-intelligence/apps/api`  
**Framework:** **Laravel 13.x** (stable as of 2026-09; e.g. 13.31.x)  
**PHP:** **8.3 – 8.5** (recommend **8.4** for local)  
**Auth:** Laravel Sanctum  
**DB:** PostgreSQL  
**Queue/cache:** Redis + Laravel Horizon  
**Tests:** Pest  
**Aligned with:** Engineering Baseline v1.1 + `docs/implementation-sequence-r1a.md` item **#1**

> Do **not** scaffold a React/Vue starter kit inside Laravel. The SPA lives in `apps/web`. This app is **API-first**.

---

## 0. Prerequisites

| Tool | Version |
|------|---------|
| PHP | 8.3+ (8.4 recommended) with extensions: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo_pgsql`, `redis`, `tokenizer`, `xml`, `zip` |
| Composer | 2.7+ |
| Docker + Docker Compose | Recent stable |
| Node/pnpm | Already used by `apps/web` (not required for API runtime) |
| Git | — |

Check:

```bash
php -v
composer -V
docker -v
docker compose version
```

---

## 1. Where this sits in the monorepo

**Today:**

```text
career-intelligence/
├── apps/
│   └── web/              # exists
├── packages/
│   └── shared-types/
├── docs/
└── ...
```

**After this guide:**

```text
career-intelligence/
├── apps/
│   ├── web/
│   └── api/              # Laravel 13 (new)
├── infrastructure/
│   └── docker/           # optional shared Docker assets
├── docker-compose.yml    # Postgres + Redis (+ optional MinIO)
├── docs/
│   └── backend/
│       └── laravel-setup-r1a.md
└── ...
```

All commands below assume you start at:

```bash
cd career-intelligence
```

---

## 2. Create the Laravel 13 project in `apps/api`

### 2.1 Create project (API-oriented, no frontend kit)

Prefer pinning the **13.x** line explicitly:

```bash
composer create-project laravel/laravel apps/api "^13.0"
```

Alternative using the Laravel installer (omit starter kit / do not choose React-Inertia):

```bash
composer global require laravel/installer
# From career-intelligence/
laravel new apps/api --database=pgsql --pest --no-interaction
# If prompted for a starter kit, choose none / skip — API only
```

Verify:

```bash
cd apps/api
php artisan --version
# Expect: Laravel Framework 13.x.x
```

### 2.2 Git hygiene

Laravel’s scaffold includes its own `.git` sometimes when created standalone. Inside the monorepo you usually **remove nested git**:

```bash
# from career-intelligence/
rm -rf apps/api/.git
```

Ensure monorepo root `.gitignore` already ignores Laravel runtime artifacts (or add under `apps/api`):

```gitignore
# apps/api (Laravel)
/apps/api/vendor
/apps/api/node_modules
/apps/api/public/storage
/apps/api/storage/*.key
/apps/api/.env
/apps/api/.env.backup
/apps/api/auth.json
```

---

## 3. Install baseline packages

From `apps/api`:

```bash
cd apps/api

# API auth (baseline lock)
composer require laravel/sanctum

# Queues UI / monitoring (baseline lock)
composer require laravel/horizon

# Feature flags (baseline lock)
composer require laravel/pennant

# OpenAPI (choose one approach; example with darkaonline/l5-swagger or scramble)
# Recommended for R1a docs-first: dedoc/scramble (auto from routes) OR keep hand-written OpenAPI in docs/api
composer require dedoc/scramble --dev

# Code quality (baseline)
composer require larastan/larastan --dev
composer require laravel/pint --dev

# Pest is often already present if created with --pest; otherwise:
composer require pestphp/pest pestphp/pest-plugin-laravel --dev -W
php artisan pest:install
```

Sanctum / API scaffolding (Laravel 11+ style still applies on 13):

```bash
php artisan install:api
# Publishes Sanctum migrations + configures API middleware
```

Horizon:

```bash
php artisan horizon:install
```

Pennant:

```bash
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
```

---

## 4. Local infrastructure (Docker Compose)

Create **`career-intelligence/docker-compose.yml`** (monorepo root of the product, not repo root outside `career-intelligence` unless you prefer that):

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: careerlens
      POSTGRES_USER: careerlens
      POSTGRES_PASSWORD: careerlens
    ports:
      - "5432:5432"
    volumes:
      - careerlens_pg:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U careerlens -d careerlens"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

  # Optional local S3-compatible store for resume objects
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: careerlens
      MINIO_ROOT_PASSWORD: careerlenssecret
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - careerlens_minio:/data

volumes:
  careerlens_pg:
  careerlens_minio:
```

Start:

```bash
# from career-intelligence/
docker compose up -d
```

Create MinIO bucket `careerlens-resumes` via console at http://localhost:9001 (user/password as above) when you reach upload work.

---

## 5. Configure `.env` for `apps/api`

```bash
cd apps/api
cp .env.example .env
php artisan key:generate
```

Set at least:

```env
APP_NAME=CareerLens
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=careerlens
DB_USERNAME=careerlens
DB_PASSWORD=careerlens

SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
CACHE_STORE=redis

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=careerlens
AWS_SECRET_ACCESS_KEY=careerlenssecret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=careerlens-resumes
AWS_ENDPOINT=http://127.0.0.1:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
FRONTEND_URL=http://localhost:5173

# CORS will allow the Vite app origin
```

Frontend (`apps/web/.env.local`) when pointing at real API:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENABLE_MSW=false
VITE_APP_URL=http://localhost:5173
```

---

## 6. CORS + Sanctum for SPA

Ensure API is reachable from the Vite origin.

In `bootstrap/app.php` (Laravel 11+ / 13 style), enable stateful API if using cookie-based SPA auth. For **token-based** SPA (common with separate Vite app + `Authorization: Bearer`), Sanctum personal access tokens are enough; still configure CORS:

```bash
php artisan config:publish cors
```

`config/cors.php` (conceptually):

- `paths`: `['api/*', 'sanctum/csrf-cookie']`
- `allowed_origins`: `['http://localhost:5173']`
- `supports_credentials`: `true` if using cookies; else `false` for pure Bearer tokens

Baseline R1a can start with **Bearer tokens** from `POST /api/v1/auth/login` to match the existing FE auth client.

---

## 7. API version prefix `/api/v1`

Routes live under versioned prefix.

Example `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => response()->json([
        'success' => true,
        'data' => ['status' => 'ok'],
        'meta' => new \stdClass(),
    ]));

    // auth, profile, resumes, scores ...
});
```

With default `bootstrap/app.php` API routing, final paths are `/api/v1/...` — matches FE `VITE_API_BASE_URL=.../api/v1`.

---

## 8. Response envelope (do this early — sequence item #2)

Introduce a consistent JSON contract from day one.

Suggested helpers (illustrative):

```php
// app/Support/ApiResponse.php
namespace App\Support;

use Illuminate\Http\JsonResponse;

final class ApiResponse
{
    public static function success(mixed $data = [], array $meta = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => (object) $meta,
        ], $status);
    }

    public static function error(string $code, string $message, mixed $details = [], int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
                'details' => (object) $details,
            ],
        ], $status);
    }
}
```

Map validation exceptions and domain exceptions to this shape in `bootstrap/app.php` exception handling.

---

## 9. Modular monolith layout (recommended under `apps/api`)

Baseline requires modules with service interfaces — **no cross-module Eloquent**.

Suggested structure (not auto-generated; create as you implement):

```text
apps/api/
├── app/
│   ├── Modules/
│   │   ├── Auth/
│   │   ├── CareerProfile/
│   │   ├── Resume/
│   │   ├── CareerScore/
│   │   ├── Sharing/
│   │   ├── Ai/
│   │   └── Admin/
│   ├── Support/
│   │   └── ApiResponse.php
│   ├── Models/          # thin shared or move into modules
│   └── ...
├── routes/
│   └── api.php
├── database/
│   └── migrations/
├── tests/
│   └── Feature/
├── composer.json
└── .env
```

Each module typically contains:

- `Http/Controllers`
- `Domain` or `Actions`
- `Contracts` (interfaces)
- `Infrastructure` (Eloquent implementations)
- optional `Providers/ModuleServiceProvider.php`

Register module providers in `bootstrap/providers.php`.

---

## 10. First migrations & smoke test

```bash
cd apps/api
php artisan migrate
php artisan serve
# http://localhost:8000/api/v1/health
```

Horizon (separate terminal):

```bash
php artisan horizon
```

Pest:

```bash
php artisan test
# or
./vendor/bin/pest
```

---

## 11. Makefile targets (optional extension)

Extend `career-intelligence/Makefile`:

```makefile
.PHONY: api-serve api-test api-migrate compose-up compose-down

compose-up:
	docker compose up -d

compose-down:
	docker compose down

api-serve:
	cd apps/api && php artisan serve

api-migrate:
	cd apps/api && php artisan migrate

api-test:
	cd apps/api && ./vendor/bin/pest

api-horizon:
	cd apps/api && php artisan horizon
```

---

## 12. Version lock summary (record in PR)

| Component | Locked / chosen for R1a start |
|-----------|-------------------------------|
| Laravel | **13.x** (`composer create-project laravel/laravel apps/api "^13.0"`) |
| PHP | **8.3+** (local **8.4** recommended) |
| Sanctum | Current major compatible with L13 |
| Horizon | Current major compatible with L13 |
| Pennant | Current major compatible with L13 |
| PostgreSQL | **16** (Docker image) |
| Redis | **7** (Docker image) |
| Object storage local | MinIO (S3 API) |
| Test runner | **Pest** |
| Static analysis | **Larastan / PHPStan** |
| Formatter | **Pint** |

Pin exact versions in `composer.lock` after first successful install and commit the lockfile.

---

## 13. What not to do in this scaffold

- Do not install Inertia/React starter kit inside `apps/api`
- Do not use MySQL if baseline says PostgreSQL
- Do not call AI vendors from controllers — only via future `Modules/Ai` manager
- Do not make resume the source of truth for career identity
- Do not skip the success/error JSON envelope

---

## 14. Done criteria for sequence item #1

- [ ] `apps/api` exists on Laravel **13.x**
- [ ] `php artisan --version` reports 13.x
- [ ] Postgres + Redis up via Compose
- [ ] `GET /api/v1/health` returns envelope `{ success, data, meta }`
- [ ] Sanctum installed; User model ready for API tokens
- [ ] Horizon installed
- [ ] Pest runs green on a sample test
- [ ] `.env.example` documents required vars (no secrets committed)
- [ ] Nested `.git` removed; monorepo tracks `apps/api`

**Next:** sequence item **#2–3** (envelope everywhere + OpenAPI) — see `docs/implementation-sequence-r1a.md`.
