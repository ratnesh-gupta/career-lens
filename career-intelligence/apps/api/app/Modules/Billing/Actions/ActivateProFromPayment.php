<?php

namespace App\Modules\Billing\Actions;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Carbon;

/**
 * Promote user to an active Razorpay-backed pro subscription.
 * Idempotent when already on active pro from razorpay.
 */
final class ActivateProFromPayment
{
    public function __invoke(
        User $user,
        string $interval = 'month',
        ?string $providerSubscriptionId = null,
        ?string $providerCustomerId = null,
    ): Subscription {
        $pro = Plan::query()
            ->where('code', Plan::CODE_PRO)
            ->where('status', Plan::STATUS_ACTIVE)
            ->firstOrFail();

        $expiresAt = $interval === 'year'
            ? Carbon::now()->addYear()
            : Carbon::now()->addMonth();

        $existing = Subscription::query()
            ->where('user_id', $user->id)
            ->where('status', Subscription::STATUS_ACTIVE)
            ->orderByDesc('id')
            ->first();

        if ($existing !== null) {
            // Supersede free/internal with razorpay pro
            if ($existing->provider === Subscription::PROVIDER_INTERNAL
                || $existing->plan_id !== $pro->id) {
                $existing->status = Subscription::STATUS_CANCELED;
                $existing->save();
            } elseif ($existing->plan_id === $pro->id && $existing->provider === Subscription::PROVIDER_RAZORPAY) {
                $existing->expires_at = $expiresAt;
                if ($providerSubscriptionId) {
                    $existing->provider_subscription_id = $providerSubscriptionId;
                }
                if ($providerCustomerId) {
                    $existing->provider_customer_id = $providerCustomerId;
                }
                $existing->save();

                return $existing;
            }
        }

        return Subscription::query()->create([
            'user_id' => $user->id,
            'provider' => Subscription::PROVIDER_RAZORPAY,
            'provider_customer_id' => $providerCustomerId,
            'provider_subscription_id' => $providerSubscriptionId,
            'plan_id' => $pro->id,
            'status' => Subscription::STATUS_ACTIVE,
            'started_at' => now(),
            'expires_at' => $expiresAt,
        ]);
    }
}
