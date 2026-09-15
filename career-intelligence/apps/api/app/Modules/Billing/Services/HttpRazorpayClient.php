<?php

namespace App\Modules\Billing\Services;

use App\Modules\Billing\Contracts\RazorpayClient;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class HttpRazorpayClient implements RazorpayClient
{
    public function createOrder(array $payload): array
    {
        $keyId = (string) config('billing.razorpay.key_id');
        $keySecret = (string) config('billing.razorpay.key_secret');

        if ($keyId === '' || $keySecret === '') {
            throw new RuntimeException('Razorpay keys are not configured.');
        }

        $response = Http::withBasicAuth($keyId, $keySecret)
            ->acceptJson()
            ->post('https://api.razorpay.com/v1/orders', [
                'amount' => (int) $payload['amount'],
                'currency' => strtoupper((string) $payload['currency']),
                'receipt' => $payload['receipt'] ?? null,
                'notes' => $payload['notes'] ?? [],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Razorpay order create failed: '.$response->body());
        }

        /** @var array{id: string, amount: int, currency: string, status: string} $data */
        $data = $response->json();

        return [
            'id' => $data['id'],
            'amount' => (int) $data['amount'],
            'currency' => strtoupper((string) $data['currency']),
            'status' => (string) ($data['status'] ?? 'created'),
            'receipt' => $data['receipt'] ?? null,
        ];
    }

    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $secret = (string) config('billing.razorpay.webhook_secret');

        if ($secret === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }

    public function verifyPaymentSignature(string $orderId, string $paymentId, string $signature): bool
    {
        $secret = (string) config('billing.razorpay.key_secret');

        if ($secret === '') {
            return false;
        }

        $expected = hash_hmac('sha256', $orderId.'|'.$paymentId, $secret);

        return hash_equals($expected, $signature);
    }
}
