.PHONY: dev build lint test format typecheck clean install

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
