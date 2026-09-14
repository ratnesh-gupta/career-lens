<?php

namespace App\Modules\CareerScore\Actions;

use App\Models\CareerProfile;
use App\Modules\CareerScore\Support\ScoreVersion;

/**
 * Deterministic stub based on profile fields only.
 * Replaced by full weighted engine in sequence #7.
 */
final class ComputeStubCareerScore
{
    /**
     * @return array{
     *     score: int,
     *     grade: string,
     *     percentile: int,
     *     market_readiness: string,
     *     score_version: string,
     *     breakdown: list<array<string, mixed>>
     * }
     */
    public function __invoke(CareerProfile $profile, ?string $evidenceResumeUuid = null): array
    {
        $version = ScoreVersion::CURRENT;
        $weights = ScoreVersion::weights($version);

        $raw = [
            'profile_completeness' => $this->profileCompleteness($profile),
            'experience_signal' => $this->experienceSignal($profile),
            'skills_signal' => $profile->headline || $profile->current_job_title ? 55.0 : 30.0,
            'positioning' => $profile->bio ? min(80.0, 40.0 + mb_strlen($profile->bio) / 20) : 25.0,
            'market_alignment' => $profile->industry || $profile->career_level ? 60.0 : 40.0,
            'evidence_resume' => $evidenceResumeUuid ? 70.0 : 35.0,
        ];

        $weightedSum = 0.0;
        $breakdown = [];

        foreach ($weights as $category => $weight) {
            $categoryScore = round($raw[$category], 1);
            $weighted = round($categoryScore * $weight, 2);
            $weightedSum += $weighted;
            $breakdown[] = [
                'category' => $category,
                'label' => str_replace('_', ' ', ucwords($category, '_')),
                'score' => $categoryScore,
                'maxScore' => 100,
                'weight' => $weight,
                'weightedScore' => $weighted,
                'description' => 'Stub signal for '.$category.' (version '.$version.')',
                'contributingFactors' => [],
            ];
        }

        $score = (int) max(0, min(100, round($weightedSum)));

        return [
            'score' => $score,
            'grade' => $this->grade($score),
            'percentile' => min(99, max(1, $score + 3)),
            'market_readiness' => $this->readiness($score),
            'score_version' => $version,
            'breakdown' => $breakdown,
        ];
    }

    private function profileCompleteness(CareerProfile $profile): float
    {
        $fields = [
            $profile->display_name,
            $profile->headline,
            $profile->bio,
            $profile->location,
            $profile->current_job_title,
            $profile->experience_years,
            $profile->linkedin_url,
            $profile->industry,
        ];

        $filled = count(array_filter($fields, fn ($v) => $v !== null && $v !== ''));

        return round(($filled / count($fields)) * 100, 1);
    }

    private function experienceSignal(CareerProfile $profile): float
    {
        if ($profile->experience_years === null) {
            return 30.0;
        }

        return (float) max(20, min(90, 30 + ((float) $profile->experience_years * 4)));
    }

    private function grade(int $score): string
    {
        return match (true) {
            $score >= 93 => 'A+',
            $score >= 90 => 'A',
            $score >= 87 => 'A-',
            $score >= 83 => 'B+',
            $score >= 80 => 'B',
            $score >= 77 => 'B-',
            $score >= 73 => 'C+',
            $score >= 70 => 'C',
            $score >= 60 => 'C-',
            $score >= 50 => 'D',
            default => 'F',
        };
    }

    private function readiness(int $score): string
    {
        return match (true) {
            $score >= 80 => 'ready',
            $score >= 65 => 'almost-ready',
            $score >= 50 => 'needs-work',
            default => 'significant-gaps',
        };
    }
}
