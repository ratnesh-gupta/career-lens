# CareerLens API contract (OpenAPI)

**Source of truth (R1a):** [`openapi-v1.yaml`](./openapi-v1.yaml)

Aligned with sequence item **#3** and Engineering Baseline v1.1.

## Envelope

Every JSON response uses:

```json
{ "success": true, "data": {}, "meta": {} }
```

or

```json
{ "success": false, "error": { "code": "...", "message": "...", "details": {} } }
```

Implemented in Laravel as `App\Support\ApiResponse` and on the FE via `@careerlens/shared-types` + MSW `ok`/`fail`.

## Domains covered

| Tag | Paths |
|-----|--------|
| System | `/health` |
| Auth | register, login, logout, me, refresh, forgot/reset password |
| Profile | GET/PATCH `/profile` (canonical Career Profile) |
| Resumes | list, upload-url, confirm, status, analysis, primary, delete |
| Career Score | list, generate, get, share — owned by **career profile** |
| Public | `/public/scores/{token}`, `/public/profiles/{slug}` |
| Referrals | `/referrals/code` |

## Generate TypeScript types

From monorepo root `career-intelligence/`:

```bash
pnpm install
pnpm openapi:generate
```

Writes:

```text
packages/shared-types/src/generated/openapi.ts
```

**Do not hand-edit** the generated file. Change the YAML, then regenerate.

Optional CI check: fail if `git diff --exit-code` on the generated file after `pnpm openapi:generate`.

## Laravel / Scramble

`dedoc/scramble` is installed on `apps/api` for **route-driven** docs later. Until domain controllers exist, **this YAML remains the contract**. When modules land, either:

1. Keep YAML as source and implement routes to match, or  
2. Export from Scramble and diff against this file in CI.

## Versioning

- Spec version: `info.version` (currently `1.0.0`)
- URL prefix: `/api/v1`
