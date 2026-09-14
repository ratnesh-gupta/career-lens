# R1a implementation sequence

**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1–7** | Scaffold → deterministic score | ✅ |
| **8** | Malware scanning + real S3 | ✅ |
| **9** | Public profile parity | ⬜ Next |
| **10** | FE → real API; shrink MSW | ⬜ |
| **11** | Super-admin Reprocess + admin | ⬜ |
| **12** | Staging CI → deploy | ⬜ |

## #8 notes

- `ResumeObjectStore` — private paths, presigned PUT when S3/MinIO available
- Confirm gate: exists → size → PDF magic → **malware scan** → process job
- Scanners: `passthrough` | `clamav` | `none`
- Compose: MinIO + `minio-init` bucket; optional `clamav` profile
- Docs: [backend/storage-and-malware.md](./backend/storage-and-malware.md)
