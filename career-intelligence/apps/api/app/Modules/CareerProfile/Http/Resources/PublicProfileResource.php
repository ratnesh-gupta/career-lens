<?php

namespace App\Modules\CareerProfile\Http\Resources;

use App\Models\CareerProfile;
use App\Models\CareerScore;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Privacy-safe public Career Profile.
 * Never expose salary, internal ids of private data, or non-public profiles.
 *
 * @mixin CareerProfile
 */
class PublicProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var CareerProfile $profile */
        $profile = $this->resource;

        $latestPublicScore = CareerScore::query()
            ->where('career_profile_id', $profile->id)
            ->where('is_public', true)
            ->orderByDesc('generated_at')
            ->first();

        return [
            'publicSlug' => $profile->public_slug,
            'displayName' => $profile->display_name,
            'headline' => $profile->headline,
            'summary' => $profile->bio,
            'location' => $profile->location,
            'country' => $profile->country,
            'currentJobTitle' => $profile->current_job_title,
            'yearsOfExperience' => $profile->experience_years !== null
                ? (float) $profile->experience_years
                : null,
            'careerLevel' => $profile->career_level,
            'industry' => $profile->industry,
            'profilePhoto' => $profile->profile_photo,
            'linkedinUrl' => $profile->linkedin_url,
            'githubUrl' => $profile->github_url,
            'portfolioUrl' => $profile->portfolio_url,
            'isOpenToWork' => (bool) $profile->is_open_to_work,
            // Explicitly omitted: currentSalary, desiredSalary, userId, internal uuid as identity
            'latestPublicScore' => $latestPublicScore ? [
                'overallScore' => $latestPublicScore->score,
                'grade' => $latestPublicScore->grade,
                'percentile' => $latestPublicScore->percentile,
                'marketReadiness' => $latestPublicScore->market_readiness,
                'shareToken' => $latestPublicScore->share_token,
                'generatedAt' => $latestPublicScore->generated_at?->toIso8601String(),
            ] : null,
        ];
    }
}
