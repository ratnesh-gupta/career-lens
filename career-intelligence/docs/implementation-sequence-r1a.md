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
| **3** | OpenAPI + generated FE types | ✅ Done |
| **4** | Career Profile as canonical domain | ✅ Done |
| **5** | Score on `career_profile_id` | ⬜ Next |
| **6** | Resume pipeline + PII + AI stub | ⬜ |
| **7** | Deterministic Career Score | ⬜ |
| **8** | Malware scanning + real S3 | ⬜ |
| **9** | Public profile parity | ⬜ |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

---

## #4 notes

- Table `career_profiles` — one row per user (`user_id` UNIQUE)
- Public API id is `uuid`; internal FK remains bigint
- `GET/PATCH /api/v1/profile` (Sanctum) via `App\Modules\CareerProfile`
- Lazy create on first GET — never imply resume is the user
- Resource maps `bio` ↔ API `summary`; nested experience/skills arrays empty until later steps

---

## Related

- [api/openapi-v1.yaml](./api/openapi-v1.yaml)
- [backend/laravel-setup-r1a.md](./backend/laravel-setup-r1a.md)
