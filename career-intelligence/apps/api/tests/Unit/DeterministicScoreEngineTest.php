<?php

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Models\User;
use App\Modules\CareerScore\Engine\DeterministicScoreEngine;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('same inputs produce identical score for r1a-1.0', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create([
        'display_name' => 'Alex Chen',
        'headline' => 'Senior Frontend Engineer',
        'bio' => 'Builds accessible product UIs with React and TypeScript for five years.',
        'location' => 'San Francisco, CA',
        'current_job_title' => 'Senior Frontend Engineer',
        'experience_years' => 5.0,
        'linkedin_url' => 'https://linkedin.com/in/alex',
        'industry' => 'Technology',
        'career_level' => 'senior',
        'country' => 'US',
    ]);

    $engine = new DeterministicScoreEngine;

    $a = $engine->compute($profile, null, null, 'r1a-1.0');
    $b = $engine->compute($profile, null, null, 'r1a-1.0');

    expect($a['score'])->toBe($b['score'])
        ->and($a['grade'])->toBe($b['grade'])
        ->and($a['score_version'])->toBe('r1a-1.0')
        ->and($a['breakdown'])->toHaveCount(6)
        ->and($a['strengths'])->not->toBeEmpty()
        ->and($a['weaknesses'])->not->toBeEmpty()
        ->and($a['recommendations'])->not->toBeEmpty();
});

test('evidence resume analysis improves resume_quality category', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create([
        'experience_years' => 3,
        'headline' => 'Engineer',
    ]);

    $resume = Resume::factory()->create([
        'user_id' => $user->id,
        'career_profile_id' => $profile->id,
        'status' => Resume::STATUS_ANALYZED,
    ]);

    $analysis = ResumeAnalysis::query()->create([
        'resume_id' => $resume->id,
        'analysis_version' => 'r1a-ai-stub-1.0',
        'ats_score' => 88,
        'readability_score' => 84,
        'keyword_density' => 3.1,
        'keywords_json' => [
            ['term' => 'TypeScript', 'isTechnical' => true, 'isInDemand' => true],
            ['term' => 'React', 'isTechnical' => true, 'isInDemand' => true],
        ],
        'formatting_issues_json' => [],
        'content_suggestions_json' => [],
        'missing_keywords_json' => [],
        'sections_json' => [['type' => 'summary']],
        'status' => 'completed',
        'analyzed_at' => now(),
    ]);

    $engine = new DeterministicScoreEngine;
    $without = $engine->compute($profile, null, null, 'r1a-1.0');
    $with = $engine->compute($profile, $resume, $analysis, 'r1a-1.0');

    $rqWithout = collect($without['breakdown'])->firstWhere('category', 'resume_quality')['score'];
    $rqWith = collect($with['breakdown'])->firstWhere('category', 'resume_quality')['score'];

    expect($rqWith)->toBeGreaterThan($rqWithout)
        ->and($with['score'])->toBeGreaterThanOrEqual($without['score']);
});

test('version weights sum to one for r1a-1.0', function () {
    $weights = \App\Modules\CareerScore\Support\ScoreVersion::weights('r1a-1.0');
    expect(array_sum($weights))->toEqual(1.0);
});
