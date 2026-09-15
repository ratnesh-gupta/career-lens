<?php

namespace App\Modules\Billing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\PlanPrice;
use App\Models\Subscription;
use App\Modules\Billing\Actions\CreateCheckoutOrder;
use App\Modules\Billing\Actions\EnsureFreeSubscriptionForUser;
use App\Modules\Billing\Actions\ProcessRazorpayWebhook;
use App\Modules\Billing\Services\EntitlementService;
use App\Modules\Billing\Services\PriceResolver;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class BillingController extends Controller
{
    public function plans(Request $request, PriceResolver $prices): JsonResponse
    {
        $country = strtoupper((string) $request->query('country', PlanPrice::COUNTRY_DEFAULT));
        if ($country === '') {
            $country = PlanPrice::COUNTRY_DEFAULT;
        }

        $interval = (string) $request->query('interval', PlanPrice::INTERVAL_MONTH);
        if (! in_array($interval, [PlanPrice::INTERVAL_MONTH, PlanPrice::INTERVAL_YEAR], true)) {
            $interval = PlanPrice::INTERVAL_MONTH;
        }

        $plans = Plan::query()
            ->with('entitlements')
            ->where('status', Plan::STATUS_ACTIVE)
            ->orderBy('sort_order')
            ->get()
            ->map(function (Plan $plan) use ($prices, $country, $interval) {
                $row = [
                    'id' => $plan->uuid,
                    'code' => $plan->code,
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'entitlements' => $plan->entitlements->map(fn ($e) => [
                        'featureCode' => $e->feature_code,
                        'limit' => $e->limit_value,
                        'unlimited' => $e->isUnlimited(),
                    ])->values()->all(),
                    'price' => null,
                ];

                if ($plan->code !== Plan::CODE_FREE) {
                    try {
                        $price = $prices->resolve($plan->code, $country, $interval);
                        $row['price'] = [
                            'countryCode' => $price->country_code,
                            'currency' => $price->currency,
                            'amountMinor' => $price->amount_minor,
                            'interval' => $price->interval,
                        ];
                    } catch (InvalidArgumentException) {
                        $row['price'] = null;
                    }
                }

                return $row;
            });

        return ApiResponse::success([
            'items' => $plans,
            'country' => $country,
            'interval' => $interval,
        ]);
    }

    public function entitlements(
        Request $request,
        EntitlementService $service,
        EnsureFreeSubscriptionForUser $ensureFree,
    ): JsonResponse {
        $user = $request->user();
        $ensureFree($user);

        return ApiResponse::success($service->snapshot($user));
    }

    public function subscription(
        Request $request,
        EnsureFreeSubscriptionForUser $ensureFree,
    ): JsonResponse {
        $user = $request->user();
        $ensureFree($user);

        $sub = Subscription::query()
            ->with('plan')
            ->where('user_id', $user->id)
            ->whereIn('status', [Subscription::STATUS_ACTIVE, Subscription::STATUS_TRIALING])
            ->orderByDesc('id')
            ->first();

        if ($sub === null || ! $sub->isEffective()) {
            return ApiResponse::success([
                'status' => 'none',
                'planCode' => Plan::CODE_FREE,
                'provider' => Subscription::PROVIDER_INTERNAL,
                'expiresAt' => null,
            ]);
        }

        return ApiResponse::success([
            'status' => $sub->status,
            'planCode' => $sub->plan?->code ?? Plan::CODE_FREE,
            'provider' => $sub->provider,
            'expiresAt' => $sub->expires_at?->toIso8601String(),
            'startedAt' => $sub->started_at?->toIso8601String(),
        ]);
    }

    public function checkout(Request $request, CreateCheckoutOrder $create): JsonResponse
    {
        $data = $request->validate([
            'planCode' => ['required', 'string', 'in:pro'],
            'interval' => ['required', 'string', 'in:month,year'],
            'countryCode' => ['sometimes', 'nullable', 'string', 'max:2'],
        ]);

        try {
            $payload = $create(
                $request->user(),
                $data['planCode'],
                $data['interval'],
                $data['countryCode'] ?? null,
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error('INVALID_PRICE', $e->getMessage(), [], 422);
        } catch (\Throwable $e) {
            return ApiResponse::error(
                'CHECKOUT_FAILED',
                config('app.debug') ? $e->getMessage() : 'Unable to start checkout.',
                [],
                502,
            );
        }

        return ApiResponse::success($payload, [], 201);
    }

    public function webhook(
        Request $request,
        ProcessRazorpayWebhook $process,
    ): JsonResponse {
        $signature = (string) $request->header('X-Razorpay-Signature', '');
        $raw = $request->getContent();
        $payload = $request->all();

        $result = $process($raw, $signature, $payload);

        if ($result['status'] === 'invalid_signature') {
            return ApiResponse::error('INVALID_SIGNATURE', 'Webhook signature invalid.', [], 400);
        }

        return ApiResponse::success($result);
    }
}
