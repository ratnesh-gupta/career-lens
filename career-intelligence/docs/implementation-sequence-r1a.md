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
| **7** | Deterministic Career Score (full engine) | ✅ |
| **8** | Malware scanning + real S3 | ⬜ Next |
| **9** | Public profile parity | ⬜ |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

## #7 notes

- Engine: `App\Modules\CareerScore\Engine\DeterministicScoreEngine`
- Version config: `config/score.php` — current **`r1a-1.0`**
- Categories: profile_completeness, resume_quality, experience, skill_alignment, career_progression, target_role_alignment
- Optional evidence: resume analysis improves `resume_quality` / `skill_alignment`
- Output includes breakdown, strengths, weaknesses, recommendations (stored in `meta_json`)
- Same inputs ⇒ same score (covered by unit + feature tests)
