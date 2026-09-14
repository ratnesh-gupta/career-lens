<?php

namespace App\Modules\CareerProfile\Actions;

use App\Models\CareerProfile;
use Illuminate\Support\Str;

final class UpdateCareerProfile
{
    /**
     * @param  array<string, mixed>  $input  camelCase API fields
     */
    public function __invoke(CareerProfile $profile, array $input): CareerProfile
    {
        $map = [
            'headline' => 'headline',
            'summary' => 'bio',
            'location' => 'location',
            'country' => 'country',
            'linkedinUrl' => 'linkedin_url',
            'githubUrl' => 'github_url',
            'portfolioUrl' => 'portfolio_url',
            'yearsOfExperience' => 'experience_years',
            'currentSalary' => 'current_salary',
            'desiredSalary' => 'desired_salary',
            'isOpenToWork' => 'is_open_to_work',
            'isProfilePublic' => 'is_profile_public',
            'publicSlug' => 'public_slug',
            'displayName' => 'display_name',
            'firstName' => 'first_name',
            'lastName' => 'last_name',
            'currentJobTitle' => 'current_job_title',
            'careerLevel' => 'career_level',
            'industry' => 'industry',
            'profilePhoto' => 'profile_photo',
        ];

        $attributes = [];

        foreach ($map as $apiKey => $column) {
            if (array_key_exists($apiKey, $input)) {
                $attributes[$column] = $input[$apiKey];
            }
        }

        if (isset($attributes['public_slug']) && is_string($attributes['public_slug'])) {
            $attributes['public_slug'] = Str::slug($attributes['public_slug']) ?: null;
        }

        $profile->fill($attributes);
        $profile->save();

        return $profile->refresh();
    }
}
