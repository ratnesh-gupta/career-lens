# R1a implementation sequence

**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1–8** | Scaffold through S3/malware | ✅ |
| **9** | Public profile parity | ✅ |
| **10** | FE → real API; shrink MSW | ⬜ Next |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

## Storage (dev)

**Local development uses MinIO** (S3-compatible). Staging/production use AWS S3.

```bash
docker compose up -d minio minio-init
# RESUMES_DISK=s3 + AWS_* pointing at localhost:5100
```

## #9 notes

- `GET /api/v1/public/profiles/{slug}` — only if `is_profile_public`
- No salary / private identity fields
- Optional `latestPublicScore` when a shared score exists
- FE: `/p/:slug` real page (was placeholder)
- Endpoint paths aligned: `/public/scores/*`, `/public/profiles/*`
