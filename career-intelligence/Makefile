.PHONY: dev build lint test format typecheck clean install api-serve api-test api-migrate compose-up compose-down ci-fe ci-api docker-build-api docker-build-web

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

install:
	pnpm install

clean:
	pnpm clean

reset: clean install

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

# CI-ish local targets
ci-fe:
	pnpm install --frozen-lockfile
	pnpm typecheck
	pnpm --filter @careerlens/web test
	pnpm --filter @careerlens/web build

ci-api:
	cd apps/api && composer install --no-interaction
	cd apps/api && php artisan test

docker-build-api:
	docker build -f deploy/docker/Dockerfile.api -t careerlens-api:local apps/api

docker-build-web:
	docker build -f deploy/docker/Dockerfile.web \
		--build-arg VITE_API_BASE_URL=http://localhost:8000/api/v1 \
		--build-arg VITE_ENABLE_MSW=false \
		-t careerlens-web:local .
