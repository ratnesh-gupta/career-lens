# R1b Sequence #1 — Entitlements foundation

**Branch:** `feature/r1b-01-entitlements`  
**Status:** Implemented (pending CI / local Pest verification)

## Delivered

### Backend
- Migrations: `plans`, `entitlements`, `subscriptions`, `entitlement_usages`
- Models: `Plan`, `Entitlement`, `Subscription`, `EntitlementUsage`
- `App\Modules\Billing\FeatureCodes`
- `EntitlementService` — resolve plan, `can`, `remaining`, `consume`, `snapshot`
- `EnsureFreeSubscriptionForUser` — called from `AuthController::register`
- `EnsureEntitlement` middleware alias `entitlement:{feature}`
- API:
  - `GET /api/v1/billing/plans` (public)
  - `GET /api/v1/billing/entitlements` (auth)
- `PlanSeeder` — free + pro limits (product-tunable)
- Pest: `tests/Feature/EntitlementTest.php`

### Frontend
- `@careerlens/shared-types` billing types
- `billingApi` + `EP.BILLING_*`
- `useEntitlements` + `EntitlementGate`

## Acceptance checklist

- [x] Free user has deterministic limits via seeder
- [x] Middleware can deny over-limit actions (`ENTITLEMENT_REQUIRED`)
- [x] Pest coverage for resolve / consume / deny / pro unlock / super-admin bypass
- [x] No Stripe dependency

## Follow-ups (Sequence #2+)

- Stripe Checkout / webhooks map price → plan
- OpenAPI paths for billing (regenerate shared-types generated)
- Wire `EntitlementGate` into optimization/export routes when those land
- Optional: MSW handlers for billing endpoints
