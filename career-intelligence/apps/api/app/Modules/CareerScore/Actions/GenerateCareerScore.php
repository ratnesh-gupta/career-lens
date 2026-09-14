<?php

namespace App\Modules\CareerScore\Actions;

use App\Models\CareerProfile;
use App\Models\CareerScore;

final class GenerateCareerScore
{
    public function __construct(
        private readonly ComputeStubCareerScore $compute,
    ) {}

    public function __invoke(
        CareerProfile $profile,
        ?string $evidenceResumeUuid = null,
        ?string $targetRoleUuid = null,
    ): CareerScore {
        $computed = ($this->compute)($profile, $evidenceResumeUuid);

        return CareerScore::query()->create([
            'career_profile_id' => $profile->id,
            'evidence_resume_uuid' => $evidenceResumeUuid,
            'target_role_uuid' => $targetRoleUuid,
            'score' => $computed['score'],
            'score_version' => $computed['score_version'],
            'status' => 'completed',
            'grade' => $computed['grade'],
            'percentile' => $computed['percentile'],
            'market_readiness' => $computed['market_readiness'],
            'breakdown_json' => $computed['breakdown'],
            'meta_json' => [
                'owned_by' => 'career_profile',
                'career_profile_uuid' => $profile->uuid,
            ],
            'is_public' => false,
            'share_token' => null,
            'generated_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);
    }
}
