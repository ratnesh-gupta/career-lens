# R1a implementation sequence

**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1** | Scaffold `apps/api` Laravel 13 | ✅ |
| **2** | API envelope | ✅ |
| **3** | OpenAPI + generated FE types | ✅ |
| **4** | Career Profile canonical domain | ✅ |
| **5** | Score on `career_profile_id` | ✅ |
| **6** | Resume pipeline + PII + AI stub | ✅ |
| **7** | Deterministic Career Score (full engine) | ⬜ Next |
| **8** | Malware scanning + real S3 | ⬜ |
| **9** | Public profile parity | ⬜ |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

## #6 notes

- `resumes` + `resume_analyses`; resume always linked to `career_profile_id`
- Flow: `upload-url` → `upload-binary` (local stand-in for S3 PUT) → `confirm` → `ProcessResumeJob`
- Job: extract → **PiiSanitizer** → **AiManager** (`fake` driver) → analysis row → `analyzed`
- AI only via `App\Modules\Ai\AiManager` — no vendor calls from controllers
- Real S3 + malware scan remain **#8**
