<?php

namespace App\Modules\CareerProfile\Http\Resources;

use App\Models\CareerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * API shape matches OpenAPI CareerProfile + FE shared-types (camelCase).
 * Nested experiences/educations/skills/goals are empty until later domain steps.
 *
 * @mixin CareerProfile
 */
class CareerProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var CareerProfile $profile */
        $profile = $this->resource;

        return [
            'id' => $profile->uuid,
            'userId' => $profile->user?->uuid ?? (string) $profile->user_id,
            'headline' => $profile->headline,
            'summary' => $profile->bio,
            'location' => $profile->location,
            'linkedinUrl' => $profile->linkedin_url,
            'githubUrl' => $profile->github_url,
            'portfolioUrl' => $profile->portfolio_url,
            'yearsOfExperience' => $profile->experience_years !== null
                ? (float) $profile->experience_years
                : null,
            'currentSalary' => $profile->current_salary,
            'desiredSalary' => $profile->desired_salary,
            'isOpenToWork' => (bool) $profile->is_open_to_work,
            'isProfilePublic' => (bool) $profile->is_profile_public,
            'publicSlug' => $profile->public_slug,
            'displayName' => $profile->display_name,
            'firstName' => $profile->first_name,
            'lastName' => $profile->last_name,
            'currentJobTitle' => $profile->current_job_title,
            'careerLevel' => $profile->career_level,
            'industry' => $profile->industry,
            'profilePhoto' => $profile->profile_photo,
            'country' => $profile->country,
            // Nested collections reserved for later steps — not resume-derived identity
            'experiences' => [],
            'educations' => [],
            'skills' => [],
            'goals' => [],
            'createdAt' => $profile->created_at?->toIso8601String(),
            'updatedAt' => $profile->updated_at?->toIso8601String(),
        ];
    }
}
