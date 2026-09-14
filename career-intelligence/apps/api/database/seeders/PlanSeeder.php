<?php

namespace Database\Seeders;

use App\Models\Entitlement;
use App\Models\Plan;
use App\Modules\Billing\FeatureCodes;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $free = Plan::query()->updateOrCreate(
            ['code' => Plan::CODE_FREE],
            [
                'name' => 'Free',
                'description' => 'Career Score and limited optimization.',
                'status' => Plan::STATUS_ACTIVE,
                'sort_order' => 0,
            ],
        );

        $pro = Plan::query()->updateOrCreate(
            ['code' => Plan::CODE_PRO],
            [
                'name' => 'Pro',
                'description' => 'Higher quotas and full optimization toolkit.',
                'status' => Plan::STATUS_ACTIVE,
                'sort_order' => 10,
            ],
        );

        $this->seedEntitlements($free, [
            FeatureCodes::TARGET_ROLES_MAX => 2,
            FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH => 1,
            FeatureCodes::AI_REWRITES_PER_MONTH => 5,
            FeatureCodes::JD_ANALYSIS => 0,
            FeatureCodes::PDF_EXPORTS_PER_MONTH => 1,
            FeatureCodes::RESUME_VERSIONS_MAX => 5,
        ]);

        $this->seedEntitlements($pro, [
            FeatureCodes::TARGET_ROLES_MAX => 20,
            FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH => 30,
            FeatureCodes::AI_REWRITES_PER_MONTH => 200,
            FeatureCodes::JD_ANALYSIS => 1,
            FeatureCodes::PDF_EXPORTS_PER_MONTH => 50,
            FeatureCodes::RESUME_VERSIONS_MAX => null, // unlimited
        ]);
    }

    /**
     * @param  array<string, int|null>  $limits
     */
    private function seedEntitlements(Plan $plan, array $limits): void
    {
        foreach ($limits as $code => $limit) {
            Entitlement::query()->updateOrCreate(
                [
                    'plan_id' => $plan->id,
                    'feature_code' => $code,
                ],
                [
                    'limit_value' => $limit,
                    'metadata_json' => null,
                ],
            );
        }
    }
}
