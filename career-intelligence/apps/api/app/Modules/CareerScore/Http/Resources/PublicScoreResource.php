<?php

namespace App\Modules\CareerScore\Http\Resources;

use App\Models\CareerScore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CareerScore
 */
class PublicScoreResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var CareerScore $score */
        $score = $this->resource;
        $profile = $score->careerProfile;
        $meta = $score->meta_json ?? [];
        $strengths = $meta['strengths'] ?? [];
        $weaknesses = $meta['weaknesses'] ?? [];

        $topStrengths = collect($strengths)->take(3)->map(fn ($s) => [
            'title' => $s['title'] ?? '',
            'marketValue' => $s['marketValue'] ?? 'medium',
        ])->values()->all();

        $improvementArea = $weaknesses[0]['title'] ?? null;

        return [
            'overallScore' => $score->score,
            'percentile' => $score->percentile,
            'grade' => $score->grade,
            'marketReadiness' => $score->market_readiness,
            'breakdown' => collect($score->breakdown_json ?? [])->map(fn ($b) => [
                'category' => $b['category'] ?? null,
                'label' => $b['label'] ?? null,
                'score' => $b['score'] ?? null,
            ])->values()->all(),
            'topStrengths' => $topStrengths,
            'improvementArea' => $improvementArea,
            'ownerDisplayName' => $profile?->display_name,
            'ownerAvatarUrl' => $profile?->profile_photo,
            'ownerPublicSlug' => $profile?->is_profile_public ? $profile->public_slug : null,
            'generatedAt' => $score->generated_at?->toIso8601String(),
        ];
    }
}
