<?php

namespace App\Modules\Billing\Services;

use App\Models\Entitlement;
use App\Models\EntitlementUsage;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Modules\Billing\FeatureCodes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final class EntitlementService
{
    public function resolvePlan(User $user): Plan
    {
        $subscription = Subscription::query()
            ->with('plan.entitlements')
            ->where('user_id', $user->id)
            ->whereIn('status', [Subscription::STATUS_ACTIVE, Subscription::STATUS_TRIALING])
            ->orderByDesc('started_at')
            ->orderByDesc('id')
            ->first();

        if ($subscription !== null && $subscription->isEffective() && $subscription->plan !== null) {
            return $subscription->plan;
        }

        return Plan::query()
            ->with('entitlements')
            ->where('code', Plan::CODE_FREE)
            ->where('status', Plan::STATUS_ACTIVE)
            ->firstOrFail();
    }

    public function entitlementFor(User $user, string $featureCode): ?Entitlement
    {
        $plan = $this->resolvePlan($user);

        return $plan->entitlements->firstWhere('feature_code', $featureCode)
            ?? $plan->entitlements()->where('feature_code', $featureCode)->first();
    }

    public function can(User $user, string $featureCode, int $amount = 1): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        $entitlement = $this->entitlementFor($user, $featureCode);

        if ($entitlement === null) {
            return false;
        }

        if (FeatureCodes::isBoolean($featureCode)) {
            return $entitlement->isBooleanEnabled();
        }

        if ($entitlement->isUnlimited()) {
            return true;
        }

        $limit = (int) $entitlement->limit_value;

        if (FeatureCodes::isMetered($featureCode)) {
            $used = $this->usedInCurrentPeriod($user, $featureCode);

            return ($used + $amount) <= $limit;
        }

        // Cap-style features (max roles / max versions): caller supplies current count via amount
        // Convention: can($user, code, $currentCount + 1) or remaining compares against current.
        return $amount <= $limit;
    }

    public function remaining(User $user, string $featureCode): ?int
    {
        if ($user->isSuperAdmin()) {
            return null; // unlimited
        }

        $entitlement = $this->entitlementFor($user, $featureCode);

        if ($entitlement === null) {
            return 0;
        }

        if (FeatureCodes::isBoolean($featureCode)) {
            return $entitlement->isBooleanEnabled() ? 1 : 0;
        }

        if ($entitlement->isUnlimited()) {
            return null;
        }

        $limit = (int) $entitlement->limit_value;

        if (FeatureCodes::isMetered($featureCode)) {
            return max(0, $limit - $this->usedInCurrentPeriod($user, $featureCode));
        }

        return $limit;
    }

    /**
     * Consume metered usage. Returns false if not allowed.
     */
    public function consume(User $user, string $featureCode, int $amount = 1): bool
    {
        if ($amount < 1) {
            return true;
        }

        if (! FeatureCodes::isMetered($featureCode)) {
            return $this->can($user, $featureCode, $amount);
        }

        if ($user->isSuperAdmin()) {
            return true;
        }

        return DB::transaction(function () use ($user, $featureCode, $amount) {
            if (! $this->can($user, $featureCode, $amount)) {
                return false;
            }

            $periodKey = $this->currentPeriodKey();

            $usage = EntitlementUsage::query()->firstOrCreate(
                [
                    'user_id' => $user->id,
                    'feature_code' => $featureCode,
                    'period_key' => $periodKey,
                ],
                ['used_count' => 0],
            );

            // Lock row for concurrent safety
            $usage = EntitlementUsage::query()
                ->whereKey($usage->id)
                ->lockForUpdate()
                ->firstOrFail();

            $entitlement = $this->entitlementFor($user, $featureCode);
            $limit = $entitlement?->limit_value;

            if ($limit !== null && ($usage->used_count + $amount) > $limit) {
                return false;
            }

            $usage->used_count += $amount;
            $usage->save();

            return true;
        });
    }

    public function usedInCurrentPeriod(User $user, string $featureCode): int
    {
        $row = EntitlementUsage::query()
            ->where('user_id', $user->id)
            ->where('feature_code', $featureCode)
            ->where('period_key', $this->currentPeriodKey())
            ->first();

        return $row?->used_count ?? 0;
    }

    public function currentPeriodKey(?Carbon $at = null): string
    {
        return ($at ?? now())->format('Y-m');
    }

    /**
     * Snapshot for API: plan + each feature limit/remaining/used.
     *
     * @return array{plan: array<string, mixed>, features: list<array<string, mixed>>}
     */
    public function snapshot(User $user): array
    {
        $plan = $this->resolvePlan($user);

        $features = [];

        foreach (FeatureCodes::all() as $code) {
            $entitlement = $plan->entitlements->firstWhere('feature_code', $code);
            $limit = $entitlement?->limit_value;
            $unlimited = $entitlement !== null && $entitlement->isUnlimited();
            $used = FeatureCodes::isMetered($code) ? $this->usedInCurrentPeriod($user, $code) : null;
            $remaining = $this->remaining($user, $code);

            $features[] = [
                'code' => $code,
                'limit' => $unlimited ? null : $limit,
                'unlimited' => $unlimited || $user->isSuperAdmin(),
                'used' => $used,
                'remaining' => $remaining,
                'allowed' => $this->can($user, $code, 1),
            ];
        }

        return [
            'plan' => [
                'id' => $plan->uuid,
                'code' => $plan->code,
                'name' => $plan->name,
                'description' => $plan->description,
            ],
            'periodKey' => $this->currentPeriodKey(),
            'features' => $features,
        ];
    }
}
