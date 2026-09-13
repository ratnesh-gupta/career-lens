.PHONY: dev build lint test format typecheck clean install api-serve api-test api-migrate compose-up compose-down

# Start the web dev server
dev:
	pnpm dev

# Production build
build:
	pnpm build

# Lint all packages
lint:
	pnpm lint

# Run all unit tests
test:
	pnpm test

# Run E2E tests (requires dev server)
test-e2e:
	pnpm test:e2e

# Format source files
format:
	pnpm format

# TypeScript type-check all packages
typecheck:
	pnpm typecheck

# Install dependencies
install:
	pnpm install

# Remove build artifacts and node_modules
clean:
	pnpm clean

# Full reset: clean + reinstall
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