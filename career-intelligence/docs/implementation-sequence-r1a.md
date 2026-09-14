# R1a implementation sequence

**Last updated:** 2026-09-14

## Progress

| # | Item | Status |
|---|------|--------|
| **1–10** | Scaffold through FE real API | ✅ |
| **11** | Super-admin Reprocess + admin | ✅ |
| **12** | Staging CI → deploy | ⬜ Next |

## #11 notes

- `users.role` includes `super_admin`
- Middleware `super_admin` on `/api/v1/admin/*`
- Admin: overview, resume list + **reprocess**, user list
- FE: `/admin`, `/admin/resumes`, `/admin/users` + `RequireAdmin`
- Promote: `php artisan admin:promote you@example.com`
