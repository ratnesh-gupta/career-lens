<?php

use App\Models\CareerProfile;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
});

test('register creates user profile and returns token envelope', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'email' => 'alex@example.com',
        'password' => 'password123',
        'displayName' => 'Alex Chen',
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.user.email', 'alex@example.com')
        ->assertJsonPath('data.user.displayName', 'Alex Chen')
        ->assertJsonStructure(['data' => ['accessToken', 'refreshToken', 'expiresAt', 'user']]);

    $this->assertDatabaseHas('users', ['email' => 'alex@example.com']);
    expect(CareerProfile::query()->count())->toBe(1);
});

test('login returns token for valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'alex@example.com',
        'password' => 'password123',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'alex@example.com',
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.user.email', $user->email);
    expect($response->json('data.accessToken'))->toBeString()->not->toBeEmpty();
});

test('login rejects bad password with validation envelope', function () {
    User::factory()->create(['email' => 'alex@example.com', 'password' => 'password123']);

    $this->postJson('/api/v1/auth/login', [
        'email' => 'alex@example.com',
        'password' => 'wrong',
    ])->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'VALIDATION_ERROR');
});

test('me requires auth and returns user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('data.email', $user->email)
        ->assertJsonPath('data.id', $user->uuid);
});

test('me without token is 401 envelope', function () {
    $this->getJson('/api/v1/auth/me')
        ->assertUnauthorized()
        ->assertJsonPath('error.code', 'UNAUTHENTICATED');
});
