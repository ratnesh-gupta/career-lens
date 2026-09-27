<?php

use App\Models\Payment;
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
    config([
        'billing.razorpay.fake' => true,
        'billing.razorpay.key_id' => 'rzp_test_fake',
        'billing.razorpay.key_secret' => 'test_key_secret',
        'billing.razorpay.webhook_secret' => 'test_webhook_secret',
    ]);
    $this->seed(PlanSeeder::class);
});

test('plans endpoint returns localized price for IN', function () {
    $this->getJson('/api/v1/billing/plans?country=IN&interval=month')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.country', 'IN');

    $pro = collect($this->getJson('/api/v1/billing/plans?country=IN')->json('data.items'))
        ->firstWhere('code', Plan::CODE_PRO);

    expect($pro['price']['currency'])->toBe('INR')
        ->and($pro['price']['amountMinor'])->toBe(49900);
});

test('plans endpoint falls back to default USD for unknown country', function () {
    $pro = collect($this->getJson('/api/v1/billing/plans?country=ZZ')->json('data.items'))
        ->firstWhere('code', Plan::CODE_PRO);

    expect($pro['price']['currency'])->toBe('USD')
        ->and($pro['price']['amountMinor'])->toBe(1200)
        ->and($pro['price']['countryCode'])->toBe('*');
});

test('checkout creates razorpay order and payment row', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/billing/checkout', [
        'planCode' => 'pro',
        'interval' => 'month',
        'countryCode' => 'IN',
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.currency', 'INR')
        ->assertJsonPath('data.amount', 49900);

    expect($response->json('data.orderId'))->toStartWith('order_');

    $this->assertDatabaseHas('payments', [
        'user_id' => $user->id,
        'currency' => 'INR',
        'amount_minor' => 49900,
        'status' => Payment::STATUS_CREATED,
    ]);
});

test('webhook payment.captured activates pro entitlements', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $checkout = $this->postJson('/api/v1/billing/checkout', [
        'planCode' => 'pro',
        'interval' => 'month',
        'countryCode' => 'US',
    ])->json('data');

    $orderId = $checkout['orderId'];

    $payload = [
        'event' => 'payment.captured',
        'event_id' => 'evt_test_1',
        'payload' => [
            'payment' => [
                'entity' => [
                    'id' => 'pay_test_1',
                    'order_id' => $orderId,
                    'status' => 'captured',
                    'notes' => [
                        'user_uuid' => $user->uuid,
                        'plan_code' => 'pro',
                        'interval' => 'month',
                    ],
                ],
            ],
        ],
    ];

    $raw = json_encode($payload, JSON_THROW_ON_ERROR);
    $signature = hash_hmac('sha256', $raw, 'test_webhook_secret');

    $this->call(
        'POST',
        '/api/v1/billing/webhooks/razorpay',
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_RAZORPAY_SIGNATURE' => $signature,
        ],
        $raw,
    )->assertOk()->assertJsonPath('data.status', 'processed');

    $this->assertDatabaseHas('payments', [
        'provider_order_id' => $orderId,
        'status' => Payment::STATUS_PAID,
    ]);

    $sub = Subscription::query()->where('user_id', $user->id)->where('status', 'active')->orderByDesc('id')->first();
    expect($sub)->not->toBeNull()
        ->and($sub->provider)->toBe(Subscription::PROVIDER_RAZORPAY)
        ->and($sub->plan->code)->toBe(Plan::CODE_PRO);

    $service = app(EntitlementService::class);
    expect($service->can($user, FeatureCodes::JD_ANALYSIS))->toBeTrue();
});

test('duplicate webhook is idempotent', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $orderId = $this->postJson('/api/v1/billing/checkout', [
        'planCode' => 'pro',
        'interval' => 'month',
        'countryCode' => 'US',
    ])->json('data.orderId');

    $payload = [
        'event' => 'payment.captured',
        'event_id' => 'evt_dup_1',
        'payload' => [
            'payment' => [
                'entity' => [
                    'id' => 'pay_dup_1',
                    'order_id' => $orderId,
                ],
            ],
        ],
    ];
    $raw = json_encode($payload, JSON_THROW_ON_ERROR);
    $signature = hash_hmac('sha256', $raw, 'test_webhook_secret');

    $headers = [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_X_RAZORPAY_SIGNATURE' => $signature,
    ];

    $this->call('POST', '/api/v1/billing/webhooks/razorpay', [], [], [], $headers, $raw)
        ->assertOk()
        ->assertJsonPath('data.status', 'processed');

    $this->call('POST', '/api/v1/billing/webhooks/razorpay', [], [], [], $headers, $raw)
        ->assertOk()
        ->assertJsonPath('data.status', 'duplicate');

    expect(Subscription::query()->where('user_id', $user->id)->where('provider', Subscription::PROVIDER_RAZORPAY)->count())->toBe(1);
});

test('invalid webhook signature is rejected', function () {
    $payload = ['event' => 'payment.captured', 'event_id' => 'x'];
    $raw = json_encode($payload, JSON_THROW_ON_ERROR);

    $this->call(
        'POST',
        '/api/v1/billing/webhooks/razorpay',
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_RAZORPAY_SIGNATURE' => 'bad',
        ],
        $raw,
    )->assertStatus(400)->assertJsonPath('error.code', 'INVALID_SIGNATURE');
});
