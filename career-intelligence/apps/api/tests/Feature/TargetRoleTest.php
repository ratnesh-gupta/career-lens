<?php

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\TargetRole;
use App\Models\User;
use App\Modules\Billing\Actions\EnsureFreeSubscriptionForUser;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
});

test('user can create and list target roles within free limit', function () {
    $user = User::factory()->create();
    app(EnsureFreeSubscriptionForUser::class)($user);
    Sanctum::actingAs($user);

    $this->postJson('/api/v1/target-roles', [
        'roleName' => 'Senior Backend Engineer',
        'industry' => 'Software',
        'seniority' => 'Senior',
        'location' => 'Bengaluru',
    ])->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.roleName', 'Senior Backend Engineer');

    $this->postJson('/api/v1/target-roles', [
        'roleName' => 'Staff Engineer',
    ])->assertCreated();

    $this->getJson('/api/v1/target-roles')
        ->assertOk()
        ->assertJsonCount(2, 'data.items');
});

test('free plan blocks third target role', function () {
    $user = User::factory()->create();
    app(EnsureFreeSubscriptionForUser::class)($user);
    Sanctum::actingAs($user);

    $this->postJson('/api/v1/target-roles', ['roleName' => 'Role 1'])->assertCreated();
    $this->postJson('/api/v1/target-roles', ['roleName' => 'Role 2'])->assertCreated();

    $this->postJson('/api/v1/target-roles', ['roleName' => 'Role 3'])
        ->assertForbidden()
        ->assertJsonPath('error.code', 'ENTITLEMENT_REQUIRED');
});

test('pro plan allows more than two target roles', function () {
    $user = User::factory()->create();
    $pro = Plan::query()->where('code', Plan::CODE_PRO)->firstOrFail();
    Subscription::query()->create([
        'user_id' => $user->id,
        'provider' => Subscription::PROVIDER_INTERNAL,
        'plan_id' => $pro->id,
        'status' => Subscription::STATUS_ACTIVE,
        'started_at' => now(),
    ]);
    Sanctum::actingAs($user);

    for ($i = 1; $i <= 3; $i++) {
        $this->postJson('/api/v1/target-roles', ['roleName' => "Role {$i}"])->assertCreated();
    }

    $this->getJson('/api/v1/target-roles')->assertOk()->assertJsonCount(3, 'data.items');
});

test('user can update and soft-delete own target role', function () {
    $user = User::factory()->create();
    app(EnsureFreeSubscriptionForUser::class)($user);
    Sanctum::actingAs($user);

    $id = $this->postJson('/api/v1/target-roles', [
        'roleName' => 'PM',
    ])->json('data.id');

    $this->patchJson("/api/v1/target-roles/{$id}", [
        'roleName' => 'Product Manager',
        'seniority' => 'Mid',
    ])->assertOk()
        ->assertJsonPath('data.roleName', 'Product Manager');

    $this->deleteJson("/api/v1/target-roles/{$id}")
        ->assertOk()
        ->assertJsonPath('data.deleted', true);

    $this->getJson('/api/v1/target-roles')->assertOk()->assertJsonCount(0, 'data.items');

    expect(TargetRole::withTrashed()->where('uuid', $id)->exists())->toBeTrue();
});

test('cannot access another users target role', function () {
    $owner = User::factory()->create();
    app(EnsureFreeSubscriptionForUser::class)($owner);
    Sanctum::actingAs($owner);
    $id = $this->postJson('/api/v1/target-roles', ['roleName' => 'Secret'])->json('data.id');

    $other = User::factory()->create();
    app(EnsureFreeSubscriptionForUser::class)($other);
    Sanctum::actingAs($other);

    $this->patchJson("/api/v1/target-roles/{$id}", ['roleName' => 'Hacked'])
        ->assertNotFound();
});
