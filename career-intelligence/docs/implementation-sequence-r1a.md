# R1a implementation sequence

**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1–9** | Scaffold through public profile | ✅ |
| **10** | FE → real API; shrink MSW | ✅ |
| **11** | Super-admin Reprocess + admin | ⬜ Next |
| **12** | Staging CI → deploy | ⬜ |

## #10 notes

- Sanctum auth: register / login / me / logout / refresh
- MSW **off by default** (`VITE_ENABLE_MSW=false`)
- CORS for SPA + Bearer
- Token key: `careerlens_access_token`
- Guide: [frontend-real-api.md](./frontend-real-api.md)

## Dev storage

Local object storage = **MinIO** (not AWS).
