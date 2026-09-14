# R1a implementation sequence

**Status:** Active  
**Audience:** Engineering  
**Aligned with:** `CAREERLENS-ENGINEERING-BASELINE-V1.1-FINAL`  
**Last updated:** 2026-09-14

---

## Progress

| # | Item | Status |
|---|------|--------|
| **1** | Scaffold `apps/api` Laravel 13 modular monolith | ✅ Done |
| **2** | Standardise API envelope on Laravel + MSW + FE client | ✅ Done |
| **3** | OpenAPI + generated FE types | ✅ Done (contract + generate pipeline) |
| **4** | Career Profile as canonical domain | ⬜ Next |
| **5** | Score on `career_profile_id` | ⬜ |
| **6** | Resume pipeline + PII + AI stub | ⬜ |
| **7** | Deterministic Career Score | ⬜ |
| **8** | Malware scanning + real S3 | ⬜ |
| **9** | Public profile parity | ⬜ |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

---

## #3 notes

- Spec: [`docs/api/openapi-v1.yaml`](./api/openapi-v1.yaml)
- Generate: `pnpm openapi:generate` → `packages/shared-types/src/generated/openapi.ts`
- Hand-written domain types remain under `packages/shared-types/src/{auth,profile,resume,score}.ts` for UI until generated schemas fully replace them
- Score request schema already uses `careerProfileId` + optional `evidenceResumeId` (feeds #5)

---

## Related

- [api/README.md](./api/README.md)
- [backend/laravel-setup-r1a.md](./backend/laravel-setup-r1a.md)
