<?php

namespace App\Modules\Billing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Modules\Billing\Actions\EnsureFreeSubscriptionForUser;
use App\Modules\Billing\Services\EntitlementService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function plans(): JsonResponse
    {
        $plans = Plan::query()
            ->with('entitlements')
            ->where('status', Plan::STATUS_ACTIVE)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Plan $plan) => [
                'id' => $plan->uuid,
                'code' => $plan->code,
                'name' => $plan->name,
                'description' => $plan->description,
                'entitlements' => $plan->entitlements->map(fn ($e) => [
                    'featureCode' => $e->feature_code,
                    'limit' => $e->limit_value,
                    'unlimited' => $e->isUnlimited(),
                ])->values()->all(),
            ]);

        return ApiResponse::success(['items' => $plans]);
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
}
