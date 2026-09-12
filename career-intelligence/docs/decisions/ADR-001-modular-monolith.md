# ADR-001: Modular Monolith with pnpm Workspaces

**Status:** Accepted  
**Date:** 2026-09-12  
**Deciders:** Engineering team

## Context

CareerLens needs a frontend that can ship fast (R1a viral core) while keeping the door open for a backend API, shared component library, and potential micro-frontend split later. We evaluated three structures:

1. Single Vite app (flat)
2. pnpm monorepo (modular monolith)
3. Fully separate repos

## Decision

Use a **pnpm workspace monorepo** (modular monolith). A single repo with clear package boundaries gives us:

- Co-location of frontend, shared types, shared config, and (later) backend
- Atomic commits across package boundaries
- Shared TypeScript types as the contract between frontend and backend
- Zero network round-trips for shared code during development

## Consequences

### Good

- `packages/shared-types` is the single source of truth for API contracts; the backend can be added as `apps/api` later without breaking the frontend
- `packages/shared-config` eliminates copy-paste ESLint / Tailwind config
- Incremental adoption: teams can extract packages into separate repos later if needed

### Neutral

- `pnpm install` installs all workspaces at once; CI must cache `node_modules` carefully
- Strict TypeScript paths (`@careerlens/*`) must be registered in every consuming `tsconfig.json`

### Bad

- Monorepo tooling overhead (workspace protocol, filtering) adds some DX complexity

## Alternatives Considered

- **Flat Vite app**: faster bootstrapping but no path to code sharing with future backend
- **Turborepo**: adds value at scale but is overhead for a 2-3 package repo; revisit at 5+ packages
