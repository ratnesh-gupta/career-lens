# R1a implementation sequence

**Status:** Active  
**Audience:** Engineering  
**Aligned with:** `CAREERLENS-ENGINEERING-BASELINE-V1.1-FINAL`  
**Last updated:** 2026-09-14

Single ordered list that merges early risk resolution with the baseline-driven backend sequence.

Frontend R1a (Steps 1–6 under `apps/web`) is complete against MSW. This sequence is the path to a real Laravel API and production-shaped R1a.

---

## Progress

| # | Item | Status |
|---|------|--------|
| **1** | Scaffold `apps/api` Laravel 13 modular monolith | ✅ Done (follow-ups: env + HasApiTokens applied with #2) |
| **2** | Standardise API envelope on Laravel + MSW + FE client | ✅ Done (2026-09-14) |
| **3** | OpenAPI + generated FE client | ⬜ Next |
| **4** | Career Profile canonical domain | ⬜ |
| **5** | Score on `career_profile_id` | ⬜ |
| **6** | Resume pipeline + PII + AI stub | ⬜ |
| **7** | Deterministic Career Score | ⬜ |
| **8** | Malware scanning + real S3 | ⬜ |
| **9** | Public profile parity | ⬜ |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

---

## Ordered work items (detail)

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

### Envelope contract (#2)

Success:

```json
{ "success": true, "data": {}, "meta": {} }
```

Error (HTTP status on the response):

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

Implementation:

- API: `App\Support\ApiResponse` + exception renders in `bootstrap/app.php`
- FE types: `packages/shared-types` `ApiResponse` / `ApiError`
- FE client: `apps/web/src/services/api-client.ts` unwrap + axios error mapping
- MSW: `apps/web/src/mocks/envelope.ts` (`ok` / `fail`)

---

## Related docs

- [backend/laravel-setup-r1a.md](./backend/laravel-setup-r1a.md)
- Engineering baseline (locked decisions)
