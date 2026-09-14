<?php

use App\Models\CareerProfile;
use App\Models\CareerScore;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('generate score is owned by career profile not resume', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create([
        'headline' => 'Engineer',
        'bio' => 'Builds products.',
        'experience_years' => 5,
        'industry' => 'Technology',
        'career_level' => 'senior',
    ]);
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/scores/generate', [
        'careerProfileId' => $profile->uuid,
        'evidenceResumeId' => null,
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.careerProfileId', $profile->uuid)
        ->assertJsonPath('data.evidenceResumeId', null)
        ->assertJsonPath('data.scoreVersion', 'r1a-1.0');

    expect($response->json('data.overallScore'))->toBeInt()
        ->and($response->json('data.breakdown'))->toBeArray()
        ->and($response->json('data.strengths'))->toBeArray()
        ->and($response->json('data.recommendations'))->toBeArray();

    $this->assertDatabaseHas('career_scores', [
        'career_profile_id' => $profile->id,
        'uuid' => $response->json('data.id'),
        'score_version' => 'r1a-1.0',
    ]);
});

test('list scores returns only current profile scores', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create();
    CareerScore::factory()->for($profile, 'careerProfile')->count(2)->create();

    $other = CareerProfile::factory()->create();
    CareerScore::factory()->for($other, 'careerProfile')->create();

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/scores');

    $response->assertOk()->assertJsonPath('success', true);
    expect($response->json('data'))->toHaveCount(2);
});

test('share creates public token and public endpoint works', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create(['display_name' => 'Alex Chen']);
    $score = CareerScore::factory()->for($profile, 'careerProfile')->create();
    Sanctum::actingAs($user);

    $share = $this->postJson('/api/v1/scores/'.$score->uuid.'/share');

    $share->assertCreated()
        ->assertJsonPath('success', true);

    $token = $share->json('data.token');
    expect($token)->toStartWith('shr_');

    $public = $this->getJson('/api/v1/public/scores/'.$token);

    $public->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.ownerDisplayName', 'Alex Chen')
        ->assertJsonPath('data.overallScore', $score->score);
});

test('public score unknown token is 404 envelope', function () {
    $response = $this->getJson('/api/v1/public/scores/missing');

    $response->assertNotFound()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'NOT_FOUND');
});

test('cannot generate score for another users profile id', function () {
    $user = User::factory()->create();
    CareerProfile::factory()->for($user)->create();
    $other = CareerProfile::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/scores/generate', [
        'careerProfileId' => $other->uuid,
    ]);

    $response->assertForbidden()
        ->assertJsonPath('error.code', 'FORBIDDEN');
});

test('generate is deterministic for identical profile', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create([
        'headline' => 'Fixed Headline',
        'bio' => 'Fixed bio content for determinism.',
        'experience_years' => 4,
        'industry' => 'Technology',
        'career_level' => 'mid',
        'display_name' => 'Fixed Name',
        'location' => 'Remote',
        'current_job_title' => 'Engineer',
    ]);
    Sanctum::actingAs($user);

    $first = $this->postJson('/api/v1/scores/generate', [])->json('data.overallScore');
    $second = $this->postJson('/api/v1/scores/generate', [])->json('data.overallScore');

    expect($first)->toBe($second);
});
