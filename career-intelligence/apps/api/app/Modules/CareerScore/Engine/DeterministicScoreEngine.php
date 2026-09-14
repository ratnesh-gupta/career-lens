<?php

namespace App\Modules\CareerScore\Engine;

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Modules\CareerScore\Support\ScoreVersion;

/**
 * Pure deterministic Career Score.
 * Same profile + evidence + version ⇒ same overall score and breakdown.
 */
final class DeterministicScoreEngine
{
    /**
     * @return array{
     *     score: int,
     *     grade: string,
     *     percentile: int,
     *     market_readiness: string,
     *     score_version: string,
     *     breakdown: list<array<string, mixed>>,
     *     strengths: list<array<string, mixed>>,
     *     weaknesses: list<array<string, mixed>>,
     *     recommendations: list<array<string, mixed>>,
     *     industry_benchmark: int,
     *     role_match: int
     * }
     */
    public function compute(
        CareerProfile $profile,
        ?Resume $evidenceResume = null,
        ?ResumeAnalysis $analysis = null,
        ?string $version = null,
    ): array {
        $version ??= ScoreVersion::current();
        $weights = ScoreVersion::weights($version);
        $labels = ScoreVersion::labels($version);

        $raw = $this->rawCategoryScores($profile, $evidenceResume, $analysis, $version);

        $weightedSum = 0.0;
        $breakdown = [];

        foreach ($weights as $category => $weight) {
            $categoryScore = round($raw[$category] ?? 0.0, 1);
            $weighted = round($categoryScore * $weight, 2);
            $weightedSum += $weighted;

            $breakdown[] = [
                'category' => $category,
                'label' => $labels[$category] ?? str_replace('_', ' ', ucwords($category, '_')),
                'score' => $categoryScore,
                'maxScore' => 100,
                'weight' => $weight,
                'weightedScore' => $weighted,
                'percentile' => $this->categoryPercentile($categoryScore),
                'description' => $this->categoryDescription($category, $categoryScore),
                'contributingFactors' => $this->contributingFactors($category, $profile, $analysis),
            ];
        }

        $score = (int) max(0, min(100, (int) round($weightedSum)));

        return [
            'score' => $score,
            'grade' => $this->grade($score),
            'percentile' => $this->overallPercentile($score),
            'market_readiness' => $this->readiness($score),
            'score_version' => $version,
            'breakdown' => $breakdown,
            'strengths' => $this->strengths($breakdown, $profile, $analysis),
            'weaknesses' => $this->weaknesses($breakdown),
            'recommendations' => $this->recommendations($breakdown, $profile, $analysis),
            'industry_benchmark' => 68,
            'role_match' => $this->roleMatch($raw),
        ];
    }

    /**
     * @return array<string, float>
     */
    private function rawCategoryScores(
        CareerProfile $profile,
        ?Resume $resume,
        ?ResumeAnalysis $analysis,
        string $version,
    ): array {
        // r1a-1.0 categories
        if (str_starts_with($version, 'r1a-1')) {
            return [
                'profile_completeness' => $this->profileCompleteness($profile),
                'resume_quality' => $this->resumeQuality($resume, $analysis),
                'experience' => $this->experience($profile, $analysis),
                'skill_alignment' => $this->skillAlignment($profile, $analysis),
                'career_progression' => $this->careerProgression($profile),
                'target_role_alignment' => $this->targetRoleAlignment($profile),
            ];
        }

        // Legacy stub categories for old version key
        return [
            'profile_completeness' => $this->profileCompleteness($profile),
            'experience_signal' => $this->experience($profile, $analysis),
            'skills_signal' => $this->skillAlignment($profile, $analysis),
            'positioning' => $profile->bio ? min(80.0, 40.0 + mb_strlen((string) $profile->bio) / 20) : 25.0,
            'market_alignment' => $profile->industry || $profile->career_level ? 60.0 : 40.0,
            'evidence_resume' => $resume ? 70.0 : 35.0,
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
            $profile->career_level,
            $profile->country,
        ];

        $filled = count(array_filter($fields, fn ($v) => $v !== null && $v !== ''));

        return round(($filled / count($fields)) * 100, 1);
    }

    private function resumeQuality(?Resume $resume, ?ResumeAnalysis $analysis): float
    {
        if ($resume === null) {
            return 28.0;
        }

        if ($analysis === null) {
            return $resume->status === Resume::STATUS_ANALYZED ? 50.0 : 35.0;
        }

        $ats = (float) ($analysis->ats_score ?? 50);
        $read = (float) ($analysis->readability_score ?? 50);
        $issues = count($analysis->formatting_issues_json ?? []);
        $issuePenalty = min(15.0, $issues * 3.0);

        return round(max(15.0, min(100.0, ($ats * 0.55) + ($read * 0.45) - $issuePenalty)), 1);
    }

    private function experience(CareerProfile $profile, ?ResumeAnalysis $analysis): float
    {
        $years = $profile->experience_years;
        $base = $years === null
            ? 32.0
            : max(20.0, min(92.0, 28.0 + ((float) $years * 4.5)));

        if ($analysis && is_array($analysis->sections_json) && count($analysis->sections_json) > 0) {
            $base = min(95.0, $base + 5.0);
        }

        return round($base, 1);
    }

    private function skillAlignment(CareerProfile $profile, ?ResumeAnalysis $analysis): float
    {
        $base = 30.0;

        if ($profile->headline || $profile->current_job_title) {
            $base += 15.0;
        }
        if ($profile->industry) {
            $base += 8.0;
        }

        $keywords = $analysis?->keywords_json ?? [];
        $inDemand = 0;
        foreach ($keywords as $kw) {
            if (! empty($kw['isInDemand']) || ! empty($kw['isTechnical'])) {
                $inDemand++;
            }
        }
        $base += min(35.0, $inDemand * 8.0);

        $missing = count($analysis?->missing_keywords_json ?? []);
        $base -= min(15.0, $missing * 3.0);

        return round(max(15.0, min(100.0, $base)), 1);
    }

    private function careerProgression(CareerProfile $profile): float
    {
        $level = strtolower((string) $profile->career_level);
        $levelScore = match (true) {
            str_contains($level, 'lead') || str_contains($level, 'principal') => 88.0,
            str_contains($level, 'senior') => 78.0,
            str_contains($level, 'mid') => 65.0,
            str_contains($level, 'junior') || str_contains($level, 'entry') => 48.0,
            default => 40.0,
        };

        $yearsBoost = $profile->experience_years !== null
            ? min(12.0, (float) $profile->experience_years)
            : 0.0;

        return round(min(95.0, $levelScore + $yearsBoost * 0.8), 1);
    }

    private function targetRoleAlignment(CareerProfile $profile): float
    {
        // Without target_roles table (# later), use profile intent signals only
        $score = 40.0;

        if ($profile->desired_salary) {
            $score += 10.0;
        }
        if ($profile->is_open_to_work) {
            $score += 8.0;
        }
        if ($profile->headline) {
            $score += 12.0;
        }
        if ($profile->industry) {
            $score += 10.0;
        }

        return round(min(90.0, $score), 1);
    }

    private function categoryPercentile(float $score): int
    {
        return (int) max(1, min(99, (int) round($score * 0.95)));
    }

    private function overallPercentile(int $score): int
    {
        return (int) max(1, min(99, $score - 2));
    }

    private function categoryDescription(string $category, float $score): string
    {
        $band = $score >= 75 ? 'strong' : ($score >= 55 ? 'moderate' : 'weak');

        return match ($category) {
            'profile_completeness' => "Profile completeness is {$band}.",
            'resume_quality' => "Resume quality signal is {$band}.",
            'experience' => "Experience depth is {$band}.",
            'skill_alignment' => "Skill alignment is {$band}.",
            'career_progression' => "Career progression signal is {$band}.",
            'target_role_alignment' => "Target role alignment is {$band}.",
            default => "Category {$category} is {$band}.",
        };
    }

    /**
     * @return list<string>
     */
    private function contributingFactors(string $category, CareerProfile $profile, ?ResumeAnalysis $analysis): array
    {
        return match ($category) {
            'profile_completeness' => array_values(array_filter([
                $profile->headline ? 'Headline set' : null,
                $profile->bio ? 'Bio present' : null,
                $profile->linkedin_url ? 'LinkedIn linked' : null,
            ])),
            'resume_quality' => array_values(array_filter([
                $analysis?->ats_score !== null ? 'ATS score '.$analysis->ats_score : null,
                $analysis?->readability_score !== null ? 'Readability '.$analysis->readability_score : null,
            ])),
            'skill_alignment' => array_slice(
                array_map(
                    fn ($k) => is_array($k) ? (string) ($k['term'] ?? '') : '',
                    $analysis?->keywords_json ?? []
                ),
                0,
                5
            ),
            default => [],
        };
    }

    /**
     * @param  list<array<string, mixed>>  $breakdown
     * @return list<array<string, mixed>>
     */
    private function strengths(array $breakdown, CareerProfile $profile, ?ResumeAnalysis $analysis): array
    {
        $top = collect($breakdown)->sortByDesc('score')->take(2)->values();

        return $top->map(function (array $row, int $i) use ($profile) {
            return [
                'id' => 'str_'.($i + 1),
                'title' => $row['label'],
                'description' => $row['description'],
                'marketValue' => ($row['score'] ?? 0) >= 80 ? 'high' : (($row['score'] ?? 0) >= 60 ? 'medium' : 'low'),
                'relatedSkills' => [],
                'supportingEvidence' => $profile->headline
                    ? 'Profile headline: '.$profile->headline
                    : 'Derived from category score '.$row['score'],
            ];
        })->all();
    }

    /**
     * @param  list<array<string, mixed>>  $breakdown
     * @return list<array<string, mixed>>
     */
    private function weaknesses(array $breakdown): array
    {
        $bottom = collect($breakdown)->sortBy('score')->take(2)->values();

        return $bottom->map(function (array $row, int $i) {
            $impact = (int) max(3, min(15, (100 - ($row['score'] ?? 0)) / 6));

            return [
                'id' => 'wk_'.($i + 1),
                'title' => 'Improve '.$row['label'],
                'description' => $row['description'],
                'impactOnScore' => $impact,
                'relatedSkills' => [],
                'improvementPath' => 'Focus on raising '.$row['category'].' through profile and evidence updates.',
            ];
        })->all();
    }

    /**
     * @param  list<array<string, mixed>>  $breakdown
     * @return list<array<string, mixed>>
     */
    private function recommendations(array $breakdown, CareerProfile $profile, ?ResumeAnalysis $analysis): array
    {
        $recs = [];
        $i = 1;

        if (! $profile->bio) {
            $recs[] = $this->rec($i++, 'Add a professional summary', 'Write a 3–4 sentence bio on your Career Profile.', 'critical', 'resume', 6);
        }

        $weak = collect($breakdown)->sortBy('score')->first();
        if ($weak) {
            $recs[] = $this->rec(
                $i++,
                'Strengthen '.$weak['label'],
                $weak['description'],
                'high',
                'skills',
                (int) max(4, min(10, (100 - $weak['score']) / 8)),
            );
        }

        if ($analysis && count($analysis->missing_keywords_json ?? []) > 0) {
            $missing = implode(', ', array_slice($analysis->missing_keywords_json, 0, 3));
            $recs[] = $this->rec($i++, 'Cover missing keywords', 'Consider evidence for: '.$missing, 'medium', 'skills', 5);
        }

        if ($recs === []) {
            $recs[] = $this->rec($i, 'Keep evidence fresh', 'Re-score after major profile or resume updates.', 'low', 'experience', 2);
        }

        return $recs;
    }

    /**
     * @return array<string, mixed>
     */
    private function rec(
        int $id,
        string $title,
        string $description,
        string $priority,
        string $category,
        int $impact,
    ): array {
        return [
            'id' => 'rec_'.$id,
            'title' => $title,
            'description' => $description,
            'priority' => $priority,
            'category' => $category,
            'estimatedImpact' => $impact,
            'timeToImplement' => '1–7 days',
            'resources' => [],
            'isCompleted' => false,
        ];
    }

    /**
     * @param  array<string, float>  $raw
     */
    private function roleMatch(array $raw): int
    {
        $signal = ($raw['skill_alignment'] ?? 50) * 0.6 + ($raw['target_role_alignment'] ?? 50) * 0.4;

        return (int) max(1, min(99, round($signal)));
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
