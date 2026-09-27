<?php

namespace App\Http\Middleware;

use App\Modules\Billing\Services\EntitlementService;
use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEntitlement
{
    public function __construct(
        private readonly EntitlementService $entitlements,
    ) {}

    /**
     * @param  string  $feature  Feature code (see FeatureCodes)
     * @param  int  $amount  Units required for this action (default 1)
     */
    public function handle(Request $request, Closure $next, string $feature, int $amount = 1): Response
    {
        $user = $request->user();

        if ($user === null) {
            return ApiResponse::error('UNAUTHENTICATED', 'Unauthenticated.', [], 401);
        }

        if (! $this->entitlements->can($user, $feature, $amount)) {
            return ApiResponse::error(
                'ENTITLEMENT_REQUIRED',
                'Your current plan does not allow this action. Upgrade to continue.',
                [
                    'feature' => $feature,
                    'required' => $amount,
                    'remaining' => $this->entitlements->remaining($user, $feature),
                ],
                403,
            );
        }

        return $next($request);
    }
}
