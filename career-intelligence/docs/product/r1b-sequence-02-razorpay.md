# R1b Sequence #2 — Razorpay + country pricing

**Branch:** `feature/r1b-02-razorpay-pricing`  
**Depends on:** `feature/r1b-01-entitlements`  
**Status:** Implemented (pending local Pest / Razorpay dashboard activation)

## Locked decisions

- Provider: **Razorpay** (domestic + international)
- Stripe: deferred
- Country prices via `plan_prices`
- Entitlements by plan code only

## Delivered

### Backend
- `plan_prices`, `payments`, `payment_events` migrations
- `PriceResolver` (country → `*` fallback)
- `FakeRazorpayClient` / `HttpRazorpayClient`
- `CreateCheckoutOrder`, `ProcessRazorpayWebhook`, `ActivateProFromPayment`
- API:
  - `GET /billing/plans?country=&interval=`
  - `POST /billing/checkout`
  - `GET /billing/subscription`
  - `POST /billing/webhooks/razorpay`
- PlanSeeder prices: IN/INR, US/USD, */USD (month + year)
- Pest: `tests/Feature/RazorpayBillingTest.php`

### Frontend
- shared-types: `PlanPrice`, `CheckoutPayload`, `SubscriptionSummary`
- `billingApi.plans(country)`, `checkout`, `subscription`

## Seeded pro prices

| Country | Currency | Month | Year |
|---------|----------|-------|------|
| IN | INR | ₹499 | ₹4,999 |
| US | USD | $12 | $99 |
| * | USD | $12 | $99 |

## Ops checklist

1. Enable International Payments on Razorpay account before production
2. Set webhook URL → `POST /api/v1/billing/webhooks/razorpay`
3. Events: `payment.captured`, `order.paid`, `payment.failed`
4. Set `RAZORPAY_FAKE=false` with real keys outside local/test

## Verify

```bash
git checkout feature/r1b-02-razorpay-pricing
cd career-intelligence/apps/api
php artisan migrate
php artisan db:seed --class=PlanSeeder
./vendor/bin/pest --filter=RazorpayBilling
./vendor/bin/pest --filter=Entitlement
```
