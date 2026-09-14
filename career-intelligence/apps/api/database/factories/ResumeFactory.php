<?php

namespace Database\Factories;

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Resume>
 */
class ResumeFactory extends Factory
{
    protected $model = Resume::class;

    public function definition(): array
    {
        $uuid = (string) Str::uuid();

        return [
            'uuid' => $uuid,
            'user_id' => User::factory(),
            'career_profile_id' => CareerProfile::factory(),
            'original_filename' => 'resume.pdf',
            'storage_path' => 'resumes/'.$uuid.'/resume.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 120_000,
            'status' => Resume::STATUS_PENDING,
            'is_primary' => false,
            'page_count' => null,
            'word_count' => null,
            'uploaded_at' => now(),
            'processed_at' => null,
        ];
    }

    public function analyzed(): static
    {
        return $this->state(fn () => [
            'status' => Resume::STATUS_ANALYZED,
            'page_count' => 2,
            'word_count' => 800,
            'processed_at' => now(),
        ]);
    }
}
