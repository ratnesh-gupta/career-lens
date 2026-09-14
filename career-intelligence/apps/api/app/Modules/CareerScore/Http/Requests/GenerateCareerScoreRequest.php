<?php

namespace App\Modules\CareerScore\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateCareerScoreRequest extends FormRequest
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
        return [
            'careerProfileId' => ['sometimes', 'nullable', 'uuid'],
            'evidenceResumeId' => ['sometimes', 'nullable', 'uuid'],
            'targetRoleId' => ['sometimes', 'nullable', 'uuid'],
        ];
    }
}
