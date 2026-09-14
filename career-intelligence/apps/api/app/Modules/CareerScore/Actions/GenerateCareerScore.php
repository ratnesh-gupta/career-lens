<?php

namespace App\Modules\CareerScore\Actions;

use App\Models\CareerProfile;
use App\Models\CareerScore;
use App\Models\Resume;
use App\Modules\CareerScore\Engine\DeterministicScoreEngine;

final class GenerateCareerScore
{
    public function __construct(
        private readonly DeterministicScoreEngine $engine,
    ) {}

    public function __invoke(
        CareerProfile $profile,
        ?string $evidenceResumeUuid = null,
        ?string $targetRoleUuid = null,
    ): CareerScore {
        $resume = null;
        $analysis = null;

        if ($evidenceResumeUuid) {
            $resume = Resume::query()
                ->where('uuid', $evidenceResumeUuid)
                ->where('career_profile_id', $profile->id)
                ->with('analysis')
                ->first();

            $analysis = $resume?->analysis;
        }

        $computed = $this->engine->compute($profile, $resume, $analysis);

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
                'strengths' => $computed['strengths'],
                'weaknesses' => $computed['weaknesses'],
                'recommendations' => $computed['recommendations'],
                'industry_benchmark' => $computed['industry_benchmark'],
                'role_match' => $computed['role_match'],
            ],
            'is_public' => false,
            'share_token' => null,
            'generated_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);
    }
}
