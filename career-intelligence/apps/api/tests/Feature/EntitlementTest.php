<?php

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Modules\Billing\FeatureCodes;
use App\Modules\Billing\Services\EntitlementService;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
});

test('register assigns free internal subscription', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'email' => 'free@example.com',
        'password' => 'password123',
        'displayName' => 'Free User',
    ]);

    $response->assertCreated();

    $user = User::query()->where('email', 'free@example.com')->firstOrFail();

    $this->assertDatabaseHas('subscriptions', [
        'user_id' => $user->id,
        'provider' => Subscription::PROVIDER_INTERNAL,
        'status' => Subscription::STATUS_ACTIVE,
    ]);

    $sub = Subscription::query()->where('user_id', $user->id)->firstOrFail();
    expect($sub->plan->code)->toBe(Plan::CODE_FREE);
});

test('public plans list returns free and pro', function () {
    $this->getJson('/api/v1/billing/plans')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonCount(2, 'data.items');
});

test('entitlements snapshot returns free limits for new user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/billing/entitlements');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.plan.code', Plan::CODE_FREE);

    $features = collect($response->json('data.features'));
    $sessions = $features->firstWhere('code', FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH);

    expect($sessions['limit'])->toBe(1)
        ->and($sessions['remaining'])->toBe(1)
        ->and($sessions['allowed'])->toBeTrue();

    $jd = $features->firstWhere('code', FeatureCodes::JD_ANALYSIS);
    expect($jd['allowed'])->toBeFalse();
});

test('consume blocks when metered limit exceeded', function () {
    $user = User::factory()->create();
    app(\App\Modules\Billing\Actions\EnsureFreeSubscriptionForUser::class)($user);

    /** @var EntitlementService $service */
    $service = app(EntitlementService::class);

    expect($service->can($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH))->toBeTrue();
    expect($service->consume($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH))->toBeTrue();
    expect($service->can($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH))->toBeFalse();
    expect($service->consume($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH))->toBeFalse();
    expect($service->remaining($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH))->toBe(0);
});

test('pro plan unlocks jd analysis and higher limits', function () {
    $user = User::factory()->create();
    $pro = Plan::query()->where('code', Plan::CODE_PRO)->firstOrFail();

    Subscription::query()->create([
        'user_id' => $user->id,
        'provider' => Subscription::PROVIDER_INTERNAL,
        'plan_id' => $pro->id,
        'status' => Subscription::STATUS_ACTIVE,
        'started_at' => now(),
    ]);

    /** @var EntitlementService $service */
    $service = app(EntitlementService::class);

    expect($service->resolvePlan($user)->code)->toBe(Plan::CODE_PRO);
    expect($service->can($user, FeatureCodes::JD_ANALYSIS))->toBeTrue();
    expect($service->remaining($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH))->toBe(30);
});

test('entitlement middleware denies when over limit', function () {
    $user = User::factory()->create();
    app(\App\Modules\Billing\Actions\EnsureFreeSubscriptionForUser::class)($user);
    app(EntitlementService::class)->consume($user, FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH);

    Sanctum::actingAs($user);

    // Temporary route to exercise middleware in isolation
    \Illuminate\Support\Facades\Route::middleware(['api', 'auth:sanctum', 'entitlement:'.FeatureCodes::OPTIMIZATION_SESSIONS_PER_MONTH])
        ->get('/api/v1/_test/entitlement-gate', fn () => response()->json(['ok' => true]));

    $this->getJson('/api/v1/_test/entitlement-gate')
        ->assertForbidden()
        ->assertJsonPath('error.code', 'ENTITLEMENT_REQUIRED');
});

test('super admin bypasses entitlement checks', function () {
    $user = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);

    /** @var EntitlementService $service */
    $service = app(EntitlementService::class);

    expect($service->can($user, FeatureCodes::JD_ANALYSIS))->toBeTrue();
    expect($service->remaining($user, FeatureCodes::AI_REWRITES_PER_MONTH))->toBeNull();
});
