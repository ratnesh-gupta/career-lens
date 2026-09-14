# R1a implementation sequence

**Status:** Active  
**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1** | Scaffold `apps/api` Laravel 13 | ✅ |
| **2** | API envelope | ✅ |
| **3** | OpenAPI + generated FE types | ✅ |
| **4** | Career Profile canonical domain | ✅ |
| **5** | Score on `career_profile_id` | ✅ |
| **6** | Resume pipeline + PII + AI stub | ⬜ Next |
| **7** | Deterministic Career Score (full weights engine) | ⬜ |
| **8** | Malware scanning + real S3 | ⬜ |
| **9** | Public profile parity | ⬜ |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

## #5 notes

- Table `career_scores.career_profile_id` **required** FK → `career_profiles`
- `evidence_resume_uuid` / `target_role_uuid` optional (no resume FK until #6)
- APIs: `GET/POST /scores`, `GET /scores/{id}`, `POST /scores/{id}/share`, `GET /public/scores/{token}`
- Stub scorer `r1a-stub-1.0` is deterministic from profile fields; full engine is #7
- Resource exposes `careerProfileId` as ownership; `resumeId` is legacy alias of evidence only
