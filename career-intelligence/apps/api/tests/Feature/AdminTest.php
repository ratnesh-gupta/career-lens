<?php

use App\Models\CareerProfile;
use App\Models\Resume;
use App\Models\User;
use App\Modules\Resume\Jobs\ProcessResumeJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

test('non admin cannot access admin overview', function () {
    $user = User::factory()->create(['role' => User::ROLE_FREE]);
    Sanctum::actingAs($user);

    $this->getJson('/api/v1/admin/overview')
        ->assertForbidden()
        ->assertJsonPath('error.code', 'FORBIDDEN');
});

test('super admin can view overview', function () {
    $admin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
    Sanctum::actingAs($admin);

    $this->getJson('/api/v1/admin/overview')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonStructure(['data' => ['users', 'profiles', 'resumes', 'scores']]);
});

test('super admin can reprocess any resume', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $profile = CareerProfile::factory()->for($owner)->create();
    $resume = Resume::factory()->create([
        'user_id' => $owner->id,
        'career_profile_id' => $profile->id,
        'status' => Resume::STATUS_FAILED,
        'failure_reason' => 'previous error',
    ]);

    $admin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
    Sanctum::actingAs($admin);

    $this->postJson('/api/v1/admin/resumes/'.$resume->uuid.'/reprocess')
        ->assertOk()
        ->assertJsonPath('data.status', Resume::STATUS_PROCESSING);

    Queue::assertPushed(ProcessResumeJob::class);
    expect($resume->fresh()->failure_reason)->toBeNull();
});

test('admin promote command works', function () {
    $user = User::factory()->create(['email' => 'ops@careerlens.test', 'role' => User::ROLE_FREE]);

    $this->artisan('admin:promote', ['email' => 'ops@careerlens.test'])
        ->assertSuccessful();

    expect($user->fresh()->role)->toBe(User::ROLE_SUPER_ADMIN);
});
