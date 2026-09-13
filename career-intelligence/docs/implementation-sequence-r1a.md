# R1a implementation sequence

**Status:** Active  
**Audience:** Engineering  
**Aligned with:** `CAREERLENS-ENGINEERING-BASELINE-V1.1-FINAL`  
**Last updated:** 2026-09-13

Single ordered list that merges early risk resolution with the baseline-driven backend sequence.

Frontend R1a (Steps 1–6 under `apps/web`) is complete against MSW. This sequence is the path to a real Laravel API and production-shaped R1a.

---

## Current monorepo shape

```text
career-intelligence/
├── apps/
│   └── web/                 # React 18 + Vite (R1a UI done)
├── packages/
│   └── shared-types/        # Hand-written TS contracts (to be OpenAPI-generated)
├── docs/
│   ├── decisions/
│   ├── implementation-sequence-r1a.md   # this file
│   └── backend/
│       └── laravel-setup-r1a.md         # detailed Laravel scaffold
├── Makefile
├── package.json             # pnpm workspace (JS only today)
└── README.md
```

**Missing today (baseline target):**

```text
apps/api/                    # Laravel modular monolith
infrastructure/docker/
docker-compose.yml
```

---

## Ordered work items

| # | Work item | Resolves |
|---|-----------|----------|
| **1** | Scaffold `apps/api` Laravel modular monolith (Sanctum, modules, Horizon, Postgres/Redis/S3 via Compose) | Foundation |
| **2** | Standardise API envelope `{ success, data, meta }` / error shape on MSW + FE client + Laravel | Risk: envelope drift |
| **3** | Publish OpenAPI (auth, profile, resume, score, public share); generate FE TypeScript client in CI | Risk: hand types; baseline OpenAPI |
| **4** | Career Profile as canonical domain (schema + APIs); resume is evidence only | Risk: profile vs resume |
| **5** | Career Score owned by `career_profile_id` (optional `evidence_resume_id` / `target_role_id`) | Risk: score ownership |
| **6** | Resume pipeline: validate → private S3 → async job → extract → PII sanitize → AI Manager stub → normalize → profile update → analysis | Baseline pipeline |
| **7** | Deterministic Career Score with versioned category weights | Baseline scoring |
| **8** | Malware scanning + real S3 (signed URLs, private objects) on upload path | Risk: prod uploads |
| **9** | Public profile (`/p/:slug`) to parity with public score; privacy-by-default | Risk: profile vs score public |
| **10** | Point FE at real API; shrink MSW to fallback / offline-dev only | Dual-world end |
| **11** | Super-admin Reprocess Resume + minimal admin screens | Risk: R1a ops |
| **12** | Staging CI → deploy path (GitHub Actions → develop → staging → production) | Baseline CI/CD |

### Checkpoints

- **After #3** — Contract frozen; FE and API can parallelise.
- **After #7** — Upload → score works on Compose locally.
- **After #10** — MSW is not source of truth.
- **After #12** — R1a matches baseline for first production target.

---

## Item notes

### 1 — Scaffold API

See **[backend/laravel-setup-r1a.md](./backend/laravel-setup-r1a.md)** for exact commands, versions, and target folder layout under `apps/api`.

### 2 — Envelope

Success:

```json
{ "success": true, "data": {}, "meta": {} }
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

Apply to Laravel API resources/exceptions, MSW handlers, and `apps/web` HTTP client parsing.

### 3 — OpenAPI

- Source of truth: OpenAPI under `docs/api/` or exported from Laravel.
- Generate client into `packages/shared-types` or `apps/web/src/generated`.
- CI fails if generated output is dirty.

### 4–5 — Profile & score ownership

- Migrations and domain services use `career_profiles` as aggregate root.
- Scores link `career_profile_id`; resume is `evidence_resume_id` only.
- FE copy and routes should not imply “the resume is the user.”

### 6–8 — Pipeline & storage

- PDF only; reject image-only scans (OCR deferred).
- Jobs: retryable, idempotent, observable (Horizon).
- AI only via AI Manager stub first (fake provider OK).
- Production path requires private S3 + malware scan (not MSW).

### 9–11 — Public surface & admin

- Public score already strong on FE; public profile must match baseline.
- Admin is super-admin only; critical action: **Reprocess Resume**.

### 12 — Deploy

- GitHub Actions; no long-lived cloud credentials in repo.
- Docker Compose for local and R1 deploy shape per baseline.

---

## Out of scope for this sequence

- R1b optimization, billing, JD analysis
- AI vendor selection (not locked)
- DOCX / OCR (R1c)

---

## Related docs

- Engineering baseline (locked decisions)
- `docs/backend/laravel-setup-r1a.md` — Laravel 13 install steps
- `apps/web` README / monorepo README — frontend runbook
