<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Contracts\RazorpayClient;
use Illuminate\Support\Str;

/**
 * Deterministic client for local/testing — no external HTTP.
 */
final class FakeRazorpayClient implements RazorpayClient
{
    public function createOrder(array $payload): array
    {
        return [
            'id' => 'order_fake_'.Str::lower(Str::random(14)),
            'amount' => (int) $payload['amount'],
            'currency' => strtoupper((string) $payload['currency']),
            'status' => 'created',
            'receipt' => $payload['receipt'] ?? null,
        ];
    }

    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $secret = (string) config('billing.razorpay.webhook_secret', 'test_webhook_secret');

        $expected = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }

    public function verifyPaymentSignature(string $orderId, string $paymentId, string $signature): bool
    {
        $secret = (string) config('billing.razorpay.key_secret', 'test_key_secret');
        $expected = hash_hmac('sha256', $orderId.'|'.$paymentId, $secret);

        return hash_equals($expected, $signature);
    }
}
