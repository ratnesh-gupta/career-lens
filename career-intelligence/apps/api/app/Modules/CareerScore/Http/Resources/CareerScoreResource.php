<?php

namespace App\Modules\CareerScore\Http\Resources;

use App\Models\CareerScore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CareerScore
 */
class CareerScoreResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var CareerScore $score */
        $score = $this->resource;
        $profile = $score->relationLoaded('careerProfile')
            ? $score->careerProfile
            : $score->careerProfile()->first();

        $meta = $score->meta_json ?? [];

        return [
            'id' => $score->uuid,
            'careerProfileId' => $profile?->uuid,
            'evidenceResumeId' => $score->evidence_resume_uuid,
            'targetRoleId' => $score->target_role_uuid,
            'userId' => $profile?->user?->uuid,
            'resumeId' => $score->evidence_resume_uuid,
            'overallScore' => $score->score,
            'percentile' => $score->percentile,
            'grade' => $score->grade,
            'marketReadiness' => $score->market_readiness,
            'scoreVersion' => $score->score_version,
            'status' => $score->status,
            'breakdown' => $score->breakdown_json ?? [],
            'strengths' => $meta['strengths'] ?? [],
            'weaknesses' => $meta['weaknesses'] ?? [],
            'recommendations' => $meta['recommendations'] ?? [],
            'industryBenchmark' => $meta['industry_benchmark'] ?? null,
            'roleMatch' => $meta['role_match'] ?? null,
            'shareToken' => $score->share_token,
            'isPublic' => (bool) $score->is_public,
            'generatedAt' => $score->generated_at?->toIso8601String(),
            'expiresAt' => $score->expires_at?->toIso8601String(),
        ];
    }
}
