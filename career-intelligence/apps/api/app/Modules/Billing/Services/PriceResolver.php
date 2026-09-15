<?php

namespace App\Modules\Billing\Services;

use App\Models\Plan;
use App\Models\PlanPrice;
use InvalidArgumentException;

final class PriceResolver
{
    public function resolve(string $planCode, ?string $countryCode, string $interval = PlanPrice::INTERVAL_MONTH): PlanPrice
    {
        $plan = Plan::query()
            ->where('code', $planCode)
            ->where('status', Plan::STATUS_ACTIVE)
            ->first();

        if ($plan === null) {
            throw new InvalidArgumentException("Unknown or inactive plan: {$planCode}");
        }

        if ($plan->code === Plan::CODE_FREE) {
            throw new InvalidArgumentException('Free plan is not purchasable.');
        }

        $country = strtoupper($countryCode ?: PlanPrice::COUNTRY_DEFAULT);
        if ($country === '') {
            $country = PlanPrice::COUNTRY_DEFAULT;
        }

        $price = PlanPrice::query()
            ->where('plan_id', $plan->id)
            ->where('interval', $interval)
            ->where('status', PlanPrice::STATUS_ACTIVE)
            ->where('country_code', $country)
            ->first();

        if ($price === null && $country !== PlanPrice::COUNTRY_DEFAULT) {
            $price = PlanPrice::query()
                ->where('plan_id', $plan->id)
                ->where('interval', $interval)
                ->where('status', PlanPrice::STATUS_ACTIVE)
                ->where('country_code', PlanPrice::COUNTRY_DEFAULT)
                ->first();
        }

        if ($price === null) {
            throw new InvalidArgumentException(
                "No active price for plan {$planCode}, country {$country}, interval {$interval}."
            );
        }

        return $price;
    }
}
