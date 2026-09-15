<?php

namespace App\Modules\Billing\Actions;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;

/**
 * Every user gets an internal free subscription if none is effective.
 * Idempotent — safe on register and lazy repair paths.
 */
final class EnsureFreeSubscriptionForUser
{
    public function __invoke(User $user): Subscription
    {
        $existing = Subscription::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [Subscription::STATUS_ACTIVE, Subscription::STATUS_TRIALING])
            ->orderByDesc('id')
            ->first();

        if ($existing !== null && $existing->isEffective()) {
            return $existing;
        }

        $freePlan = Plan::query()
            ->where('code', Plan::CODE_FREE)
            ->where('status', Plan::STATUS_ACTIVE)
            ->firstOrFail();

        return Subscription::query()->create([
            'user_id' => $user->id,
            'provider' => Subscription::PROVIDER_INTERNAL,
            'plan_id' => $freePlan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'started_at' => now(),
            'expires_at' => null,
        ]);
    }
}
