<?php

namespace App\Modules\CareerProfile\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCareerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $profileId = $this->user()?->careerProfile?->id;

        return [
            'headline' => ['sometimes', 'nullable', 'string', 'max:255'],
            'summary' => ['sometimes', 'nullable', 'string', 'max:10000'],
            'location' => ['sometimes', 'nullable', 'string', 'max:200'],
            'country' => ['sometimes', 'nullable', 'string', 'max:100'],
            'linkedinUrl' => ['sometimes', 'nullable', 'url', 'max:500'],
            'githubUrl' => ['sometimes', 'nullable', 'url', 'max:500'],
            'portfolioUrl' => ['sometimes', 'nullable', 'url', 'max:500'],
            'yearsOfExperience' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:80'],
            'currentSalary' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'desiredSalary' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'isOpenToWork' => ['sometimes', 'boolean'],
            'isProfilePublic' => ['sometimes', 'boolean'],
            'publicSlug' => [
                'sometimes',
                'nullable',
                'string',
                'max:120',
                'alpha_dash',
                Rule::unique('career_profiles', 'public_slug')->ignore($profileId),
            ],
            'displayName' => ['sometimes', 'nullable', 'string', 'max:200'],
            'firstName' => ['sometimes', 'nullable', 'string', 'max:100'],
            'lastName' => ['sometimes', 'nullable', 'string', 'max:100'],
            'currentJobTitle' => ['sometimes', 'nullable', 'string', 'max:200'],
            'careerLevel' => ['sometimes', 'nullable', 'string', 'max:50'],
            'industry' => ['sometimes', 'nullable', 'string', 'max:150'],
            'profilePhoto' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ];
    }
}
