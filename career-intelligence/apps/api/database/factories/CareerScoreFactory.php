<?php

namespace Database\Factories;

use App\Models\CareerProfile;
use App\Models\CareerScore;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CareerScore>
 */
class CareerScoreFactory extends Factory
{
    protected $model = CareerScore::class;

    public function definition(): array
    {
        $score = fake()->numberBetween(45, 92);

        return [
            'uuid' => (string) Str::uuid(),
            'career_profile_id' => CareerProfile::factory(),
            'evidence_resume_uuid' => null,
            'target_role_uuid' => null,
            'score' => $score,
            'score_version' => 'r1a-stub-1.0',
            'status' => 'completed',
            'grade' => match (true) {
                $score >= 90 => 'A',
                $score >= 80 => 'B+',
                $score >= 70 => 'B',
                $score >= 60 => 'C+',
                default => 'C',
            },
            'percentile' => min(99, $score + fake()->numberBetween(-5, 10)),
            'market_readiness' => match (true) {
                $score >= 80 => 'ready',
                $score >= 65 => 'almost-ready',
                $score >= 50 => 'needs-work',
                default => 'significant-gaps',
            },
            'breakdown_json' => [],
            'meta_json' => [],
            'share_token' => null,
            'is_public' => false,
            'generated_at' => now(),
            'expires_at' => now()->addDays(30),
        ];
    }

    public function public(): static
    {
        return $this->state(fn () => [
            'is_public' => true,
            'share_token' => 'shr_'.Str::lower(Str::random(16)),
        ]);
    }
}
