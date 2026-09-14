<?php

use App\Models\CareerProfile;
use App\Models\CareerScore;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('public profile requires is_profile_public', function () {
    $user = User::factory()->create();
    CareerProfile::factory()->for($user)->create([
        'public_slug' => 'alex-chen',
        'is_profile_public' => false,
        'display_name' => 'Alex Chen',
    ]);

    $this->getJson('/api/v1/public/profiles/alex-chen')
        ->assertNotFound()
        ->assertJsonPath('error.code', 'NOT_FOUND');
});

test('public profile returns privacy-safe payload without salary', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create([
        'public_slug' => 'alex-chen',
        'is_profile_public' => true,
        'display_name' => 'Alex Chen',
        'headline' => 'Senior Frontend Engineer',
        'bio' => 'Builds product UIs.',
        'current_salary' => 180000,
        'desired_salary' => 220000,
    ]);

    CareerScore::factory()->for($profile, 'careerProfile')->public()->create([
        'score' => 81,
        'grade' => 'B+',
    ]);

    $response = $this->getJson('/api/v1/public/profiles/alex-chen');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.displayName', 'Alex Chen')
        ->assertJsonPath('data.headline', 'Senior Frontend Engineer')
        ->assertJsonPath('data.latestPublicScore.overallScore', 81)
        ->assertJsonMissingPath('data.currentSalary')
        ->assertJsonMissingPath('data.desiredSalary')
        ->assertJsonMissingPath('data.userId');
});

test('unknown public slug is 404', function () {
    $this->getJson('/api/v1/public/profiles/does-not-exist')
        ->assertNotFound()
        ->assertJsonPath('error.code', 'NOT_FOUND');
});
