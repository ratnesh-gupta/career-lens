<?php

use App\Models\CareerProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('unauthenticated profile request returns envelope 401', function () {
    $response = $this->getJson('/api/v1/profile');

    $response->assertUnauthorized()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'UNAUTHENTICATED');

    expect($response->json('error.message'))->not->toContain('Route [login]');
});

test('get profile creates canonical career profile when missing', function () {
    $user = User::factory()->create(['name' => 'Alex Chen']);
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/profile');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.userId', $user->uuid)
        ->assertJsonPath('data.displayName', 'Alex Chen')
        ->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'userId',
                'headline',
                'summary',
                'isOpenToWork',
                'isProfilePublic',
                'publicSlug',
                'experiences',
                'educations',
                'skills',
                'goals',
                'createdAt',
                'updatedAt',
            ],
            'meta',
        ]);

    expect(CareerProfile::query()->where('user_id', $user->id)->count())->toBe(1);
    expect($response->json('data.id'))->toBe(
        CareerProfile::query()->where('user_id', $user->id)->value('uuid')
    );
});

test('patch profile updates fields and maps summary to bio', function () {
    $user = User::factory()->create();
    $profile = CareerProfile::factory()->for($user)->create([
        'headline' => 'Old headline',
        'bio' => 'Old bio',
    ]);
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/profile', [
        'headline' => 'Senior Frontend Engineer',
        'summary' => 'Builds products with React and TypeScript.',
        'isOpenToWork' => true,
        'yearsOfExperience' => 5.5,
        'desiredSalary' => 200000,
    ]);

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.headline', 'Senior Frontend Engineer')
        ->assertJsonPath('data.summary', 'Builds products with React and TypeScript.')
        ->assertJsonPath('data.isOpenToWork', true)
        ->assertJsonPath('data.yearsOfExperience', 5.5)
        ->assertJsonPath('data.desiredSalary', 200000);

    $profile->refresh();
    expect($profile->headline)->toBe('Senior Frontend Engineer');
    expect($profile->bio)->toBe('Builds products with React and TypeScript.');
    expect($profile->is_open_to_work)->toBeTrue();
});

test('profile validation errors use envelope', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/v1/profile', [
        'linkedinUrl' => 'not-a-url',
        'yearsOfExperience' => -1,
    ]);

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'VALIDATION_ERROR');
});

test('user has at most one career profile', function () {
    $user = User::factory()->create();
    CareerProfile::factory()->for($user)->create();

    expect(fn () => CareerProfile::factory()->for($user)->create())
        ->toThrow(\Illuminate\Database\QueryException::class);
});
