# CareerLens — run from career-intelligence/
# Usage: make help | make setup | make compose-up | make api-serve | make dev

.PHONY: help setup install \
	compose-up compose-up-core compose-down compose-down-v compose-ps compose-logs compose-malware \
	api-setup api-install api-key api-migrate api-fresh api-serve api-queue api-horizon api-test api-test-filter api-pint api-routes api-promote \
	dev build lint test test-e2e format typecheck clean reset \
	ci ci-fe ci-api openapi-lint \
	docker-build-api docker-build-web \
	health ready

# Default target
help:
	@echo ""
	@echo "CareerLens Makefile (run from career-intelligence/)"
	@echo ""
	@echo "  Setup"
	@echo "    make setup              One-time: install JS + API deps, env files, key, migrate"
	@echo "    make install            pnpm install"
	@echo "    make api-setup          Composer + .env + key + migrate (apps/api)"
	@echo ""
	@echo "  Infrastructure (Docker)"
	@echo "    make compose-up         Postgres + Redis + MinIO (+ init bucket)"
	@echo "    make compose-up-core    Same as compose-up"
	@echo "    make compose-malware    Also start ClamAV profile"
	@echo "    make compose-ps         Status"
	@echo "    make compose-logs       Tail all compose logs"
	@echo "    make compose-down       Stop containers"
	@echo "    make compose-down-v     Stop + delete volumes (wipe data)"
	@echo ""
	@echo "  Backend (Laravel)"
	@echo "    make api-serve          php artisan serve (:8000)"
	@echo "    make api-queue          queue:work redis"
	@echo "    make api-horizon        Horizon"
	@echo "    make api-migrate        migrate"
	@echo "    make api-fresh          migrate:fresh (destructive)"
	@echo "    make api-test           Pest suite"
	@echo "    make api-test-filter F=Auth"
	@echo "    make api-pint           Format PHP (Pint)"
	@echo "    make api-routes         route:list"
	@echo "    make api-promote EMAIL=you@example.com"
	@echo ""
	@echo "  Frontend (Vite)"
	@echo "    make dev                Web dev server (:5173)"
	@echo "    make build             Production build"
	@echo "    make test              Unit tests (workspace)"
	@echo "    make test-e2e          Playwright"
	@echo "    make typecheck         TypeScript"
	@echo "    make lint              ESLint"
	@echo "    make format            Prettier"
	@echo ""
	@echo "  Quality / CI locally"
	@echo "    make ci                Frontend CI-ish + API tests"
	@echo "    make ci-fe             typecheck + test + build"
	@echo "    make ci-api            composer + pest"
	@echo "    make openapi-lint      Lint OpenAPI YAML"
	@echo ""
	@echo "  Smoke"
	@echo "    make health            GET /api/v1/health"
	@echo "    make ready            GET /api/v1/ready"
	@echo ""
	@echo "Daily full stack:  make compose-up  |  make api-serve  |  make api-queue  |  make dev"
	@echo ""

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

install:
	pnpm install

setup: install api-setup web-env
	@echo ""
	@echo "Setup complete. Next:"
	@echo "  make compose-up"
	@echo "  make api-serve    # terminal 1"
	@echo "  make api-queue    # terminal 2"
	@echo "  make dev          # terminal 3 → http://localhost:5173"
	@echo ""

web-env:
	@test -f apps/web/.env.local || cp apps/web/.env.example apps/web/.env.local
	@echo "apps/web/.env.local ready (VITE_ENABLE_MSW=false by default)"

api-setup: api-install api-env api-key api-migrate

api-install:
	cd apps/api && composer install --no-interaction

api-env:
	@test -f apps/api/.env || cp apps/api/.env.example apps/api/.env
	@echo "apps/api/.env ready"

api-key:
	cd apps/api && php artisan key:generate --force

# ---------------------------------------------------------------------------
# Docker Compose
# ---------------------------------------------------------------------------

compose-up: compose-up-core

compose-up-core:
	docker compose up -d postgres redis minio minio-init

compose-malware:
	docker compose --profile malware up -d postgres redis minio minio-init clamav

compose-down:
	docker compose down

compose-down-v:
	docker compose down -v

compose-ps:
	docker compose ps

compose-logs:
	docker compose logs -f --tail=100

# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------

api-migrate:
	cd apps/api && php artisan migrate --force

api-fresh:
	cd apps/api && php artisan migrate:fresh --force

api-serve:
	cd apps/api && php artisan serve

api-queue:
	cd apps/api && php artisan queue:work redis --tries=3 --timeout=120

api-horizon:
	cd apps/api && php artisan horizon

api-test:
	cd apps/api && php artisan test

api-test-filter:
	cd apps/api && php artisan test --filter=$(F)

api-pint:
	cd apps/api && ./vendor/bin/pint

api-routes:
	cd apps/api && php artisan route:list

api-promote:
	@test -n "$(EMAIL)" || (echo "Usage: make api-promote EMAIL=you@example.com" && exit 1)
	cd apps/api && php artisan admin:promote $(EMAIL)

# ---------------------------------------------------------------------------
# Frontend / workspace
# ---------------------------------------------------------------------------

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

test:
	pnpm test

test-e2e:
	pnpm test:e2e

format:
	pnpm format

typecheck:
	pnpm typecheck

clean:
	pnpm clean

reset: clean install

# ---------------------------------------------------------------------------
# CI-ish
# ---------------------------------------------------------------------------

ci: ci-fe ci-api

ci-fe:
	pnpm install --frozen-lockfile
	pnpm typecheck
	pnpm --filter @careerlens/web test
	pnpm --filter @careerlens/web build

ci-api:
	cd apps/api && composer install --no-interaction
	cd apps/api && php artisan test

openapi-lint:
	npx --yes @redocly/cli@1 lint docs/api/openapi-v1.yaml || \
		python3 -c "import yaml; yaml.safe_load(open('docs/api/openapi-v1.yaml')); print('openapi yaml ok')"

# ---------------------------------------------------------------------------
# Docker images (optional)
# ---------------------------------------------------------------------------

docker-build-api:
	docker build -f deploy/docker/Dockerfile.api -t careerlens-api:local apps/api

docker-build-web:
	docker build -f deploy/docker/Dockerfile.web \
		--build-arg VITE_API_BASE_URL=http://localhost:8000/api/v1 \
		--build-arg VITE_ENABLE_MSW=false \
		-t careerlens-web:local .

# ---------------------------------------------------------------------------
# Smoke
# ---------------------------------------------------------------------------

health:
	@curl -fsS http://localhost:8000/api/v1/health && echo ""

ready:
	@curl -fsS http://localhost:8000/api/v1/ready && echo ""
