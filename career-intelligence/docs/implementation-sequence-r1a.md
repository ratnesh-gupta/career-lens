# R1a implementation sequence

**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1–11** | Scaffold through super-admin | ✅ |
| **12** | Staging CI → deploy | ✅ |

## #12 notes

- CI: `.github/workflows/ci.yml` (OpenAPI, FE, BE, Docker smoke)
- Deploy: `.github/workflows/deploy-staging.yml` → EC2 via SSH on `develop`
- Images: `deploy/docker/Dockerfile.api` + `Dockerfile.web`
- Compose: `deploy/docker-compose.staging.yml`
- Guide: [deploy-staging.md](./deploy-staging.md)
- Readiness: `GET /api/v1/ready`

## R1a sequence complete

Next work is outside this list (production deploy hardening, real AI provider, OCR, R1b).
